const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    role: {
        type: String,
        required: true,
        enum: ['User', 'Admin', 'Seller'],
        default: 'User',
    },
    jobTitle: {
        type: String,
        default: ""
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
    address: { // تم تصحيحها من مصفوفة إلى كائن
        apartment: { type: String, required: false },
        floor: { type: String, required: false },
        street: { type: String, required: true },
        building: { type: String, required: false },
        postalCode: { type: String, required: false },
        city: { type: String, required: true },
        country: { type: String, required: true },
        state: { type: String, required: false }
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
    userImg: {
        type: String,
        required: false
    },
    companyName: {
        type: String,
        required: false
    },
    companyUrl: {
        type: String,
        required: false
    },
    conditions: {
        type: Boolean,
        default: false
    },
    linkedInUrl: {
        type: String,
        required: false
    },
    twitterUrl: {
        type: String,
        required: false
    },
    verified: {
        type: Boolean,
        default: false
    },
    plan: {
        type: String,
        default: 'Free'
    }
}, { timestamps: true }); // ✅ إضافة timestamps

module.exports = mongoose.model('User', userSchema);
