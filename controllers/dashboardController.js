const BookingList= require('../models/bookingListModel');
const Order= require('../models/orderModel');
const Money = require('../models/moneyModel');
const Category= require('../models/categoryModel');
const Product = require('../models/ProductModel');

const info = async (req, res, next) => {
    try {
        // Count Orders
        const orderCount = await Order.countDocuments({});

        // Retrieve Money details (current balance and amount spent)
        const moneyDetails = await Money.findOne();

        res.status(200).json({
            success: true,
            orderCount,
            currentBalance: moneyDetails ? moneyDetails.currentBalance : 0,
            amountSpent: moneyDetails ? moneyDetails.amountSpane : 0
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


const toutalOrders = async (req, res, next) => {
    try {
        // Count Categories
        const categoryCount = await Category.countDocuments({});

        // Retrieve Money details
        const moneyDetails = await Money.findOne();

        // Get categories and count the number of products in each category
        const categories = await Category.aggregate([
            {
                $lookup: {
                    from: 'products',
                    localField: '_id',
                    foreignField: 'categoryId',
                    as: 'products'
                }
            },
            {
                $project: {
                    title: 1,
                    categoryNumber: 1,
                    productCount: { $size: "$products" }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            categoryCount,
            currentBalance: moneyDetails ? moneyDetails.currentBalance : 0,
            amountSpent: moneyDetails ? moneyDetails.amountSpane : 0,
            categories
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getTempletes = async (req, res, next) => {
    try {
        const orders = await BookingList.find().populate('userId'); // Populate user info if needed
        res.status(200).json({
            success: true,
            data: orders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


module.exports = {
    info,
    toutalOrders,
    getTempletes
}