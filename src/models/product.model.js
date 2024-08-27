import { Schema, model, plugin } from 'mongoose';
import slug from 'mongoose-slug-generator';
mongooseSlugGenerator
const options = {
  separator: '-',
  lang: 'en',
  truncate: 120,
};
plugin(slug, options);

const productSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    slug: {
      type: String,
      slug: ['name', 'description'],
      unique: true,
    },
    description: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    stock: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    brand: {
      type: Schema.Types.ObjectId,
      ref: 'Brand',
    },
    image: {
      type: String,
      required: true,
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

const Product = model('Product', productSchema);

export default Product;