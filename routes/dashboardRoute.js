const express = require('express');
const { totalOrders, recentOrders, bookingList } = require('../controllers/dashboardController');
const router = express.Router();
const isAuth = require('../middleware/isAuth');
/**
 * @swagger
 * tags:
 *   name: Dashboard
 */

router.post('/',isAuth,totalOrders)
router.put('/orderId',isAuth,recentOrders)
router.get('/',isAuth,bookingList)

module.exports = router;
