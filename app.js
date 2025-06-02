const express = require('express');
const router = express.Router();
const app = express();
const path = require('path');
const Product = require('./lib/products.js');
const { Client } = require('pg');

const client = new Client({ database: 'ecommerce' });
client.connect();


app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', async (req, res) => {
  try {
    const products = await Product.getAllProducts(client); // or getAllProducts(client)
    res.render('products', { products });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error loading products');
  }
});


app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
