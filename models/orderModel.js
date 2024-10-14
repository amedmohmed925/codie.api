const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    },
    day: {
        type: String,
        required: false
    },
    status: {
        type: String,
        required: true,
        enum: ['Paid','Inprogress','Disputed','completed'],
        default: 'Inprogress'
    },
    hour: {
        type: String,
        required: false
    },
    date: {
        type: String,
        required: false
    }
});

module.exports = mongoose.model('Order', orderSchema);

