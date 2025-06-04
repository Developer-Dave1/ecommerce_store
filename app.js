const express = require('express');
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


app.get('/', (req, res) => {
  try {
    res.render('index');
  } catch (error) {
    console.log(`There was an error reaching the index page.`)
    throw error;
  }
});

app.get('/products', async (req, res) => {
  try {
    const products = await Product.getAllProducts(client);
    console.log('Products fetched:', products);
    res.render('products', { products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send('Error loading products');
  }
});

app.use((req, res) => {
  res.status(404).render('not-found'); 
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});


