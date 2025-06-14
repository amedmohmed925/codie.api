const { Server } = require('socket.io');
const http = require('http');
const redis = require('redis');
const jwt = require('jsonwebtoken');
const isAuth = require('../middleware/isAuth');
const Notification = require('../models/NotificationModel');
const User = require('../models/userModel');
const { sendPushNotification } = require('../utils/pushNotification');
const logger = require('../utils/logger');

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
const subscriber = redis.createClient({ url: redisUrl });
subscriber.connect().catch(err => logger.error('Redis Subscriber Error:', err));

const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
  }
});

const userSocketMap = {}; // userId: socketId

// JWT authentication for Socket.IO
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error('Authentication error'));
    const cert = '.njjfjfhjslslshfjiaoaosfkpjfjfj';
    jwt.verify(token, cert, { algorithms: ['HS256'] }, (err, payload) => {
      if (err) return next(new Error('Authentication error'));
      socket.userId = payload.userId;
      next();
    });
  } catch (err) {
    next(new Error('Authentication error'));
  }
});

io.on('connection', (socket) => {
  const userId = socket.userId;
  userSocketMap[userId] = socket.id;
  socket.join(userId);
  io.emit('getOnlineUsers', Object.keys(userSocketMap));
  socket.on('disconnect', () => {
    delete userSocketMap[userId];
    io.emit('getOnlineUsers', Object.keys(userSocketMap));
  });
});

// Redis Pub/Sub event handling
const handleEvent = async (type, data) => {
  try {
    let targets = [];
    let title = data.title;
    let description = data.description;
    let link = data.link;
    if (type === 'project_added') {
      if (data.userIds) {
        targets = await User.find({ _id: { $in: data.userIds } });
      } else {
        targets = await User.find({});
      }
    } else if (type === 'product_sold') {
      targets = await User.find({ _id: data.sellerId });
    } else if (type === 'affiliate_purchase') {
      targets = await User.find({ _id: data.affiliateId });
    } else if (type === 'status_changed') {
      targets = await User.find({ _id: data.sellerId });
    }
    for (const user of targets) {
      if (user.notificationPreferences && user.notificationPreferences[type.toUpperCase()] === false) continue;
      const notif = await Notification.create({
        userId: user._id,
        type: type.toUpperCase(),
        title,
        description,
        link
      });
      io.to(user._id.toString()).emit('notification', notif);
      if (user.fcmToken) {
        await sendPushNotification(user.fcmToken, { title, description, data: { link } });
      }
    }
  } catch (err) {
    logger.error('Socket event error:', err);
  }
};

subscriber.subscribe('project_added', (msg) => handleEvent('project_added', JSON.parse(msg)));
subscriber.subscribe('product_sold', (msg) => handleEvent('product_sold', JSON.parse(msg)));
subscriber.subscribe('affiliate_purchase', (msg) => handleEvent('affiliate_purchase', JSON.parse(msg)));
subscriber.subscribe('status_changed', (msg) => handleEvent('status_changed', JSON.parse(msg)));

module.exports = { io, server };