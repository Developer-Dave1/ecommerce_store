const { Client } = require('pg');
const Cart = require('../lib/cart.js');
const Product = require('../lib/products.js');
const User = require('../lib/user.js');

let client;

beforeAll(async () => {
  client = new Client({
    database: 'ecommerce',
  });
  await client.connect();
});


afterAll(async () => {
  await client.end();
});

test('add product to cart', async () => {
  // Clear database
  await client.query('TRUNCATE products, cart, users RESTART IDENTITY CASCADE');

  // Add a product (name, price, quantity, client)
  await Product.addProduct(client, 'sweater', 19.99, 10);

  // Add a user (username, password, client)
  await User.addUser(client, 'username', 'password');

  // Add to cart (user_id = 1, product_id = 1, client)
  await User.addProductToCart(client, 1, 1, 5);

  // Check cart
  const res = await client.query('SELECT * FROM cart');
  expect(res.rows[0].product_id).toBe(1);
  expect(res.rows[0].user_id).toBe(1);
});

