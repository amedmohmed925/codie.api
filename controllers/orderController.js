const Order= require('../models/orderModel');
const Product= require('../models/ProductModel');
const Cart= require('../models/cartModel');
const BookingList= require('../models/bookingListModel');
const { processPayment } = require('../helpers/paymob');
const mongoose = require('mongoose');
const User = require('../models/userModel');

const createOrder = async (req, res) => {
  try {
      const { cartItems, totalAmount, orderDate, cartId } = req.body;
      const userId = req.userId;

      // ✅ First, find the user
      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).json({ success: false, message: "User not found!" });
      }

      // ✅ Validate cartItems and totalAmount
      if (!cartItems || cartItems.length === 0 || !totalAmount) {
          return res.status(400).json({ success: false, message: "Invalid cart data!" });
      }

      const orderData = {
          cartItems,
          totalAmount,
      };

      // ✅ Debugging: Log payment processing attempt
      console.log("Processing payment for order:", orderData);

      const TheToken = await processPayment(orderData, user);

      if (!TheToken) {
          return res.status(500).json({ success: false, message: "Payment processing failed!" });
      }

      // ✅ Construct Paymob iframe URL
      let iframURL = `https://accept.paymob.com/api/acceptance/iframes/864195?payment_token=${TheToken}`;

      // ✅ Create the order
      const newlyCreatedOrder = new Order({
          userId,
          cartId,
          cartItems,
          paymentMethod: "paymob",
          totalAmount,
          orderDate,
          iframURL,
      });

      await newlyCreatedOrder.save();

      // ✅ Ensure cartId is valid before deleting
      if (cartId && cartId.length > 0) {
          await Cart.deleteMany({ _id: { $in: cartId } });
      }

      // ✅ Return the response
      res.status(201).json({
          success: true,
          approvalURL: iframURL,
          orderId: newlyCreatedOrder._id,
      });

  } catch (e) {
      console.error("❌ Order Creation Error:", e);
      res.status(500).json({
          success: false,
          message: "Some error occurred!",
          error: e.message,
      });
  }
};

  
const capturePayment = async (req, res) => {
    try {
      const { paymentId, payerId, orderId } = req.body;
  
      let order = await Order.findById(orderId);
  
      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order can not be found",
        });
      }
  
      order.paymentStatus = "paid";
      order.orderStatus = "confirmed";
      order.paymentId = paymentId;
      order.payerId = payerId;
  
      for (let item of order.cartItems) {
        let product = await Product.findById(item.productId);
  
        if (!product) {
          return res.status(404).json({
            success: false,
            message: `Not enough stock for this product ${product.title}`,
          });
        }
  
        product.totalStock -= item.quantity;
  
        await product.save();
      }
  
      const getCartId = order.cartId;
      await Cart.findByIdAndDelete(getCartId);
  
      await order.save();
  
      res.status(200).json({
        success: true,
        message: "Order confirmed",
        data: order,
      });
    } catch (e) {
      console.log(e);
      res.status(500).json({
        success: false,
        message: "Some error occured!",
      });
    }
  };
  
  const getAllOrdersByUser = async (req, res) => {
    try {
      const userId  = req.userId;
  
      const orders = await Order.find({ userId });
  
      if (!orders.length) {
        return res.status(404).json({
          success: false,
          message: "No orders found!",
        });
      }
  
      res.status(200).json({
        success: true,
        data: orders,
      });
    } catch (e) {
      console.log(e);
      res.status(500).json({
        success: false,
        message: "Some error occured!",
      });
    }
  };
  
 
const getOrdersBySeller = async (req, res) => {
  try {

  

    console.log('Seller ID (raw):', req.userId);

    // تحويل sellerId إلى ObjectId
    const sellerObjectId = new mongoose.Types.ObjectId(req.userId);
    console.log('Seller ID (ObjectId):', sellerObjectId);
    
      // الخطوة 1: جلب المنتجات الخاصة بالبائع
      const sellerProducts = await Product.find({ productCreator: sellerObjectId }).select('_id');

      if (sellerProducts.length === 0) {
          return res.status(404).json({ message: 'No products found for this seller' });
      }

      // استخراج IDs المنتجات الخاصة بالبائع
      const productIds = sellerProducts.map(product => product._id);
      console.log(productIds);
      
      // الخطوة 2: جلب الطلبات التي تحتوي على منتجات البائع
      const orders = await Order.find({
          'cartItems.productId': { $in: productIds }
      });

      if (orders.length === 0) {
          return res.status(404).json({ message: 'No orders found for this seller' });
      }

      res.status(200).json(orders);
  } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getOrderDetails = async (req, res) => {
    try {
      const { id } = req.params;
      const order = await Order.findById(id);
  
      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found!",
        });
      }
  
      res.status(200).json({
        success: true,
        data: order,
      });
    } catch (e) {
      console.log(e);
      res.status(500).json({
        success: false,
        message: "Some error occured!",
      });
    }
  };
  

// edit now 
const goToTemplete = async (req, res, next) =>{
    try{
        const productId = req.body.productId

        const newOrder = new BookingList({
            userId:req.userId,
            productId
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
    capturePayment,
    getAllOrdersByUser,
    getOrderDetails,
    goToTemplete,
    getOrdersBySeller
}