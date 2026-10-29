import Product from "../models/ProductModel.js";
import cloudinary from "../config/cloudinary.js";

const deleteImageFromCloudinary = async (imageUrl) => {
  const url = new URL(imageUrl);
  const parts = url.pathname.split("/");

  const uploadIndex = parts.indexOf("upload");
  if (uploadIndex === -1) return;

  const publicIdWithExtension = parts
    .slice(uploadIndex + 2)
    .join("/");

  const publicId = publicIdWithExtension.replace(/\.[^/.]+$/, "");

  await cloudinary.uploader.destroy(publicId);
};

const uploadToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "el-masa-trade/products" },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        resolve(result);
      },
    );

    stream.end(file.buffer);
  });
};

export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price: rawPrice,
      stock: rawStock,
      category,
      discountIsActive,
      discountPercentage: rawDiscountPercentage,
    } = req.body;

    const price = Number(rawPrice);

    const stock =
      rawStock === undefined || rawStock === "" ? 0 : Number(rawStock);

    const discount = {
      isActive: discountIsActive === "true",
      percentage:
        rawDiscountPercentage === undefined || rawDiscountPercentage === ""
          ? 0
          : Number(rawDiscountPercentage),
    };
    // 1. Check required fields
    if (
      !name?.trim() ||
      !description?.trim() ||
      price === undefined ||
      !category?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Name, description, price, and category are required",
      });
    }

    // 2. Validate data types
    if (
      typeof name !== "string" ||
      typeof description !== "string" ||
      typeof category !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Name, description, and category must be strings",
      });
    }

    // 3. Validate price
    if (typeof price !== "number" || !Number.isFinite(price) || price < 0) {
      return res.status(400).json({
        success: false,
        message: "Price must be a valid non-negative number",
      });
    }

    // 4. Validate stock
    if (stock !== undefined && (!Number.isInteger(stock) || stock < 0)) {
      return res.status(400).json({
        success: false,
        message: "Stock must be a non-negative integer",
      });
    }

    // 5. Validate uploaded images
    const files = req.files ?? [];

    if (files.length > 5) {
      return res.status(400).json({
        success: false,
        message: "Maximum 5 images are allowed",
      });
    }

    // 6. Upload images to Cloudinary
    const uploadedImages = await Promise.all(
      files.map(async (file) => {
        const result = await uploadToCloudinary(file);
        return result.secure_url;
      }),
    );

    if (discount !== undefined) {
      if (
        typeof discount !== "object" ||
        discount === null ||
        Array.isArray(discount)
      ) {
        return res.status(400).json({
          success: false,
          message: "Discount must be an object",
        });
      }

      if (
        discount.isActive !== undefined &&
        typeof discount.isActive !== "boolean"
      ) {
        return res.status(400).json({
          success: false,
          message: "Discount isActive must be a boolean",
        });
      }

      if (
        discount.percentage !== undefined &&
        (typeof discount.percentage !== "number" ||
          !Number.isFinite(discount.percentage) ||
          discount.percentage < 0 ||
          discount.percentage > 100)
      ) {
        return res.status(400).json({
          success: false,
          message: "Discount percentage must be between 0 and 100",
        });
      }
    }

    // 7. Create product
    const product = await Product.create({
      name: name.trim(),
      description: description.trim(),
      price,
      images: uploadedImages,
      stock,
      category: category.trim(),
      discount,
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    // Handle Mongoose validation errors
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Product validation failed",
        errors: Object.values(error.errors).map((err) => err.message),
      });
    }

    console.error("Create product error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No products found",
      });
    }

    res.status(200).json({
      success: true,
      results: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch product",
      error: error.message,
    });
  }
};

export const editProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update product",
    });
  }
};


export const deleteProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await Promise.all(
      product.images.map(deleteImageFromCloudinary)
    );

    await product.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Product and images deleted successfully",
    });
  } catch (error) {
    console.error("Delete product error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete product or its images",
    });
  }
};
