const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    categoryId:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Category',
    },
    title: {
        type: String,
        required: true
    },
    categoryName: {
        type: String,
        required: true
    },
    URL: {
        type: String,
        required: true
    },
    amount: {
        type: String,
        required: true
    },
    features: {
        type: Array,
        required: true
    }
});

module.exports = mongoose.model('Subscription', subscriptionSchema);
