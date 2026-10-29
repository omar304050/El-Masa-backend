
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Product from "../models/ProductModel.js";

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (email !== adminEmail || password !== adminPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      { role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("adminToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Admin login successful",
    });
  } catch (error) {
    console.error("Admin login error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


export const getDashboardStats = async (req, res) => {
    try {
      const totalProducts = await Product.countDocuments();
  
      const activeProducts = await Product.countDocuments({
        isActive: true,
      });
  
      const outOfStock = await Product.countDocuments({
        stock: { $lte: 0 },
      });
  
      return res.status(200).json({
        success: true,
        data: {
          totalProducts,
          activeProducts,
          outOfStock,
        },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to fetch dashboard statistics",
      });
    }
  };