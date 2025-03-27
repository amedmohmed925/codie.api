const express = require('express');
const router = express.Router();
const auth = require('../middleware/isAuth');
const {
  getWallet,
  updatePaymentMethod,
  getAllWallets,
  processPayouts,
} = require('../controllers/walletController');

const isAdmin = async (req, res, next) => {
  const user = await User.findById(req.userId);
  if (user.role !== 'Admin') {
    return res.status(403).json({ message: 'Admin access only' });
  }
  next();
};

router.get('/wallet', auth, getWallet);


router.post('/wallet/payment-method', auth, updatePaymentMethod);


router.get('/admin/all-wallets', auth, isAdmin, getAllWallets);


router.post('/admin/process-payouts', auth, isAdmin, processPayouts);

module.exports = router;