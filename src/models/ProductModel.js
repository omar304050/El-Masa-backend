
  import mongoose from "mongoose";

  const productSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    images: {
      type: [String],
      default: [],
    },

    stock: {
      type: Number,
      default: 0,
      min: 0,
    },

    category: {
      type: String,
      required: true,
    },

    discount: {
      isActive: {
        type: Boolean,
        default: false,
      },
      percentage: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  });

  const Product = mongoose.model("Product", productSchema);

  export default Product;
