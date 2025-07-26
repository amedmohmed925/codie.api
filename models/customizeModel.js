const mongoose = require('mongoose');

const customizeRequestSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    productId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product', 
        required: true 
    },
    customerName: { 
        type: String, 
        required: true 
    },
    customerEmail: { 
        type: String, 
        required: true 
    },
    customerPhone: { 
        type: String,
        required: true 
    },
    subject: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String, 
        required: true 
    },
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'completed', 'cancelled'],
        default: 'pending'
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('CustomizeRequest', customizeRequestSchema);
