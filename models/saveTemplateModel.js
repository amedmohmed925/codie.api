const mongoose = require('mongoose');

const  saveTemplateSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    productId: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    }
});

module.exports = mongoose.model(' SaveTemplate',  saveTemplateSchema);
