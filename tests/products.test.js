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



test('display all product names from DB in an array', async () => {
  // clear database
  await client.query('TRUNCATE products RESTART IDENTITY CASCADE');

  // add products instances and add products to database
  const product1 = await Product.addProduct('baseball hat', 11.99, 7, true, client);
  const product2 = await Product.addProduct('jersey', 80.99, 5, true, client);

  // confirm it's in the DB
  const res1 = await client.query('SELECT * FROM products WHERE product_name = $1', ['baseball hat']);
  expect(res1.rows[0].product_name).toBe('baseball hat');
  const res2 = await client.query('SELECT * FROM products WHERE product_name = $1', ['jersey']);
  expect(res2.rows[0].product_name).toBe('jersey');

  // output products
  let output = await Product.createProductNameArray(client);
  expect(output).toEqual(['baseball hat', 'jersey']);
});




