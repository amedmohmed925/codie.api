const mongoose = require('mongoose');

const moneySchema = new mongoose.Schema({
    currentBalance: {
        type: Number,
        required: false
    },
    amountSpane: {
        type: Number,
        required: false
    }
});

module.exports = mongoose.model('Money', moneySchema);

