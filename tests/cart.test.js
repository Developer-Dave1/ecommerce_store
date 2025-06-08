const { Client } = require('pg');
const Cart = require('../lib/cart.js');
const Product = require('../lib/products.js');
const User = require('../lib/users.js');

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

//user_id, product_id, quantity

test('add product to cart', async () => {
  // Clear database
  await client.query('TRUNCATE products, cart_products, users RESTART IDENTITY CASCADE');
  
  // Add a user (username, password, client)
  await User.addUser(client, 'username', 'password');

  // Add a product (client, name, price, quantity)
  await Product.addProduct(client, 'shirt', 1.99, 5);

  // Add to cart (client, user_id = 1, product_id = 1, quanity =5)
  await Cart.addProductToCart(client, 1, 1, 5);

  // Check cart
  const res = await client.query('SELECT * FROM cart_products');
  expect(res.rows[0].product_id).toBe(1);
  expect(res.rows[0].user_id).toBe(1);
});

test('delete product from cart', async () => {
  // Clear database
  await client.query('TRUNCATE products, cart_products, users RESTART IDENTITY CASCADE');

  // Add a product (client, name, price, quantity)
  await Product.addProduct(client, 'sweater', 19.99, 10);

  // Add a user (client, username, password)
  await User.addUser(client, 'username', 'password');

  // Add to cart (client, user_id = 1, product_id = 1)
  await Cart.deleteProductInCart(client, 1, 1);

  // Check cart
  const res = await client.query('SELECT * FROM cart_products');
  expect(res.rows.length).toBe(0);

});

test('getCartContents returns correct cart items', async () => {
  await client.query('TRUNCATE users, products, cart_products RESTART IDENTITY CASCADE');

  const productId = await Product.addProduct(client, 'tshirt', 15.99, 10); 
  const userId = await User.addUser(client, 'bob', 'secret');              

  await Cart.addProductToCart(client, 1, 1, 10);

  const cartContents = await Cart.getCartContents(client, 1);

  expect(cartContents.length).toBe(1);
  expect(cartContents[0].product_name).toBe('tshirt');
  expect(cartContents[0].price).toBe('15.99');
  expect(cartContents[0].quantity).toBe(10);
});


test('updateCartQuantity updates quantity of a cart item', async () => {
  await client.query('TRUNCATE users, products, cart_products RESTART IDENTITY CASCADE');

  await Product.addProduct(client, 'hoodie', 29.99, 20);
  await User.addUser(client, 'bob', 'secret');

  await Cart.addProductToCart(client, 1, 1, 2); 
  await Cart.updateCartQuantity(client, 1, 1, 5); 

  const res = await client.query('SELECT quantity FROM cart_products WHERE user_id = $1 AND product_id = $2', [1, 1]);
  console.log(res);
  expect(res.rows[0].quantity).toBe(5);
});


