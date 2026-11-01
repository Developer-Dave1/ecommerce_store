jest.setTimeout(20000);

const { Client } = require('pg');
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

  test('retrieve quantity of product', async () => {
    const newProduct = await ProductModels.addProduct(client, 'Test Shirt', 19.99, 10);
    const quantityQuery = await ProductModels.amountInStock(client, newProduct.id);
    expect(quantityQuery).toBe(10);
  });

  test('get name of product with an ID', async () => {
    const newProduct = await ProductModels.addProduct(client, 'Test Shirt', 19.99, 10);
    const nameQuery = await ProductModels.getProductName(client, newProduct.id);
    expect(nameQuery).toBe('Test Shirt');
  });

  test('check if a product is in stock', async () => {
    const newProduct = await ProductModels.addProduct(client, 'Test Shirt', 19.99, 10);
    const inStockQuery = await ProductModels.isInStock(client, newProduct.id);
    expect(inStockQuery).toBe(true);
  });

  test('see all product names of in stock items', async () => {
    const newProduct1 = await ProductModels.addProduct(client, 'Test Shirt', 19.99, 10);
    const newProduct2 = await ProductModels.addProduct(client, 'Pants', 35.99, 8);

    const productsInStock = await ProductModels.productsInStock(client);
    expect(productsInStock).toContain('Test Shirt');
    expect(productsInStock).toContain('Pants');
  });

  test('retrieve product object using ID', async () => {
    const newProduct = await ProductModels.addProduct(client, 'Test Shirt', 19.99, 10);
    const productObject = await ProductModels.getProductByID(client, newProduct.id);
    expect(productObject.product_name).toBe('Test Shirt');
    expect(productObject.quantity).toBe(10);
  });

  test('fetch all product objects', async () => {
    const newProduct1 = await ProductModels.addProduct(client, 'Test Shirt', 19.99, 10);
    const newProduct2 = await ProductModels.addProduct(client, 'Pants', 35.99, 8);

    const allProducts = await ProductModels.getAllProducts(client);
    expect(allProducts[0].product_name).toContain('Test Shirt');
    expect(allProducts[1].quantity).toEqual(8);
  });

  test('check if product already exists', async () => {
  const newProduct = await ProductModels.addProduct(client, 'Test Shirt', 19.99, 10);
  const exists = await ProductModels.productDoesntExist(client, 'Test Shirt');
  expect(exists).toBe(false);
  const doesNotExist = await ProductModels.productDoesntExist(client, 'Nonexistent Product');
  expect(doesNotExist).toBe(true);
  });

});
