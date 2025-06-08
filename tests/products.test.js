const { Client } = require('pg');
const Product = require('../lib/products.js');

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

test('addProduct inserts product into DB', async () => {
  await client.query('TRUNCATE products RESTART IDENTITY CASCADE');
  const product = await Product.addProduct(client, 'sweater', 19.99, 10);

  const res = await client.query('SELECT * FROM products WHERE id = $1', [product.id]);
  expect(res.rows.length).toBe(1);
  expect(res.rows[0].product_name).toBe('sweater');
  expect(res.rows[0].price).toBe('19.99');
  expect(res.rows[0].quantity).toBe(10);
  expect(res.rows[0].in_stock).toBe(true);
});

test('delete product from DB', async () => {
  const product = await Product.addProduct(client, 'baseball hat', 11.99, 7);
  const res = await client.query('SELECT * FROM products WHERE id = $1', [product.id]);
  expect(res.rows[0].product_name).toBe('baseball hat');

  await Product.deleteProduct(client, product.id);
  const resDelete = await client.query('SELECT * FROM products WHERE id = $1', [product.id]);
  expect(resDelete.rows.length).toBe(0);
});

test('display quantity of product in stock', async () => {
  await client.query('TRUNCATE products RESTART IDENTITY CASCADE');
  const product1 = await Product.addProduct(client, 'baseball hat', 11.99, 7);
  const product2 = await Product.addProduct(client, 'jersey', 80.99, 5);

  let output1 = await Product.amountInStock(client, product2.id);
  let output2 = await Product.amountInStock(client, product1.id);
  expect(output1).toBe(5);
  expect(output2).toBe(7);
});

test('confirm product is in stock', async () => {
  await client.query('TRUNCATE products RESTART IDENTITY CASCADE');
  const product1 = await Product.addProduct(client, 'baseball hat', 11.99, 7);
  const product2 = await Product.addProduct(client, 'jersey', 80.99, 5);

  let output1 = await Product.isInStock(client, product2.id);
  let output2 = await Product.isInStock(client, product1.id);
  expect(output1).toBe(true);
  expect(output2).toBe(true);
});

test('change product quantity', async () => {
  await client.query('TRUNCATE products RESTART IDENTITY CASCADE');
  const product = await Product.addProduct(client, 'baseball hat', 11.99, 7);

  await Product.changeQuantity(client, product.id, 20);
  const res = await client.query('SELECT quantity FROM products WHERE id = $1', [product.id]);
  expect(res.rows[0].quantity).toBe(20);
});

test('confirm product price is updated', async () => {
  await client.query('TRUNCATE products RESTART IDENTITY CASCADE');
  const product = await Product.addProduct(client, 'baseball hat', 11.99, 7);

  await Product.changePrice(client, product.id, 25.99);
  const res = await client.query('SELECT price FROM products WHERE id = $1', [product.id]);
  expect(res.rows[0].price).toBe('25.99');
});

test('change product name', async () => {
  await client.query('TRUNCATE products RESTART IDENTITY CASCADE');
  const product = await Product.addProduct(client, 'baseball hat', 11.99, 7);

  await Product.changeProductName(client, product.id, 'ball cap');
  const res = await client.query('SELECT product_name FROM products WHERE id = $1', [product.id]);
  expect(res.rows[0].product_name).toBe('ball cap');
});

test('check which products are in stock', async () => {
  await client.query('TRUNCATE products RESTART IDENTITY CASCADE');
  const product1 = await Product.addProduct(client, 'baseball hat', 11.99, 7);
  const product2 = await Product.addProduct(client, 'jersey', 79.99, 10);

  let output = await Product.productsInStock(client);
  const names = output.map(p => p.product_name);
  expect(names).toEqual(['baseball hat', 'jersey']);
});

test('get product by ID returns correct product', async () => {
  await client.query('TRUNCATE products RESTART IDENTITY CASCADE');
  const addedProduct = await Product.addProduct(client, 'gloves', 29.99, 4);

  const foundProduct = await Product.getProductById(client, addedProduct.id);
  expect(foundProduct).toBeDefined();
  expect(foundProduct.name).toBe('gloves');
  expect(foundProduct.price).toBe('29.99');
  expect(foundProduct.quantity).toBe(4);
});

