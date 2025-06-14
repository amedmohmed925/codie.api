// models/userModel.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    role: {
        type: String,
        required: true,
        enum: ['User', 'Admin', 'Seller', 'Advertiser'],

        default: 'User',

    },
    jobTitle: { type: String, default: "" },
    name: { type: String, required: true },
    userName: { type: String, required: true },
    phone: { type: String, required: true },
    address: {
        apartment: { type: String, required: false },
        floor: { type: String, required: false },
        street: { type: String, required: false },
        building: { type: String, required: false },
        postalCode: { type: String, required: false },
        city: { type: String, required: false },
        country: { type: String, required: false },
        state: { type: String, required: false }
    },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    userImg: { type: String, required: false },
    companyName: { type: String, required: false },
    companyUrl: { type: String, required: false },
    conditions: { type: Boolean, default: false },
    linkedInUrl: { type: String, required: false },
    twitterUrl: { type: String, required: false },
    verified: { type: Boolean, default: false },
    plan: { type: String, default: 'Free' },
    wallet: {
        balance: { type: Number, default: 0 },
        paymentMethod: {
            type: String,
            enum: ['vodafone_cash', 'instapay', 'visa'],
            default: null,
        },
        paymentDetails: { type: String, default: '' }, 
        transactions: [{
            amount: Number,
            type: { type: String, enum: ['credit', 'debit'] },
            date: { type: Date, default: Date.now },
            description: String,
        }],
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);