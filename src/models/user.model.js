import { Schema, model } from 'mongoose';
import { compare } from 'bcrypt';

const userSchema = new Schema(
  {
    name: {
      firstName: {
        type: String,
        required: true,
        trim: true,
      },
      lastName: {
        type: String,
        trim: true,
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phoneNo: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      minLength: 8,
      trim: true,
      required: function () {
        return !this.googleId;
      },
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user'
    },
    merchant: {
      type: Schema.Types.ObjectId,
      ref: 'Merchant',
      default: null,
    },
    googleId: {
      type: String,
      unique: true,
    },
    refreshToken: {
      type: String,
    },
    accessToken: {
      type: String,
    },
  },
  { timestamps: true }
);

const User = model('User', userSchema);

export default User;