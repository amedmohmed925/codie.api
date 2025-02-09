const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    cartId:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart',
    }],
    userId:{
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
    // addressInfo: {
    //     type: String,
    //     default:"Egypt",
    //     required: false
    // },
    orderStatus: {
        type: String,
        enum: ['Paid','Inprogress','Disputed','completed'],
        default: 'Inprogress'
    },
    paymentMethod: String,
    totalAmount: Number,
    orderDate: Date,
    iframURL:{
        type: String,
        required: false
    }
});

module.exports = mongoose.model('Order', orderSchema);

