
const Cart = require('../models/cartModel');  

const createCart = async (req, res) => {
    try {
        const userId = req.userId;
        const { productId, price } = req.body;
        console.log(productId, price);
        
        // تحقق إذا كان المنتج موجودًا بالفعل في السلة
        const existingCartItem = await Cart.findOne({ userId, productId });

        if (existingCartItem) {
            return res.status(400).json({
                message: 'Product is already in the cart',
                success: false
            });
        }

        // إذا لم يكن المنتج موجودًا، قم بإضافته
        
        const newCart = new Cart({
            userId,
            productId,
            price
        });
        await newCart.save();

        res.status(201).json({
            message: 'Product added successfully',
            success: true
        });
    } catch (err) {
        res.status(500).json({
            message: 'Internal server error',
            success: false
        });
    }
};

const getAllCartsByUserId = async (req, res) => {
    try {
        const carts = await Cart.find({userId:req.userId}).populate('productId');
        res.status(200).json(carts);
    } catch (err) {
        res.status(500).json({ message: err.message ,success: false});
    }
}

const deleteCart = async (req, res) => {
    try {
        const cart = await Cart.findByIdAndDelete(req.params.cartId);
        if (!cart) return res.status(404).json({ message: 'cart not found',success:false });

        res.status(200).json({ message: 'cart deleted successfully',success:true });
    } catch (err) {
        console.log(err);
        
        res.status(500).json({ message: err.message ,success:false});
    }
}

module.exports= {
    createCart,
    getAllCartsByUserId,
    deleteCart

}

