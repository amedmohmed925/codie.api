const express = require('express');
const router = express.Router();
const isAuth = require('../middleware/isAuth');
const { createOrder, getOrders, getAllOrdersByUserId, getOrderById, updateStatusOrder, deleteOrder } = require('../controllers/cartController');
/**
 * @swagger
 * components:
 *   schemas:
 *     Cart:
 *       type: object
 *       required:
 *         - userId
 *         - productId
 *         - toutal
 *       properties:
 *         userId:
 *           type: string
 *           description: The ID of the user
 *         productId:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of product IDs
 *         toutal:
 *           type: number
 *           description: The total cost of the cart
 *         status:
 *           type: string
 *           enum: ['Paid', 'Inprogress', 'Disputed', 'Completed']
 *           description: The status of the order
 */

/**
 * @swagger
 * /api/cart/:
 *   post:
 *     summary: Create a new order
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cart'
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Error creating order
 */
router.post('/', isAuth, createOrder);

/**
 * @swagger
 * /api/cart/:
 *   get:
 *     summary: Get all orders
 *     tags: [Cart]
 *     responses:
 *       200:
 *         description: List of all orders
 *       500:
 *         description: Server error
 */

router.get('/', isAuth, getOrders);

/**
 * @swagger
 * /api/cart/OrdersOfUser:
 *   get:
 *     summary: Get all orders for a specific user
 *     tags: [Cart]
 *     responses:
 *       200:
 *         description: List of user's orders
 *       500:
 *         description: Server error
 */
router.get('/OrdersOfUser', isAuth, getAllOrdersByUserId);

/**
 * @swagger
 * /api/cart/{orderId}:
 *   get:
 *     summary: Get an order by ID
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         schema:
 *           type: string
 *         required: true
 *         description: The order ID
 *     responses:
 *       200:
 *         description: Order data
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */
router.get('/:orderId', isAuth, getOrderById);

/**
 * @swagger
 * /api/cart/status/{orderId}:
 *   put:
 *     summary: Update the status of an order
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         schema:
 *           type: string
 *         required: true
 *         description: The order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 description: New status of the order
 *     responses:
 *       200:
 *         description: Status updated successfully
 *       400:
 *         description: Error updating order status
 */
router.put('/status/:orderId', isAuth, updateStatusOrder);

/**
 * @swagger
 * /api/cart/{orderId}:
 *   delete:
 *     summary: Delete an order by ID
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         schema:
 *           type: string
 *         required: true
 *         description: The order ID
 *     responses:
 *       200:
 *         description: Order deleted successfully
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */
router.delete('/:orderId', isAuth, deleteOrder);


module.exports = router;




