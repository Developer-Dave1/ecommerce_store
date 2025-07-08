const express = require('express');
const router = express.Router();
const CartController = require('../controllers/cartController');

router.get('/', CartController.allCartItems);
router.post('/add', CartController.addToCart);
router.post('/remove', CartController.removeFromCart);

// adding later...
// router.post('/cart/add', CartController.addToCart);
// router.post('/cart/remove', CartController.removeFromCart);

module.exports = router;
