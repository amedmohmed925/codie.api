const express = require('express');
const { info, getTempletes, toutalOrders } = require('../controllers/dashboardController');
const router = express.Router();
const isAuth = require('../middleware/isAuth');

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Dashboard management
 */

/**
 * @swagger
 * /api/dashboard/info:
 *   get:
 *     summary: Get basic dashboard info
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved info
 *       500:
 *         description: Internal server error
 */
router.get('/info', isAuth, info);

/**
 * @swagger
 * /api/dashboard/toutalOrders:
 *   get:
 *     summary: Get total orders and other dashboard data
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved orders and dashboard data
 *       500:
 *         description: Internal server error
 */
router.get('/toutalOrders', isAuth, toutalOrders);

/**
 * @swagger
 * /api/dashboard/templates:
 *   get:
 *     summary: Get all templates (booking lists)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved templates
 *       500:
 *         description: Internal server error
 */
router.get('/templates', isAuth, getTempletes);

module.exports = router;
