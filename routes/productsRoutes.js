const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/productsController');
const { client } = require('../lib/db');

router.get('/', ProductController.viewProducts);
router.get('/product/:product_id', ProductController.getSingleProduct);
router.get('/:product_type', ProductController.getProductsByType);


module.exports = router;
