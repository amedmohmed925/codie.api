const mongoose = require('mongoose');

const affiliateCodeSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    advertiserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('AffiliateCode', affiliateCodeSchema);