const express = require('express');
const router = express.Router();
const isAuth = require('../middleware/isAuth');
const { 
    getSubscriptions,
    getSubscriptionById,
    createSubscription,
    updateSubscription,
    deleteSubscription
} = require('../controllers/subscriptionController');

/**
 * @swagger
 * /api/subscriptions:
 *   get:
 *     tags: [Subscription]
 *     summary: Get all subscriptions
 *     responses:
 *       200:
 *         description: Successfully retrieved all subscriptions
 *       404:
 *         description: Subscriptions not found
 *       500:
 *         description: Server error
 */
router.get('/', isAuth, getSubscriptions);

/**
 * @swagger
 * /api/subscription/{subscriptionId}:
 *   get:
 *     tags: [Subscription]
 *     summary: Get subscription by ID
 *     parameters:
 *       - name: subscriptionId
 *         in: path
 *         required: true
 *         description: ID of the subscription to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved subscription
 *       404:
 *         description: Subscription not found
 *       500:
 *         description: Server error
 */
router.get('/:subscriptionId', isAuth, getSubscriptionById);

/**
 * @swagger
 * /api/subscription:
 *   post:
 *     tags: [Subscription]
 *     summary: Create a new subscription
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - categoryName
 *               - URL
 *               - amount
 *               - features
 *             properties:
 *               title:
 *                 type: string
 *               categoryName:
 *                 type: string
 *               URL:
 *                 type: string
 *               amount:
 *                 type: string
 *               features:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Subscription created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.post('/', isAuth, createSubscription);

/**
 * @swagger
 * /api/subscription/{subscriptionId}:
 *   put:
 *     tags: [Subscription]
 *     summary: Update a subscription by ID
 *     parameters:
 *       - name: subscriptionId
 *         in: path
 *         required: true
 *         description: ID of the subscription to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               categoryName:
 *                 type: string
 *               URL:
 *                 type: string
 *               amount:
 *                 type: string
 *               features:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Subscription updated successfully
 *       404:
 *         description: Subscription not found
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.put('/:subscriptionId', isAuth, updateSubscription);

/**
 * @swagger
 * /api/subscription/{subscriptionId}:
 *   delete:
 *     tags: [Subscription]
 *     summary: Delete a subscription by ID
 *     parameters:
 *       - name: subscriptionId
 *         in: path
 *         required: true
 *         description: ID of the subscription to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Subscription deleted successfully
 *       404:
 *         description: Subscription not found
 *       500:
 *         description: Server error
 */
router.delete('/:subscriptionId', isAuth, deleteSubscription);

module.exports = router;
