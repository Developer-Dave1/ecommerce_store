const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/productsController');
const Validators = require('../validators/validators.js');
const ReviewsControllers = require('../controllers/reviewsControllers.js');
const {handleValidationErrors, requireLogin} = require('../middleware/middleware.js');

router.use(requireLogin);

router.get('/', ProductController.viewProducts);

router.get('/category/:product_type', ProductController.getProductsByType);

router.get('/item/:product_id', ProductController.getSingleProduct);

// post review
router.post('/item/:product_id/review', 
    Validators.validateReview,
    handleValidationErrors,
    ProductController.postReview);

// delete review
router.post('/item/:product_id/review/delete',  ReviewsControllers.deleteUserReview);

router.get('/manage', ProductController.renderManagePage);
router.post('/manage', ProductController.deleteProduct);

module.exports = router;
