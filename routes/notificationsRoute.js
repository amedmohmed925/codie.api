const express = require('express');
const router = express.Router();
const isAuth = require('../middleware/isAuth');
const notificationsController = require('../controllers/notificationsController');
const rateLimit = require('express-rate-limit');

const notificationLimiter = rateLimit({
  windowMs: parseInt(process.env.NOTIFICATION_RATE_LIMIT_WINDOW) || 60000, // 1 minute
  max: parseInt(process.env.NOTIFICATION_RATE_LIMIT_MAX) || 100,
  message: 'Too many notification requests, please try again later.'
});

/**
 * @swagger
 * tags:
 *   name: Notifications
 */

// Send manual notification (admin only)
router.post('/', isAuth, notificationLimiter, notificationsController.sendManualNotification);
// Get notification history
router.get('/', isAuth, notificationsController.getNotifications);
// Mark notification as read
router.patch('/:id', isAuth, notificationsController.markAsRead);
// Update notification preferences
router.put('/preferences', isAuth, notificationsController.updatePreferences);

module.exports = router;
