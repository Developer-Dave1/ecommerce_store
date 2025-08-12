jest.setTimeout(20000);

const { Client } = require('pg');
const CartServices = require('../services/cartServices');
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

describe('Cart Services', () => {
  test('adds a product to the cart successfully', async () => {
    const product = await ProductModels.addProduct(client, 'Test Product', 9.99, 5);

    await CartServices.addToCart(client, 1, product.id);

    const res = await client.query(`SELECT * FROM cart WHERE user_id = $1 AND product_id = $2`, [1, product.id]);
    expect(res.rowCount).toBe(1);
  });

  test('throws error when adding non-existent product', async () => {
    await expect(CartServices.addToCart(client, 1, 999)).rejects.toThrow('Product with ID 999 does not exist.');
  });

  test('throws error when adding out-of-stock product', async () => {
    const product = await ProductModels.addProduct(client, 'Out of Stock', 19.99, 0);

    await expect(CartServices.addToCart(client, 1, product.id)).rejects.toThrow(`Product Out of Stock is out of stock.`);
  });

  test('deletes product from cart successfully', async () => {
    const product = await ProductModels.addProduct(client, 'Delete Product', 12.99, 5);

    await CartServices.addToCart(client, 1, product.id);
    await CartServices.deleteFromCart(client, 1, product.id);

    const res = await client.query(`SELECT * FROM cart WHERE user_id = $1 AND product_id = $2`, [1, product.id]);
    expect(res.rowCount).toBe(0);
  });

  test('throws error when deleting non-existent product', async () => {
    await expect(CartServices.deleteFromCart(client, 1, 999)).rejects.toThrow('Product with ID 999 does not exist.');
  });

  test('updates quantity in cart successfully', async () => {
  const product = await ProductModels.addProduct(client, 'Quantity Product', 15.99, 10);

  await CartServices.addToCart(client, 1, product.id);

  const newQuantity = await CartServices.changeQuantity(client, 1, product.id, 3);

  expect(newQuantity).toBe(3);


  const res = await client.query(`SELECT quantity FROM cart WHERE user_id = $1 AND product_id = $2`, [1, product.id]);
  expect(res.rows[0].quantity).toBe(3);
});

test('throws error when new quantity exceeds stock', async () => {
  const product = await ProductModels.addProduct(client, 'Limited Product', 20.00, 2);

  await CartServices.addToCart(client, 1, product.id);

  await expect(CartServices.changeQuantity(client, 1, product.id, 5)).rejects.toThrow(
    `Cannot set quantity to 5. Only 2 available in stock.`
  );
});

});
