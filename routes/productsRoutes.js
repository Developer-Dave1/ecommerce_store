const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/productsController');
const Validators = require('../validators/validators.js');
const {handleValidationErrors, requireLogin} = require('../middleware/middleware.js');

router.use(requireLogin);

router.get('/', ProductController.viewProducts);

router.get('/category/:product_type', ProductController.getProductsByType);

router.get('/item/:product_id', ProductController.getSingleProduct);
router.post('/item/:product_id/review', 
    Validators.validateReview,
    handleValidationErrors,
    ProductController.postReview);

module.exports = router;
