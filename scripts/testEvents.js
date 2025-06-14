const eventService = require('../services/eventService');

(async () => {
  // Simulate project added event
  await eventService.triggerProjectAdded({
    projectId: 'proj123',
    userIds: ['user1', 'user2'],
    title: 'New Project',
    description: 'A new project has been added!',
    link: '/project/proj123'
  });
  // Simulate product sold event
  await eventService.triggerProductSold({
    productId: 'prod456',
    sellerId: 'seller1',
    title: 'Product Sold',
    description: 'Your product has been sold!',
    link: '/product/prod456'
  });
  // Simulate affiliate purchase event
  await eventService.triggerAffiliatePurchase({
    affiliateId: 'aff1',
    orderId: 'order789',
    title: 'Affiliate Purchase',
    description: 'Your affiliate link was used!',
    link: '/affiliate/aff1'
  });
  // Simulate status changed event
  await eventService.triggerStatusChanged({
    projectId: 'proj123',
    sellerId: 'seller1',
    status: 'APPROVED',
    title: 'Project Approved',
    description: 'Your project was approved!',
    link: '/project/proj123'
  });
  console.log('Test events triggered.');
  process.exit(0);
})();
