const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/productsController');
const { client } = require('../lib/db');

router.get('/', ProductController.viewProducts);


// will add some more routes as I build 'em

module.exports = router;
