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
    commercialPrice: {
        type: Number,  // Updated to Number
        required: true
    },
    regularPrice: {
        type: Number,  // Updated to Number
        required: true
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
    compressedFileUrl: String,
    livePreviewUrl: String,
    allowEditing : {
        type: Boolean,
        required: true
    },
    isVerified: {
        type: Boolean,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
