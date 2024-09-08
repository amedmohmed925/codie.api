const mongoose = require('mongoose');

const  likeTemplateSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    productId: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    }
});

module.exports = mongoose.model(' LikeTemplate',  likeTemplateSchema);
