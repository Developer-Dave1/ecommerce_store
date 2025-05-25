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
  await Cart.addProductToCart(client, 1, 1, 5);

  // Check cart
  const res = await client.query('SELECT * FROM cart');
  expect(res.rows[0].product_id).toBe(1);
  expect(res.rows[0].user_id).toBe(1);
});

test('delete product from cart', async () => {
  // Clear database
  await client.query('TRUNCATE products, cart, users RESTART IDENTITY CASCADE');

  // Add a product (name, price, quantity, client)
  await Product.addProduct(client, 'sweater', 19.99, 10);

  // Add a user (username, password, client)
  await User.addUser(client, 'username', 'password');

  // Add to cart (user_id = 1, product_id = 1, client)
  await Cart.deleteProductInCart(client, 1, 1);

  // Check cart
  const res = await client.query('SELECT * FROM cart');
  expect(res.rows.length).toBe(0);

});

test('getCartContents returns correct cart items', async () => {
  await client.query('TRUNCATE users, products, cart RESTART IDENTITY CASCADE');

  const productId = await Product.addProduct(client, 'tshirt', 15.99, 10); 
  const userId = await User.addUser(client, 'bob', 'secret');              

  await Cart.addProductToCart(client, userId, productId, 3);

  const contents = await Cart.getCartContents(client, userId);

  expect(contents.length).toBe(1);
  expect(contents[0].product_name).toBe('tshirt');
  expect(contents[0].price).toBeCloseTo(15.99);
  expect(contents[0].quantity).toBe(3);
  expect(contents[0].total).toBeCloseTo(47.97);
});


test('updateCartQuantity updates quantity of a cart item', async () => {
  await client.query('TRUNCATE users, products, cart RESTART IDENTITY CASCADE');

  const productId = await Product.addProduct(client, 'hoodie', 29.99, 20);
  const userId = await User.addUser(client, 'alice', 'hunter2');

  await Cart.addProductToCart(client, userId, productId, 2); 
  await Cart.updateCartQuantity(client, userId, productId, 5); 

  const res = await client.query('SELECT quantity FROM cart WHERE user_id = $1 AND product_id = $2', [userId, productId]);
  expect(res.rows[0].quantity).toBe(5);
});



