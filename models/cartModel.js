const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    productId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    }],
    status: {
        type: String,
        required: true,
        enum: ['Paid','Inprogress','Disputed','completed'],
        default: 'Inprogress'
    },
    toutal: {
        type: Number,
        required: true
    },
    releaseData: {
        type: String,
        default: () => new Date().toLocaleString()
    }
});

module.exports = mongoose.model('Cart', cartSchema);

