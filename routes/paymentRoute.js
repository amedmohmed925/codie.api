const express = require('express');
const axios = require('axios');
const { getMethods, invoiceInit } = require('../controllers/paymentController');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Payment
 */

/**
 * @swagger
 * /api/payment/payment-methods:
 *   get:
 *     summary: Retrieve available payment methods
 *     tags: [Payment]
 *     security: []
 *     responses:
 *       200:
 *         description: List of payment methods retrieved successfully
 *       500:
 *         description: Failed to retrieve payment methods
 */
router.get('/payment-methods', getMethods);

/**
 * @swagger
 * /api/payment/invoice-init:
 *   post:
 *     summary: Initialize a payment invoice
 *     tags: [Payment]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               payment_method_id:
 *                 type: integer
 *                 example: 2
 *               cartTotal:
 *                 type: string
 *                 example: "100"
 *               currency:
 *                 type: string
 *                 example: "EGP"
 *               customer:
 *                 type: object
 *                 properties:
 *                   first_name:
 *                     type: string
 *                   last_name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   phone:
 *                     type: string
 *                   address:
 *                     type: string
 *               redirectionUrls:
 *                 type: object
 *                 properties:
 *                   successUrl:
 *                     type: string
 *                   failUrl:
 *                     type: string
 *                   pendingUrl:
 *                     type: string
 *               cartItems:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     price:
 *                       type: string
 *                     quantity:
 *                       type: string
 *     responses:
 *       200:
 *         description: Invoice initialized successfully
 *       500:
 *         description: Failed to initialize invoice
 */
router.post('/invoice-init', invoiceInit);

module.exports = router;
