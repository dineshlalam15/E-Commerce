import { Schema, model } from 'mongoose';

const reviewSchema = new Schema({
  user: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  comment: {
    type: String,
  },
  productID: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});
const Review = model('Review', reviewSchema);

const productSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      required: [true, 'Please enter your description'],
    },
    productImages: [
      {
        type: String,
        required: true,
      },
    ],    
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
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Review',
      },
    ],
    availableAt: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Merchant',
      },
    ]    
  },
  { timestamps: true }
);

const Product = model('Product', productSchema);

export default Product;
