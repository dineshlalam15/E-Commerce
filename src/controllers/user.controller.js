import bcrypt from 'bcrypt';
import User from '../models/user.model.js';
import {
  isEmpty,
  validatePassword,
  validatePhoneNumber,
} from '../utils/validation.js';
import { uploadToAzure, deleteFromAzure } from '../utils/azure.js';

const getUser = async (req, res) => {
  try {
    const findUser = await User.findById(req.user._id).select(
      '-password -refreshToken -accessToken'
    );
    return res.status(200).json({
      message: 'User details fetched',
      details: findUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const logout = async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $unset: {
          refreshToken: '',
          accessToken: '',
        },
      },
      { new: true }
    );
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    return res.status(200).json({ message: 'User logged out successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const findUser = await User.findById(req.user._id);
    if (isEmpty(currentPassword)) {
      return res.status(400).json({ error: "currentPassword can't be empty" });
    }
    const checkPassword = bcrypt.compare(findUser.password, currentPassword);
    if (!checkPassword) {
      return res
        .status(400)
        .json({ error: 'currentPassword you entered is incorrect' });
    }
    if (isEmpty(newPassword)) {
      return res.status(400).json({ error: "newPassword can't be empty" });
    }
    if (!validatePassword(newPassword)) {
      return res
        .status(400)
        .json({ error: "newPassword doesn't meet the security requirements" });
    }
    if (newPassword !== confirmPassword) {
      return res
        .status(400)
        .json({ error: 'confirmPassword should be same as the newPassword' });
    }
    findUser.password = await bcrypt.hash(confirmPassword, 10);
    await findUser.save({ validateBeforeSave: false });
    return res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const updateUserDetails = async (req, res) => {
  try {
    let { firstName, lastName, phoneNo } = req.body;
    const findUser = await User.findById(req.user._id);
    if (!findUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (isEmpty(firstName)) {
      firstName = findUser.name.firstName;
    }
    if (!isEmpty(phoneNo) && !validatePhoneNumber(phoneNo)) {
      phoneNo = findUser.phoneNo;
    }
    await User.findByIdAndUpdate(
      findUser._id,
      {
        $set: {
          firstName: firstName,
          lastName: lastName,
          phoneNo: phoneNo,
        },
      },
      { new: true }
    );
    return res.status(200).json({ message: 'User details updated' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const updateAvatar = async (req, res) => {
  try {
    const findUser = await User.findById(req.user._id);
    let avatar;
    if (
      req.files &&
      Array.isArray(req.files.avatar) &&
      req.files.avatar.length > 0
    ) {
      if (findUser.avatar) {
        await deleteFromAzure(findUser.avatar);
      }
      const avatarLocalPath = req.files.avatar[0].path;
      if (avatarLocalPath) {
        avatar = await uploadToAzure(avatarLocalPath);
      }
    }
    findUser.avatar = avatar;
    await findUser.save({ validateBeforeSave: false });
    return res.status(200).json({ message: 'Avatar updated successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const deleteAvatar = async (req, res) => {
  try {
    if (!req.user.avatar) {
      return res.status(400).json({ error: 'No avatar to delete' });
    }
    await deleteFromAzure(req.user.avatar);
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          avatar: '',
        },
      },
      { new: true }
    );
    return res.status(200).json({ message: 'Avatar successfully deleted' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const deleteAccount = async (req, res) => {
  try {
    if (req.user.avatar) {
      await deleteFromAzure(req.user.avatar);
    }
    await User.findByIdAndDelete(req.user._id);
    return res.status(200).json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export {
  getUser,
  logout,
  changePassword,
  updateUserDetails,
  updateAvatar,
  deleteAccount,
  deleteAvatar,
};
