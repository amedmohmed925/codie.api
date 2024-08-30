const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    role: {
        type: String,
        require:true,
        enum: ['User','Admin'],
        default: 'User',
    },
    name: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    userImg:{
        type: String,
        required: false
    },
    companyName:{
        type: String,
        required: false
    },
    companyUrl:{
        type: String,
        required: false
    },
    conditions:{
        type: Boolean,
        default:false
    },
    verified: {
        type: Boolean,
        default:false
    }
});

module.exports = mongoose.model('User', userSchema);
