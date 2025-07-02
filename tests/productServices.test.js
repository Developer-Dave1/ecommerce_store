jest.setTimeout(20000);

const { Client } = require('pg');
const ProductService = require('../services/productsServices');

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

describe('Product Services', () => {
  test('create a product successfully', async () => {
    const product = await ProductService.createProduct(client, 'Test Shirt', 19.99, 10);
    expect(product.product_name).toBe('Test Shirt');
    expect(Number(product.price)).toBe(19.99);
    expect(product.quantity).toBe(10);
  });

  test('fail to create a product with duplicate name', async () => {
    await ProductService.createProduct(client, 'Test Shirt', 19.99, 10);

    await expect(
      ProductService.createProduct(client, 'Test Shirt', 19.99, 10)
    ).rejects.toThrow(/A product with the name "Test Shirt" already exists./);
  });

  test('delete a product successfully', async () => {
    const product = await ProductService.createProduct(client, 'Test Shirt', 19.99, 10);
    const deleted = await ProductService.deleteProduct(client, product.id);
    expect(deleted.id).toBe(product.id);

    const afterDelete = await ProductService.amountInStock(client, product.id);
    expect(afterDelete).toBeNull();
  });

  test('rename a product successfully', async () => {
    const product = await ProductService.createProduct(client, 'Old Name', 19.99, 10);
    const renamed = await ProductService.renameProduct(client, product.id, 'New Name');
    expect(renamed.product_name).toBe('New Name');
  });

  test('fail to rename to a duplicate name', async () => {
    const p1 = await ProductService.createProduct(client, 'Product A', 10, 5);
    const p2 = await ProductService.createProduct(client, 'Product B', 15, 5);

    await expect(
      ProductService.renameProduct(client, p2.id, 'Product A')
    ).rejects.toThrow(/A product with the name "Product A" already exists./);
  });

  test('change price successfully', async () => {
    const product = await ProductService.createProduct(client, 'Test Shirt', 19.99, 10);
    const updated = await ProductService.changePrice(client, product.id, 29.99);
    expect(Number(updated.price)).toBe(29.99);
  });

  test('fail to change price to zero', async () => {
    const product = await ProductService.createProduct(client, 'Test Shirt', 19.99, 10);
    await expect(
      ProductService.changePrice(client, product.id, 0)
    ).rejects.toThrow(/New price must be greater than 0./);
  });

  test('change quantity successfully', async () => {
    const product = await ProductService.createProduct(client, 'Test Shirt', 19.99, 10);
    const updated = await ProductService.changeQuantity(client, product.id, 5);
    expect(updated.quantity).toBe(5);
  });

  test('fail to change quantity to negative', async () => {
    const product = await ProductService.createProduct(client, 'Test Shirt', 19.99, 10);
    await expect(
      ProductService.changeQuantity(client, product.id, -2)
    ).rejects.toThrow(/The new quantity must be equal to or greater than 0./);
  });

  test('get product name by id', async () => {
    const product = await ProductService.createProduct(client, 'Test Shirt', 19.99, 10);
    const name = await ProductService.getProductName(client, product.id);
    expect(name).toBe('Test Shirt');
  });

  test('get product stock amount', async () => {
    const product = await ProductService.createProduct(client, 'Test Shirt', 19.99, 10);
    const stock = await ProductService.amountInStock(client, product.id);
    expect(stock).toBe(10);
  });
});
