const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    tags: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tags',
    }],
    productCreator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    privateURL: {
        type: String,
        required: false
    },
    privateTemplate: {
        type: String,
        required: false
    },
    price: {
        type: Number,  // Updated to Number
        required: false
    },
    uploadVideoUrl: {  // Corrected typo from uploadVidieUrl
        type: String,
        required: false
    },
    uploadImgUrl: {
        type: String,
        required: false
    },
    isSave: {
        type: Boolean,
        default: false
    },
    isLike: {
        type: Boolean,
        default: false
    },
    isVerified: {
        type: Boolean,
        required: true
    }
});

module.exports = mongoose.model('Product', productSchema);
