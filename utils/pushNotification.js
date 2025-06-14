const admin = require('firebase-admin');
const logger = require('./logger');
const MAX_RETRIES = 3;

// Assumes firebase-admin is initialized in firebaseConfig.js
const sendPushNotification = async (fcmToken, payload, attempt = 1) => {
  try {
    await admin.messaging().send({
      token: fcmToken,
      notification: {
        title: payload.title,
        body: payload.description
      },
      data: payload.data || {}
    });
    return true;
  } catch (err) {
    logger.error(`FCM push failed (attempt ${attempt}):`, err);
    if (attempt < MAX_RETRIES) {
      return sendPushNotification(fcmToken, payload, attempt + 1);
    }
    return false;
  }
};

module.exports = { sendPushNotification };
