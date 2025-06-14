const eventService = require('../services/eventService');
const Notification = require('../models/NotificationModel');
const mongoose = require('mongoose');

describe('Notification Service', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/notification_test', { useNewUrlParser: true, useUnifiedTopology: true });
  });
  afterAll(async () => {
    await Notification.deleteMany({});
    await mongoose.connection.close();
  });

  it('should trigger project_added event', async () => {
    const spy = jest.spyOn(eventService, 'triggerProjectAdded');
    await eventService.triggerProjectAdded({ projectId: '123', userIds: ['abc'] });
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('should create a notification document', async () => {
    const notif = await Notification.create({
      userId: new mongoose.Types.ObjectId(),
      type: 'PROJECT_ADDED',
      title: 'Test',
      description: 'Test desc',
      link: '/project/123'
    });
    expect(notif).toHaveProperty('_id');
    expect(notif.type).toBe('PROJECT_ADDED');
  });
});
