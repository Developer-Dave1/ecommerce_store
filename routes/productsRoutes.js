const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/productsController');
const { client } = require('../lib/db'); // or wherever your client is

router.get('/', (req, res) => ProductController.viewProducts(client, req, res));

// Add more routes here as you build them

module.exports = router;
