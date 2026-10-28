import Cart from "../models/CartModel.js";
import Product from "../models/ProductModel.js"; 
import Order from "../models/OrderModel.js";

export const createOrder = async (req, res) => {
  try {
    const guestSessionId = req.guestSession._id;
    const { cartId, customerName, customerPhone, customerAddress } = req.body;

    const cart = await Cart.findOne({
      cartId,
      guestSession: guestSessionId,
    });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    if (cart.items.length === 0) {
      return res.status(400).json({
        message: "Cart is empty",
      });
    }

    const orderItems = [];
    let totalAmount = 0;

    for (const item of cart.items) {
      const product = await Product.findById(item.product);

      if (!product || !product.isActive) {
        return res.status(400).json({
          message: "One or more products are unavailable",
        });
      }

      let finalPrice = product.price;

      if (product.discount?.isActive) {
        finalPrice = product.price * (1 - product.discount.percentage / 100);
      }

      orderItems.push({
        product: product._id,
        name: product.name,
        price: finalPrice,
        quantity: item.quantity,
      });

      totalAmount += finalPrice * item.quantity;
    }

    const order = new Order({
      customerName,
      customerPhone,
      customerAddress,
      totalAmount,
      items: orderItems,
      guestSession: guestSessionId,
    });

    await order.save();
    cart.items = [];
    await cart.save();

    return res.status(201).json({
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to create order",
    });
  }
};
