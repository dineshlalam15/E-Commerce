import User from '../models/user.model.js';
import { uploadToAzure } from '../utils/azure.js';
import jwt from 'jsonwebtoken';
import { hash, compare } from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();
import {
  isEmpty,
  validateEmail,
  validatePassword,
  validatePhoneNumber,
} from '../utils/validation.js';

const generateTokens = async (user) => {
  const payload = {
    _id: user._id,
  };
  const secretKey = process.env.SECRET_TOKEN;
  const refreshTokenOptions = {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  };
  const accessTokenOptions = {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  };
  const refreshToken = jwt.sign(payload, secretKey, refreshTokenOptions);
  const accessToken = jwt.sign(payload, secretKey, accessTokenOptions);
  return { refreshToken, accessToken };
};

const refreshAccessToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ message: 'Invalid refreshToken' });
  }
  jwt.verify(refreshToken, process.env.SECRET_TOKEN, async (err, user) => {
    if (err) {
      return res
        .sendStatus(403)
        .json({ message: 'Authorization refused by the server' });
    }
    const payload = {
      _id: user._id,
    };
    const secretKey = process.env.SECRET_TOKEN;
    const accessTokenOptions = {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    };
    const accessToken = jwt.sign({ payload, secretKey, accessTokenOptions });
    await User.findByIdAndupdate(
      user._id,
      {
        accessToken: accessToken,
      },
      { new: true }
    );
    res.status(201).json({
      message: 'accessToken generated',
      accessToken: accessToken,
    });
  });
};

const signUp = async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNo, password } = req.body;
    const requiredFields = [firstName, email, password];
    for (const [key, value] of Object.entries(requiredFields)) {
      if (isEmpty(value)) {
        return res.status(400).json({ error: `Key ${key}: ${value} can't be empty` });
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
        avatar = await uploadToAzure(avatarLocalPath);
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
      role: 'customer',
    });
    return res.status(201).json({
      message: 'New User Registered',
      details: await User.findById(newUser._id).select(
        '-password'
      ),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const signIn = async (req, res) => {
  const { email, password } = req.body;
  if (!validateEmail(email)) {
    return res.status(400).json({ error: 'Please enter a valid email' });
  }
  if (isEmpty(password)) {
    return res.status(400).json({ error: "password can't be empty" });
  }
  const findUser = await User.findOne({ email: email });
  if (!findUser) {
    return res.status(404).json({
      error: '404 Not Found',
      message: "User with this email doesn't exist",
    });
  }
  const authentication = compare(password, findUser.password);
  if (!authentication) {
    return res.status(400).json({ error: 'Incorrect Password' });
  }
  const { refreshToken, accessToken } = await generateTokens(findUser);
  findUser.refreshToken = refreshToken;
  findUser.accessToken = accessToken;
  findUser.save({ validateBeforeSave: false });
  return res
    .status(200)
    .cookie('accessToken', accessToken, {
      httpOnly: true,
      expires: new Date(Date.now() + 3600000),
    })
    .cookie('refreshToken', refreshToken, {
      httpOnly: true,
      expires: new Date(Date.now() + 30 * 24 * 3600000),
    })
    .json({
      user: findUser.name.firstName,
      Message: 'User Logged-In Successfully',
      refreshToken: refreshToken,
      accessToken: accessToken,
    });
};

export { signUp, signIn };
