const User = require('../models/userModel');
const axios = require('axios');


const getWallet = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (user.role !== 'Seller') {
      return res.status(403).json({ message: 'Only Sellers have wallets' });
    }
    res.status(200).json(user.wallet);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching wallet', error });
  }
};


const updatePaymentMethod = async (req, res) => {
  const { method, details } = req.body;
  try {
    const user = await User.findById(req.userId);
    if (user.role !== 'Seller') {
      return res.status(403).json({ message: 'Only Sellers can set payment methods' });
    }
    await User.findByIdAndUpdate(
      req.userId,
      {
        $set: {
          'wallet.paymentMethod': method,
          'wallet.paymentDetails': details,
        },
      },
      { new: true, runValidators: true }
    );
    res.status(200).json({ message: 'Payment method updated' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating payment method', error });
  }
};


const getAllWallets = async (req, res) => {
  try {
    const sellers = await User.find({ role: 'Seller' }).select('name wallet');
    res.status(200).json(sellers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching wallets', error });
  }
};


const processPayouts = async (req, res) => {
  try {
    const sellers = await User.find({ role: 'Seller', 'wallet.paymentMethod': { $ne: null } });
    const commissionRate = 0.6;
    const taxRate = 0.1;

    for (const seller of sellers) {
      let payout = seller.wallet.balance;
      const commission = payout * commissionRate;
      payout -= commission;
      const taxes = payout * taxRate;
      payout -= taxes;

      if (payout > 0) {
        const paymentData = {
          payment_method_id: seller.wallet.paymentMethod === 'vodafone_cash' ? 1 : 2,
          cartTotal: payout,
          currency: 'EGP',
          customer: { phone: seller.wallet.paymentDetails },
          redirectionUrls: { success_url: 'http://localhost:3000/payout-success' },
          cartItems: [{ name: 'Payout', price: payout, quantity: 1 }],
        };

        await axios.post(process.env.FAWATERAK_INVOICE_API_URL, paymentData, {
          headers: {
            Authorization: `Bearer ${process.env.FAWATERAK_API_INVOICE_KEY}`,
            'Content-Type': 'application/json',
          },
        });

        seller.wallet.balance = 0;
        seller.wallet.transactions.push({
          amount: payout,
          type: 'debit',
          description: `Payout after commission (${commission} EGP) and taxes (${taxes} EGP)`,
        });
        await seller.save();
      }
    }
    res.status(200).json({ message: 'Payouts processed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error processing payouts', error });
  }
};

module.exports = {
  getWallet,
  updatePaymentMethod,
  getAllWallets,
  processPayouts,
};