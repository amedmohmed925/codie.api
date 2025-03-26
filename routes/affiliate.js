const express = require('express');
const router = express.Router();
const affiliateController = require('../controllers/affiliateController');
const auth = require('../middleware/isAuth');

router.post('/generate-code', auth, affiliateController.generateAffiliateCode);
router.get('/stats', auth, affiliateController.getAffiliateStats);
router.get('/admin-stats', auth, affiliateController.getAllAdvertisersAffiliateStats);

module.exports = router;  