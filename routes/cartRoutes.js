const express = require('express');
const router = express.Router();
const CartController = require('../controllers/cartController');
const {requireLogin} = require('../middleware/middleware.js');

router.use(requireLogin);

router.get('/', CartController.allCartItems);
router.post('/add', CartController.addToCart);
router.post('/remove', CartController.removeFromCart);

module.exports = router;
