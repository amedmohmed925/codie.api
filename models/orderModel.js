const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    cartId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart',
    }],
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    cartItems: [
        {
          productId: String,
          title: String,
          image: String,
          price: String,
          quantity: Number,
        },
    ],
    orderStatus: {
        type: String,
        enum: ['Paid', 'Inprogress', 'Disputed', 'completed'],
        default: 'Inprogress'
    },
    paymentMethod: String,
    totalAmount: Number,
    orderDate: Date,
    iframURL: {
        type: String,
        required: false
    },
    affiliateCode: {
        type: String,
        required: false,
        default: null
    }
});

module.exports = mongoose.model('Order', orderSchema);