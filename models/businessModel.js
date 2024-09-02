const mongoose = require('mongoose');

const  businessSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    URL: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model(' Business',  businessSchema);
