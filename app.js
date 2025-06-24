const express = require('express');
const app = express();
const path = require('path');
const Product = require('./lib/products.js');
const Cart = require('./lib/cart.js'); 
const { Client } = require('pg');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);


const client = new Client({ database: 'ecommerce' });
client.connect();

app.set('view engine', 'pug');  
app.set('views', path.join(__dirname, 'views'));  

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
  store: new pgSession({
    pool: client,             
    tableName: 'session'      
  }),
  secret: 'yourSuperSecretKey', // generate a secret at some point
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60,   
    secure: false,           
    httpOnly: true,
    sameSite: 'lax'
  }
}));


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

app.get('/cart', async (req, res) => {
  try {
    const cart = req.session.cart || [];

    if (cart.length === 0) {
      return res.render('cart', { cartItems: [], total: '0.00' });
    }

    const enrichedCart = [];

    for (const item of cart) {
      const result = await client.query(
        'SELECT id, product_name, price FROM products WHERE id = $1',
        [item.product_id]
      );

      const product = result.rows[0];
      if (product) {
        enrichedCart.push({
          product_id: product.id,
          product_name: product.product_name,
          price: parseFloat(product.price),
          quantity: item.quantity,
          total: parseFloat(product.price) * item.quantity
        });
      }
    }

    const totalCartAmount = enrichedCart.reduce((sum, item) => sum + item.total, 0);

    res.render('cart', {
      cartItems: enrichedCart,
      total: totalCartAmount.toFixed(2)
    });
  } catch (error) {
    console.error('Error loading cart from session:', error);
    res.status(500).send('Error loading cart.');
  }
});


app.post('/cart/add', async (req, res) => {
  try {
    const product_id = parseInt(req.body.product_id, 10);
    const quantityToAdd = 1;

    const currentAmount = await Product.amountInStock(client, product_id);

    if (currentAmount < quantityToAdd) {
      return res.status(400).send('Not enough stock available.');
    }

    if (!req.session.cart) {
      req.session.cart = [];
    }

    const existingItem = req.session.cart.find(item => item.product_id === product_id);

    if (existingItem) {
      existingItem.quantity += quantityToAdd;
    } else {
      req.session.cart.push({ product_id, quantity: quantityToAdd });
    }

    await Product.changeQuantity(client, product_id, currentAmount - quantityToAdd);
    res.redirect('/cart');
    
  } catch (error) {
    console.error('Error adding to cart:', error.message, error.stack);
    res.status(500).render('not-found');
  }
});


app.post('/cart/remove', async (req, res) => {
  try {
    const product_id = parseInt(req.body.product_id, 10);
    
    if (!req.session.cart) {
      return res.redirect('/cart')
    }

    const cart = req.session.cart;
    
    const index = cart.findIndex(item => item.product_id === product_id);

    if (index !== -1) {
      const removedItem = cart.splice(index, 1)[0];

      const currentQuantity = await Product.amountInStock(client, product_id);
      await Product.changeQuantity(client, product_id, currentQuantity + removedItem.quantity);
    }

    res.redirect('/cart');
  
  } catch (error) {
    console.error('Error loading cart:', error.message, error.stack);
    res.status(500).render('not-found');

  }
});



app.use((req, res) => {
  res.status(404).render('not-found');
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});


