jest.setTimeout(20000);

const { Client } = require('pg');
const ProductController = require('../controllers/productsController');
const ProductModels = require('../models/productModels');

let client;
let req;
let res;

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

describe('ProductControll', () => {
  beforeEach(() => {
    req = {};
    res = {
      render: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };
  });

  test('should render products view with products', async () => {
    await ProductModels.addProduct(client, 'Test Product', 19.99, 10);
    await ProductModels.addProduct(client, 'Another Product', 29.99, 5);

    await ProductController.viewProducts(req, res);

    expect(res.render).toHaveBeenCalledWith('products', expect.objectContaining({
      products: expect.any(Array)
    }));

    const productsPassed = res.render.mock.calls[0][1].products;
    expect(productsPassed.length).toBe(2);
  });

  test('should render products view with empty list', async () => {
    await ProductController.viewProducts(req, res);

    expect(res.render).toHaveBeenCalledWith('products', { products: [] });
  });

  test('should handle error and send 500', async () => {
    const originalFn = ProductController.viewProducts;
    ProductController.viewProducts = async (req, res) => {
      throw new Error("Forced error");
    };

    try {
      await ProductController.viewProducts(req, res);
    } catch (_) {

    }
    ProductController.viewProducts = originalFn;

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith('Error loading products');
  });
});
