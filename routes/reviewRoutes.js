const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

router.post('/add-review', reviewController.addProductReview);
router.get('/:productId', reviewController.getProductReviews);
router.get('/:productId/average', reviewController.getProductAverageRating);
module.exports = router;
