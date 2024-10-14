const mongoose = require('mongoose');

const bookingListSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    },
    releaseData: {
        type: String,
        default: () => new Date().toLocaleString()
    }
});

module.exports = mongoose.model('BookingList', bookingListSchema);
