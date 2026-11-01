jest.setTimeout(20000);

const { Client } = require('pg');
const CartModels = require('../models/cartModels');
const ProductModels = require('../models/productModels');

let client;

beforeAll(async () => {
  client = new Client({
    database: 'ecommerce_test',
  });
  await client.connect();
});

afterAll(async () => {
  await client.end();
});

beforeEach(async () => {
  await client.query(`TRUNCATE TABLE cart RESTART IDENTITY CASCADE;`);
  await client.query(`TRUNCATE TABLE products RESTART IDENTITY CASCADE;`);
  await client.query(`TRUNCATE TABLE users RESTART IDENTITY CASCADE;`);
  await client.query(`INSERT INTO users (username, password) VALUES ($1, $2)`, ['testuser', 'hashedpassword']);
});

describe('Cart Models', () => {
  test('add item to cart', async () => {
    const newProduct = await ProductModels.addProduct(client, 'Test Product', 9.99, 5);

    await CartModels.addToCart(client, 1, newProduct.id);

    const result = await client.query('SELECT * FROM cart WHERE user_id = $1 AND product_id = $2', [1, newProduct.id]);
    expect(result.rowCount).toBe(1);
    expect(result.rows[0].user_id).toBe(1);
    expect(result.rows[0].product_id).toBe(newProduct.id);
  });

  test('delete item from cart', async () => {
    const newProduct = await ProductModels.addProduct(client, 'Test Product', 9.99, 5);
    await CartModels.addToCart(client, 1, newProduct.id);
    await CartModels.deleteFromCart(client, 1, newProduct.id);

    const result = await client.query('SELECT * FROM cart WHERE user_id = $1 AND product_id = $2', [1, newProduct.id]);
    expect(result.rowCount).toBe(0);
  });

   test('retrieve all items in cart', async () => {
    const product1 = await ProductModels.addProduct(client, 'Product One', 10.99, 5);
    const product2 = await ProductModels.addProduct(client, 'Product Two', 20.99, 3);

    await CartModels.addToCart(client, 1, product1.id);
    await CartModels.addToCart(client, 1, product2.id);

    const items = await CartModels.allCartItems(client, 1);

    expect(items.length).toBe(2);
    const productNames = items.map(item => item.product_name);
    expect(productNames).toContain('Product One');
    expect(productNames).toContain('Product Two');
  });
});
