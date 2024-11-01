const mongoose = require('mongoose');

const developerSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    jobTitle: {
        type: String,
        required: true
    }
});

// Corrected model name
module.exports = mongoose.model('Developer', developerSchema);
