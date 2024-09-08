import { compare } from 'bcrypt';
import User from '../models/user.model.js';
import { isEmpty, validatePassword, validatePhoneNumber } from '../utils/validation.js';

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
    if (!isEmpty(currentPassword)) {
      return res.status(400).json({ error: "currentPassword can't be empty" });
    }
    const checkPassword = compare(findUser.password, currentPassword);
    if (!checkPassword) {
      return res
        .status(400)
        .json({ error: 'currentPassword you entered is incorrect' });
    }
    if (!isEmpty(newPassword)) {
      return res.status(400).json({ error: "newPassword can't be empty" });
    }
    if (!validatePassword(newPassword)) {
      return res
        .status(400)
        .json({ error: "newPassword doesn't meet the security requirements" });
    }
    if (newPassword != confirmPassword) {
      return res
        .status(400)
        .json({ error: 'confirmPassword should be same as the newPassword' });
    }
    findUser.password = confirmPassword;
    await findUser.save({ validateBeforeSave: false });
    return res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const updateUserDetails = async (req, res) => {
  try {
    const { firstName, lastName, phoneNo } = req.body
    const findUser = await User.findById(req.user._id)
    if(!isEmpty(firstName)){
      return res.status(400).json({ error: "firstName can't be empty "})
    }
    firstName = firstName ? firstName : findUser.name.firstName
    lastName = lastName ? lastName : findUser.name.lastName
    phoneNo = validatePhoneNumber(phoneNo) ? phoneNo : findUser.phoneNo
    await findUser.save({validateBeforeSave: false})
    return res.status(200).json({ message: "User details updated" })
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" })
  }
};

const deleteAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    return res.status(200).json({ message: 'Account deleted succesfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" })
  }
};

export { getUser, logout, changePassword, updateUserDetails, deleteAccount };
