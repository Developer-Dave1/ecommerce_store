const express = require('express');
const router = express.Router();
const CartController = require('../controllers/cartController');

router.get('/', CartController.allCartItems);
router.post('/add', CartController.addToCart);
router.post('/remove', CartController.removeFromCart);

module.exports = router;
