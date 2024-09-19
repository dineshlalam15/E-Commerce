import { Schema, model } from 'mongoose';

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
      enum: ['admin', 'user', 'merchant'],
      default: 'user',
    },
    avatar: {
      type: String,
    },
    address: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Address',
        default: null,
      },
    ],
    merchant: {
      type: Schema.Types.ObjectId,
      ref: 'Merchant',
      default: null,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
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

const User = model('User', userSchema, 'users');

export default User;
