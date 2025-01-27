const express = require('express');
const {createOrder, getAllOrdersByUser ,goToTemplete ,getOrderDetails, getOrdersBySeller} = require('../controllers/orderController');
const router = express.Router();
const isAuth = require('../middleware/isAuth');
/**
 * @swagger
 * tags:
 *   name: Order
 */

/**
 * @swagger
 * /api/order:
 *   post:
 *     summary: Create a new order
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               day:
 *                 type: string
 *                 description: Day of the order
 *               hour:
 *                 type: string
 *                 description: Hour of the order
 *               date:
 *                 type: string
 *                 description: Additional data for the order
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Bad request
 */
router.post('/',isAuth,createOrder)

/**
 * @swagger
 * /api/order:
 *   get:
 *     summary: Get a list of all orders
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
 *       404:
 *         description: No orders found
 */

router.get('/',isAuth,getAllOrdersByUser)
router.get('/:id',isAuth,getOrderDetails)
router.get('/seller/products',isAuth,getOrdersBySeller)  // get orders by seller
/**
 * @swagger
 * /api/order/preOrder:
 *   post:
 *     summary: Pre order
 *     tags: [Order]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Pre order successfully
 *       404:
 *         description: bad Request
 */
router.post('/preOrder',isAuth,goToTemplete)


module.exports = router;
