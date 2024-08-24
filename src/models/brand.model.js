import { Schema, model, plugin } from 'mongoose';
import slug from 'mongoose-slug-generator';

const options = {
  separator: '-',
  lang: 'en',
  truncate: 120,
};
plugin(slug, options);

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
    slug: {
      type: String,
      slug: ['name', 'description'],
      unique: true,
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

const Brand = new model('Brand', brandSchema);

export default Brand;