const Notification = require('../models/NotificationModel');
const User = require('../models/userModel');
const sanitizeHtml = require('sanitize-html');
const { sendPushNotification } = require('../utils/pushNotification');
const logger = require('../utils/logger');

// Send manual notification (admin only)
exports.sendManualNotification = async (req, res) => {
  try {
    // Only allow admins
    const user = await User.findById(req.userId);
    if (!user || user.role !== 'Admin') {
      return res.status(403).json({ message: 'Forbidden: Admins only.' });
    }
    let { userType, userIds, title, description, link } = req.body;
    title = sanitizeHtml(title);
    description = sanitizeHtml(description);
    link = link ? sanitizeHtml(link) : '';
    let targetUsers = [];
    if (userIds && Array.isArray(userIds)) {
      targetUsers = await User.find({ _id: { $in: userIds } });
    } else if (userType) {
      targetUsers = await User.find({ role: userType });
    } else {
      return res.status(400).json({ message: 'userType or userIds required.' });
    }
    const notifications = [];
    for (const target of targetUsers) {
      if (target.notificationPreferences && target.notificationPreferences.MANUAL === false) continue;
      const notif = await Notification.create({
        userId: target._id,
        type: 'MANUAL',
        title,
        description,
        link
      });
      notifications.push(notif);
      // Real-time via Socket.IO (if online)
      req.io && req.io.to(target._id.toString()).emit('notification', notif);
      // Push notification via FCM (if offline)
      if (target.fcmToken) {
        await sendPushNotification(target.fcmToken, { title, description, data: { link } });
      }
    }
    res.status(201).json({ message: 'Notifications sent', count: notifications.length });
  } catch (err) {
    logger.error('Manual notification error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get notification history (paginated)
exports.getNotifications = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const notifications = await Notification.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    const total = await Notification.countDocuments({ userId: req.userId });
    res.json({ notifications, total, page, limit });
  } catch (err) {
    logger.error('Get notifications error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
  try {
    const notif = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { isRead: true },
      { new: true }
    );
    if (!notif) return res.status(404).json({ message: 'Notification not found' });
    res.json({ message: 'Notification marked as read', notification: notif });
  } catch (err) {
    logger.error('Mark as read error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update notification preferences
exports.updatePreferences = async (req, res) => {
  try {
    const allowedTypes = ['PROJECT_ADDED', 'PRODUCT_SOLD', 'AFFILIATE_PURCHASE', 'STATUS_CHANGED', 'MANUAL'];
    const prefs = req.body;
    for (const key of Object.keys(prefs)) {
      if (!allowedTypes.includes(key)) {
        return res.status(400).json({ message: `Invalid notification type: ${key}` });
      }
    }
    const user = await User.findByIdAndUpdate(
      req.userId,
      { notificationPreferences: prefs },
      { new: true }
    );
    res.json({ message: 'Preferences updated', preferences: user.notificationPreferences });
  } catch (err) {
    logger.error('Update preferences error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
