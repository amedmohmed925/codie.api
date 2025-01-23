const express = require('express');
const { editStatus, createOrder, editOrder, getOrders, deleteOrder, goToTemplete } = require('../controllers/orderController');
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
 * /api/order/{orderId}:
 *   put:
 *     summary: Edit an existing order
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the order to be edited
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               day:
 *                 type: string
 *               hour:
 *                 type: string
 *               date:
 *                 type: string
 *     responses:
 *       200:
 *         description: Order updated successfully
 *       404:
 *         description: Order not found
 */

// router.put('/:orderId',isAuth,editOrder)

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

// router.get('/',isAuth,getOrders)
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

/**
 * @swagger
 * /api/order/{orderId}:
 *   delete:
 *     summary: Delete an order
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the order to be deleted
 *     responses:
 *       200:
 *         description: Order deleted successfully
 *       404:
 *         description: Order not found
 */

// router.delete('/:orderId',isAuth,deleteOrder)

/**
 * @swagger
 * /api/order/{orderId}/status:
 *   put:
 *     summary: Update the status of an order
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the order to update status
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Paid, Inprogress, Disputed, completed]
 *                 description: The new status of the order
 *     responses:
 *       200:
 *         description: Status updated successfully
 *       400:
 *         description: Invalid status
 *       404:
 *         description: Order not found
 */
// router.put('/:orderId/status',isAuth,editStatus)


module.exports = router;
