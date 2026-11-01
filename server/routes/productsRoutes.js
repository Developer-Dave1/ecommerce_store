const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/productsController');
const Validators = require('../validators/validators.js');
const ReviewsControllers = require('../controllers/reviewsControllers.js');
const {handleValidationErrors} = require('../middleware/middleware.js');


router.get('/', ProductController.viewProducts);

router.get('/category/:product_type', ProductController.getProductsByType);

router.get('/item/:product_id', ProductController.getSingleProduct);
router.get('/item/:product_id/reviews', ReviewsControllers.getProductReviews);

router.post('/item/:product_id/review', 
    Validators.validateReview,
    handleValidationErrors,
    ReviewsControllers.postReview);

router.post('/item/:product_id/review/delete',  ReviewsControllers.deleteUserReview);

module.exports = router;
