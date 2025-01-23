const express = require('express');
const router = express.Router();
const isAuth = require('../middleware/isAuth');
const { getAllCartsByUserId, deleteCart, createCart } = require('../controllers/cartController');
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
 *         productId:
 *           type: string
 *         price:
 *           type: string
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
router.post('/', isAuth, createCart);

/**
 * @swagger
 * /api/cart/carts-user:
 *   get:
 *     summary: Get all Carts for a specific user
 *     tags: [Cart]
 *     responses:
 *       200:
 *         description: List of user's orders
 *       500:
 *         description: Server error
 */
router.get('/carts-user', isAuth, getAllCartsByUserId);



/**
 * @swagger
 * /api/cart/{cartId}:
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
router.delete('/:cartId', isAuth, deleteCart);


module.exports = router;




