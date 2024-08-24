import { Schema, model } from 'mongoose';

const merchantSchema = new Schema(
  {
    name: {
      firstName: {
        type: String,
      },
      lastName: {
        type: String,
      },
    },
    email: {
      type: String,
    },
    phoneNo: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    storeName: {
      type: String,
      required: true,
      trim: true,
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

const Merchant = model('Merchant', merchantSchema);

export default Merchant;