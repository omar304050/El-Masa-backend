import mongoose from "mongoose";


const orderSchema = new mongoose.Schema({
    customerName:{
        type: String,
        required: true,
    },
    customerEmail:{
        type: String,
        required: true,
    },
    customerPhone:{
        type: String,
        required: true,
    },
    customerAddress:{
        type: String,
        required: true,
    },
    totalAmount:{
        type: Number,
        required: true,
    },
    status:{
        type: String,
        required: true,
    },
    items: [
        {
          product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
          },
          name: {
            type: String,
            required: true,
          },
          price: {
            type: Number,
            required: true,
            min: 0,
          },
          quantity: {
            type: Number,
            required: true,
            min: 1,
          },
        },
        
      ],
      guestSession: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "GuestSession",
        required: true,
      },

}, { timestamps: true });

const Order =mongoose.model("Order" , orderSchema);

export default Order;