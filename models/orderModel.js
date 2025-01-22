const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    cartId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart',
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
    addressInfo: {
        type: String,
        required: false
    },
    orderStatus: {
        type: String,
        required: true,
        enum: ['Paid','Inprogress','Disputed','completed'],
        default: 'Inprogress'
    },
    paymentMethod: String,
    paymentStatus: String,
    totalAmount: Number,
    orderDate: Date,
    orderUpdateDate: Date,
    paymentId: String,
    payerId: String,
});

module.exports = mongoose.model('Order', orderSchema);

