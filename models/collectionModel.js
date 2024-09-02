const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    productId:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    },
    name: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Collection', collectionSchema);
