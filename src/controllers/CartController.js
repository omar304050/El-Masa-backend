import Cart from "../models/CartModel.js";


const getCart = async (req , res) =>{
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

export default getCart;