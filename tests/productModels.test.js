jest.setTimeout(20000);

const { Client } = require('pg');
const ProductModels = require('../models/productModels');

let client;

beforeAll(async () => {
  client = new Client({
    database: 'ecommerce_test', // adjust your DB name if needed
  });
  await client.connect();
});

afterAll(async () => {
  await client.end();
});

beforeEach(async () => {
  await client.query(`TRUNCATE TABLE products RESTART IDENTITY CASCADE;`);
});

describe('Product Models', () => {
  test('insert a product and fetch it by ID', async () => {
    const newProduct = await ProductModels.addProduct(client, 'Test Shirt', 19.99, 10);

    const fetched = await ProductModels.getProductByID(client, newProduct.id);

    expect(fetched).not.toBeNull();
    expect(fetched.product_name).toBe('Test Shirt');
    expect(Number(fetched.price)).toBe(19.99);
  });

  test('insert a product and delete it', async () => {
    const newProduct = await ProductModels.addProduct(client, 'Test Shirt', 19.99, 10);

    const fetched = await ProductModels.getProductByID(client, newProduct.id);
    expect(fetched.product_name).toBe('Test Shirt');

    const deleted = await ProductModels.deleteProduct(client, newProduct.id);
    expect(deleted).not.toBeNull();

    const afterDelete = await ProductModels.getProductByID(client, newProduct.id);
    expect(afterDelete).toBeNull();
  });

  test('change product name', async () => {
    const newProduct = await ProductModels.addProduct(client, 'Test Shirt', 19.99, 10);

    const changed = await ProductModels.changeProductName(client, newProduct.id, 'Another Shirt Name');
    expect(changed.product_name).toBe('Another Shirt Name');

    const fetched = await ProductModels.getProductByID(client, newProduct.id);
    expect(fetched.product_name).toBe('Another Shirt Name');
  });

  test('change price of product', async () => {
    const newProduct = await ProductModels.addProduct(client, 'Test Shirt', 19.99, 10);

    const changed = await ProductModels.changePrice(client, newProduct.id, 1.99);
    expect(Number(changed.price)).toBe(1.99);

    const fetched = await ProductModels.getProductByID(client, newProduct.id);
    expect(Number(fetched.price)).toBe(1.99);
  });

  test('change quantity of product in stock', async () => {
    const newProduct = await ProductModels.addProduct(client, 'Test Shirt', 19.99, 10);

    const changed = await ProductModels.changeQuantity(client, newProduct.id, 6);
    expect(changed.quantity).toBe(6);

    const fetched = await ProductModels.getProductByID(client, newProduct.id);
    expect(fetched.quantity).toBe(6);
  });
});
