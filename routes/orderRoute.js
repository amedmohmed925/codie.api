const express = require('express');
const { editStatus, createOrder, editOrder, getOrders, deleteOrder } = require('../controllers/orderController');
const router = express.Router();
const isAuth = require('../middleware/isAuth');


router.post('/',isAuth,createOrder)
router.put('/orderId',isAuth,editOrder)
router.get('/',isAuth,getOrders)
router.delete('/:orderId',isAuth,deleteOrder)
router.put('/:orderId',isAuth,editStatus)


module.exports = router;
