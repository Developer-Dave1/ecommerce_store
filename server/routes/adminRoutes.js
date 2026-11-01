const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/productsController');
const Validators = require('../validators/validators.js');
const { isAdmin } = require('../middleware/middleware.js');

router.use(isAdmin);

router.put('/:product_id', ProductController.updateProduct);

router.post('/', ProductController.deleteProduct);
router.post('/:product_id/changequantity', ProductController.inventoryChangeQuantity);
router.post('/:product_id/changename',
    Validators.validateProductName,
    ProductController.changeProductName);
router.post('/:product_id/changedescription',
    Validators.validateProductDescription,
    ProductController.changeProductDescription);
router.post('/:product_id/changeprice',
    ProductController.changeProductPrice);

module.exports = router;
