import Cart from "../models/CartModel.js";
import { randomUUID } from "node:crypto";



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
        res.status(200).json({
            success: true,
            cart,
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
