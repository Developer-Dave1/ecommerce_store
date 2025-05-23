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
  const product = await Product.addProduct('sweater', 19.99, 10, true, client);

  //confirm it's in the DB
  const res = await client.query('SELECT * FROM products WHERE product_name = $1', ['sweater']);

  expect(res.rows.length).toBe(1);
  expect(res.rows[0].product_name).toBe('sweater');
  expect(res.rows[0].price).toBe('19.99');
  expect(res.rows[0].quantity).toBe(10);
  expect(res.rows[0].in_stock).toBe(true);
});


test('delete product from DB', async () => {
  // add product instance and to database
  const product = await Product.addProduct('baseball hat', 11.99, 7, true, client);

  // confirm it's in the DB
  const res = await client.query('SELECT * FROM products WHERE product_name = $1', ['baseball hat']);
  expect(res.rows[0].product_name).toBe('baseball hat');

  // delete product from database
  await Product.deleteProduct('baseball hat', client);
  const resDelete = await client.query('SELECT * FROM products WHERE product_name = $1', ['baseball hat']);
  expect(resDelete.rows.length).toBe(0);
});



test('display how many products of a kind are in stock', async () => {
  // clear database
  await client.query('TRUNCATE products RESTART IDENTITY CASCADE');

  // add products to database
  const product1 = await Product.addProduct('baseball hat', 11.99, 7, true, client);
  const product2 = await Product.addProduct('jersey', 80.99, 5, true, client);

  // confirm it's in the DB
  const res1 = await client.query('SELECT * FROM products WHERE product_name = $1', ['baseball hat']);
  expect(res1.rows[0].product_name).toBe('baseball hat');
  const res2 = await client.query('SELECT * FROM products WHERE product_name = $1', ['jersey']);
  expect(res2.rows[0].product_name).toBe('jersey');

  // confirm quantity of product
  let output1 = await Product.amountInStock(client, 'jersey');
  let output2 = await Product.amountInStock(client, 'baseball hat');
  expect(output1).toBe(5);
  expect(output2).toBe(7);
});



test('confirm product is in stock', async () => {
  // clear database
  await client.query('TRUNCATE products RESTART IDENTITY CASCADE');

  // add products to database
  const product1 = await Product.addProduct('baseball hat', 11.99, 7, true, client);
  const product2 = await Product.addProduct('jersey', 80.99, 5, true, client);

  // confirm it's in the DB
  const res1 = await client.query('SELECT * FROM products WHERE product_name = $1', ['baseball hat']);
  expect(res1.rows[0].product_name).toBe('baseball hat');
  const res2 = await client.query('SELECT * FROM products WHERE product_name = $1', ['jersey']);
  expect(res2.rows[0].product_name).toBe('jersey');

  // confirm quantity of product
  let output1 = await Product.inStock(client, 'jersey');
  let output2 = await Product.inStock(client, 'baseball hat');
  expect(output1).toBe(true);
  expect(output2).toBe(true);
});


