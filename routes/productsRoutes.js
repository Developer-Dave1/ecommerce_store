const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/productsController');
const { client } = require('../lib/db');

router.get('/', ProductController.viewProducts);
router.get('/category/:product_type', ProductController.getProductsByType);
router.get('/item/:product_id', ProductController.getSingleProduct);
router.post('/item/:product_id/review', ProductController.postReview);

module.exports = router;
