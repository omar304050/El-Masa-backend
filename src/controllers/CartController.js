import Cart from "../models/CartModel.js";
import { randomUUID } from "node:crypto";
import Product from "../models/ProductModel.js"; 



export const  getCart = async (req , res) =>{
    const {cartId} = req.params;

    try {
        const cart = await Cart.findOne({cartId}).populate("items.product");
        if(!cart){
            return res.status(404).json({
                success: false,
                message: "Cart not found",
            });
        }
        const totalQuantity = cart.items.reduce(
            (sum, item) => sum + item.quantity,
            0
          );
        const totalPrice = cart.items.reduce(
            (sum, item) => sum + item.product.price * item.quantity,
            0
          );
        res.status(200).json({
            success: true,
            cart,
            totalQuantity,
            totalPrice,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};




export const createCart = async (req, res) => {
  try {
    const cart = await Cart.create({
      cartId: randomUUID(),
      items: [],
    });
    


    res.status(201).json({
      message: "Cart created successfully",
      cartId: cart.cartId,
      cart,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};



export const addToCart = async (req, res) => {
    try {
      const { cartId } = req.params;
      const { productId, quantity } = req.body;
  
      const cart = await Cart.findOne({ cartId });
  
      if (!cart) {
        return res.status(404).json({
          message: "Cart not found",
        });
      }
  
      const product = await Product.findById(productId);
  
      if (!product) {
        return res.status(404).json({
          message: "Product not found",
        });
      }
  
      const existingItem = cart.items.find(
        (item) => item.product.toString() === productId
      );
  
      if (existingItem) {
        existingItem.quantity += Number(quantity) || 1;
      } else {
        cart.items.push({
          product: productId,
          quantity: Number(quantity) || 1,
        });
      }
  
      await cart.save();
  
      res.status(200).json({
        message: "Product added to cart successfully",
        cart,
      });
    } catch (error) {
      res.status(500).json({
        message: "Server error",
      });
    }
  };
  

export const removeFromCart = async (req, res) => {
    try {
      const { cartId } = req.params;
      const { productId } = req.body;
  
      const cart = await Cart.findOne({ cartId });
  
      if (!cart) {
        return res.status(404).json({
          message: "Cart not found",
        });
      }
      const existingItem = cart.items.find(
        (item) => item.product.toString() === productId
      );
  
      if (!existingItem) {
        return res.status(404).json({
          message: "Product not found in cart",
        });
      }
      existingItem.quantity -= 1;
      if (existingItem.quantity <= 0) {
        cart.items = cart.items.filter(item => item.product.toString() !== productId);
      }
      await cart.save();
      res.status(200).json({
        message: "Product removed from cart successfully",
        cart,
      });
    } catch (error) {
      res.status(500).json({
        message: "Server error",
      });
    }
  };