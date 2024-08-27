import User from '../models/user.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { hash } from 'bcrypt';
import {
  isEmpty,
  validateEmail,
  validatePassword,
  validatePhoneNumber,
} from '../utils/validation.js';

const signUp = async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNo, password } = req.body;
    const requiredFields = [firstName, email, password];
    for (const [key, value] of Object.entries(requiredFields)) {
      if (isEmpty(value)) {
        return res.status(400).json({ error: `${value} can't be empty` });
      }
    }
    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Invalid Email' });
    }
    if (!validatePassword(password)) {
      return res
        .status(400)
        .json({ error: "Password doesn't meet security requirements" });
    }
    if (!validatePhoneNumber(phoneNo)) {
      return res.status(400).json({ error: 'Invalid Phone Number' });
    }
    const existedUser = await User.findOne({ email: email });
    if (existedUser) {
      return res
        .status(400)
        .json({ error: 'User with this email already exists' });
    }
    let avatar;
    if (
      req.files &&
      Array.isArray(req.files.avatar) &&
      req.files.avatar.length > 0
    ) {
      const avatarLocalPath = req.files.avatar[0].path;
      if (avatarLocalPath) {
        avatar = await uploadOnCloudinary(avatarLocalPath);
      }
    }
    const newUser = await User.create({
      name: {
        firstName: firstName,
        lastName: lastName ? lastName : undefined,
      },
      email: email,
      password: await hash(password, 10),
      phoneNo: phoneNo,
      avatar: avatar ? avatar : undefined,
      role: 'customer'
    });
    return res.status(201).json({
      message: 'New User Registered',
      details: await User.findById(newUser._id).select('-password -merchant'),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export { signUp };
