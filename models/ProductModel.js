const { type } = require('express/lib/response');
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    categoryId:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Category',
    },
    title: {
        type: String,
        required: true
    },
    Category_name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    tags: {
        type: Array,
        required: true
    },
    productCreator: {
        type: String,
        required: true
    },
    creatorJobTitle: {
        type: String,
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
        type: String,
        required: false
    },
    uploadVidieUrl: {
        type: String,
        required: false
    },
    uploadImgUrl: {
        type: String,
        required: false
    },
});

module.exports = mongoose.model('Product', productSchema);
