const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: {
    type: String,
    enum: ['PROJECT_ADDED', 'PRODUCT_SOLD', 'AFFILIATE_PURCHASE', 'STATUS_CHANGED', 'MANUAL'],
    required: true
  },
  title: { type: String, required: true },
  description: { type: String, required: true },
  link: { type: String },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', NotificationSchema);
