const Order= require('../models/orderModel');


const createOrder = async (req, res, next) => {
    console.log(req.userId);
    console.log(req.params);
    
    try {
        const userId = req.userId
        const {productId}=req.params
        const {day, hour, data } = req.body;

        // Create new order
        const newOrder = new Order({
            userId,
            productId,
            day,
            hour,
            data,
        });

        // Save order to database
        await newOrder.save();

        return res.status(201).json({
            message: 'Order created successfully',
            success: true
        });
    } catch (error) {
        next(error); // Pass error to error handling middleware
    }
};


const editOrder = async (req, res, next) => {
    try {
        const { orderId } = req.params;
        const updates = req.body; // Dynamic updates

        const updatedOrder = await Order.findByIdAndUpdate(orderId, updates, { new: true });

        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found',success: false });
        }

        return res.status(200).json({
            message: 'Order updated successfully',
            success: true
        });
    } catch (error) {
        next(error);
    }
};


const getOrders = async (req, res, next) => {
    try {
        const orders = await Order.find().populate('userId').populate('productId');
        
        if (!orders.length) {
            return res.status(404).json({ message: 'No orders found',success: false });
        }

        return res.status(200).json({ orders });
    } catch (error) {
        next(error);
    }
};


const deleteOrder = async (req, res, next) => {
    try {
        const { orderId } = req.params;

        const deletedOrder = await Order.findByIdAndDelete(orderId);

        if (!deletedOrder) {
            return res.status(404).json({ message: 'Order not found',success: false });
        }

        return res.status(200).json({
            message: 'Order deleted successfully',
            success: true
        });
    } catch (error) {
        next(error);
    }
};

const editStatus = async (req, res, next) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        // Validate status against enum
        if (!['Paid', 'Inprogress', 'Disputed', 'completed'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const updatedOrder = await Order.findByIdAndUpdate(orderId, { status }, { new: true });

        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' ,success: false});
        }

        return res.status(200).json({
            message: 'Order status updated successfully',
            success: true
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createOrder,
    editOrder,
    getOrders,
    deleteOrder,
    editStatus
}