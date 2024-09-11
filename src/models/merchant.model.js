import { Schema, model } from 'mongoose';

const merchantSchema = new Schema(
  {
    storeName: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      minLength: 8,
      trim: true,
      required: true
    },
    email: {
      type: String,
    },
    phoneNo: {
      type: String,
    },
    address: {
      type: Schema.Types.ObjectId,
      ref: 'Address'
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
    status: {
      type: String,
      enum: ['approvalInProgress', 'approved', 'rejected'],
      default: approvalInProgress,
    },
  },
  { timestamps: true }
);

const Merchant = model('Merchant', merchantSchema, 'merchants');

export default Merchant;