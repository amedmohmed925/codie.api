const Order= require('../models/orderModel');
const BookingList= require('../models/bookingListModel');


const createOrder = async (req, res, next) => {
    try {
        const userId = req.userId;
        const { productId } = req.params;
        const { day, hour, data } = req.body;

        // Optional validation for 'day', 'hour', 'data'
        if (day && !/^\d{4}-\d{2}-\d{2}$/.test(day)) {
            return res.status(400).json({ message: 'Invalid day format. Expected format: YYYY-MM-DD',success: false  });
        }
        
        if (hour && !/^\d{2}:\d{2}$/.test(hour)) {
            return res.status(400).json({ message: 'Invalid hour format. Expected format: HH:mm',success: false });
        }

        // Create new order
        const newOrder = new Order({
            userId,
            productId,
            day: day || 'N/A',  // Default value if day is not provided
            hour: hour || 'N/A', // Default value if hour is not provided
            data: data || 'No additional data provided', // Default value if data is not provided
        });

        // Save order to the database
        await newOrder.save();

        return res.status(201).json({
            message: 'Order created successfully',
            success: true,
            order: newOrder, // Returning the created order
        });
    } catch (error) {
        next(error); // Pass error to error handling middleware
    }
};



const editOrder = async (req, res, next) => {
    try {
        const { orderId } = req.params;
        const updates = req.body; // Dynamic updates
        
        // Optional validation for 'day', 'hour', 'data'
        if (updates.day && !/^\d{4}-\d{2}-\d{2}$/.test(updates.day)) {
            return res.status(400).json({ message: 'Invalid day format. Expected format: YYYY-MM-DD',success: false  });
        }
        
        if (updates.hour && !/^\d{2}:\d{2}$/.test(updates.hour)) {
            return res.status(400).json({ message: 'Invalid hour format. Expected format: HH:mm',success: false  });
        }

        // Find and update the order
        const updatedOrder = await Order.findByIdAndUpdate(orderId, updates, { new: true });

        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found', success: false });
        }

        return res.status(200).json({
            message: 'Order updated successfully',
            success: true,
            order: updatedOrder, // Returning the updated order
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

const goToTemplete = async (req, res, next) =>{
    try{
        const count = await BookingList.countDocuments();
        title = `order ${count + 1}`;

        const newOrder = new BookingList({
            userId:req.userId,
            title
        });
        await newOrder.save();

        return res.status(201).json({
            message: 'Order created successfully',
            success: true,
        });
    }catch (error) {
        next(error);
    }

} 

module.exports = {
    createOrder,
    editOrder,
    getOrders,
    deleteOrder,
    editStatus,
    goToTemplete
}