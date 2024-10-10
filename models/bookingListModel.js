const mongoose = require('mongoose');

const bookingListSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    title: {
        type: String,
    },
    releaseData: {
        type: String,
        default: () => new Date().toLocaleString()
    }
});

module.exports = mongoose.model('BookingList', bookingListSchema);
