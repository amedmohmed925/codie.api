const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    title: {
        type: String,
        required: true
    },
    categoryNumber: {
        type: String,
        required: true
    },
    note: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Category', categorySchema);
