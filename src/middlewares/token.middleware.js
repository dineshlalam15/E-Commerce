import dotenv from 'dotenv';
dotenv.config();
import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';

const verifyToken = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    console.log(accessToken);

    if (!accessToken) {
      const refreshToken = req.cookies.refreshToken;
      console.log(refreshToken);

      if (!refreshToken) {
        return res.status(401).json({ error: 'No Token Provided' });
      }
      const decodedInfo = jwt.verify(refreshToken, process.env.SECRET_TOKEN);
      console.log(decodedInfo);

      const findUser = await User.findById(decodedInfo._id);
      console.log(findUser);

      if (!findUser || findUser.refreshToken != refreshToken) {
        return res
          .status(403)
          .json({ error: 'Invalid Refresh Token (or) Refresh Token expired' });
      }
      const payload = {
        _id: findUser._id,
      };
      const secretKey = process.env.SECRET_TOKEN;
      const accessTokenOptions = {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
      };
      const accessToken = jwt.sign(payload, secretKey, accessTokenOptions);
      findUser.accessToken = accessToken;
      await findUser.save({ validateBeforeSave: false });
      res.setHeader('Authorization', `Bearer ${generateAccesToken}`);
      req.user = findUser;
      next();
    }
    const decodedInfo = jwt.verify(accessToken, process.env.SECRET_TOKEN);
    const findUser = await User.findById(decodedInfo._id);
    if (!findUser || findUser.accessToken != accessToken) {
      return res.status(403).json({ error: 'Invalid Access Token' });
    }
    req.user = findUser;
    next();
  } catch (error) {
    return res.status(400).json({ error: error?.message });
  }
};

export { verifyToken };
