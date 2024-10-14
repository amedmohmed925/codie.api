
const Cart = require('../models/cartModel');  // Adjust the path as necessary

const createOrder = async (req, res) => {
    try {
        const { userId, productId, toutal } = req.body;
        const newCart = new Cart({
            userId,
            productId,
            toutal
        });
        await newCart.save();
        res.status(201).json({message: 'Successfully',success: true});
    } catch (err) {
        res.status(400).json({ message: err.message,success: false });
    }
}

const getOrders = async (req, res) => {
    try {
        const carts = await Cart.find().populate('userId productId');
        res.status(200).json(carts);
    } catch (err) {
        res.status(500).json({ message: err.message ,success: false});
    }
}

const getAllOrdersByUserId = async (req, res) => {
    try {
        const carts = await Cart.find({userId:req.userId}).populate('productId');
        res.status(200).json(carts);
    } catch (err) {
        res.status(500).json({ message: err.message ,success: false});
    }
}

const getOrderById =  async (req, res) => {
    try {
        const order = await Cart.findById(req.params.orderId).populate('userId productId');
        if (!order) return res.status(404).json({ message: 'Order not found',success: false });
        res.status(200).json(order);
    } catch (err) {
        res.status(500).json({ message: err.message ,success: false  });
    }
} 

const updateStatusOrder = async (req, res) => {
    try {
        const order = await Cart.findById(req.params.orderId);
        if (!order) return res.status(404).json({ message: 'Order not found',success: false });

        const {status } = req.body;

        if (status) order.status = status;

        await order.save();
        res.status(200).json({message: 'Status updated Successfully',success: true});
    } catch (err) {
        res.status(400).json({ message: err.message, success:false });
    }
}

const deleteOrder = async (req, res) => {
    try {
        const order = await Cart.findById(req.params.orderId);
        if (!order) return res.status(404).json({ message: 'Order not found',success:false });

        await order.remove();
        res.status(200).json({ message: 'Order deleted successfully',success:true });
    } catch (err) {
        res.status(500).json({ message: err.message ,success:false});
    }
}
module.exports= {
    createOrder,
    getOrders,
    getAllOrdersByUserId,
    getOrderById,
    updateStatusOrder,
    deleteOrder

}

