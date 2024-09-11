import { Schema, model } from 'mongoose';

const brandSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    brandLogo: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    availableAt: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Merchant',
        default: null,
      },
    ],
  },
  { timestamps: true }
);

const Brand = model('Brand', brandSchema);

export default Brand;