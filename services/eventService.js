const redis = require('redis');
const { promisify } = require('util');
const logger = require('../utils/logger');

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
const publisher = redis.createClient({ url: redisUrl });
publisher.connect().catch(err => logger.error('Redis Publisher Error:', err));

const publishEvent = async (channel, data) => {
  try {
    await publisher.publish(channel, JSON.stringify(data));
  } catch (err) {
    logger.error(`Failed to publish event to ${channel}:`, err);
  }
};

module.exports = {
  triggerProjectAdded: (data) => publishEvent('project_added', data),
  triggerProductSold: (data) => publishEvent('product_sold', data),
  triggerAffiliatePurchase: (data) => publishEvent('affiliate_purchase', data),
  triggerStatusChanged: (data) => publishEvent('status_changed', data)
};
