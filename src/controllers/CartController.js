import Cart from "../models/CartModel.js";
import Product from "../models/ProductModel.js"; 
import { randomUUID } from "node:crypto";




export const  getCart = async (req , res) =>{
    const {cartId} = req.params;

    try {
        const cart = await Cart.findOne({cartId, guestSession: req.guestSession._id}).populate("items.product");
        if(!cart){
            return res.status(404).json({
                success: false,
                message: "Cart not found",
            });
        }

        const itemsWithPrices = cart.items.map((item) => {
          const product = item.product;
        
          const price = product.price;
          const discount = product.discount;
        
          const finalPrice =
            discount?.isActive && discount.percentage > 0
              ? price * (1 - discount.percentage / 100)
              : price;
        
          return {
            ...item.toObject(),
            finalPrice,
          };
        });
        
        const totalQuantity = itemsWithPrices.reduce(
          (sum, item) => sum + item.quantity,
          0
        );
        
        const totalPrice = itemsWithPrices.reduce(
          (sum, item) => sum + item.finalPrice * item.quantity,
          0
        );
        
        res.status(200).json({
            success: true,
            cart: {
              ...cart.toObject(),
              items: itemsWithPrices,
            },
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
      guestSession: req.guestSession._id,
      items: [],
    });

    res.status(201).json({
      message: "Cart created successfully",
      cartId: cart.cartId,
      cart,
      guestSession: req.guestSession._id,
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
  
      const cart = await Cart.findOne({ cartId , guestSession: req.guestSession._id });
  
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
      const guestSession = req.guestSession._id;
  
      const cart = await Cart.findOne({ cartId, guestSession });
  
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


 export const clearCart = async (req, res) => {
    try {
      const { cartId } = req.params;
      const guestSession = req.guestSession._id;
      const cart = await Cart.findOne({ cartId, guestSession });
      if (!cart) {
        return res.status(404).json({
          message: "Cart not found",
        });
      }
      cart.items = [];
      await cart.save();
      res.status(200).json({
        message: "Cart cleared successfully",
        cart,
      });
    } catch (error) {
      console.error("CLEAR CART ERROR:", error);
    
      return res.status(500).json({
        message: "Server error",
        error: String(error),
        details: error?.message,
      });
    }
  };