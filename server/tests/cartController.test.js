jest.mock('../services/cartServices'); // Automatically mock the service

const CartServices = require('../services/cartServices');
const CartController = require('../controllers/cartController');
const { client } = require('../lib/db');

describe('CartController', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      session: {
        user_id: 1
      }
    };
    res = {
      render: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };

    CartServices.allCartItems.mockReset();
  });

  test('render cart view with items', async () => {
    const fakeItems = [
      { id: 1, product_name: 'Test Product', quantity: 2 },
      { id: 2, product_name: 'Another Product', quantity: 1 }
    ];
    CartServices.allCartItems.mockResolvedValue(fakeItems);

    await CartController.allCartItems(req, res);

    expect(CartServices.allCartItems).toHaveBeenCalledWith(client, 1);
    expect(res.render).toHaveBeenCalledWith('cart', { items: fakeItems });
  });

  test('should handle service error and send 500', async () => {
    const error = new Error('Service failed');
    CartServices.allCartItems.mockRejectedValue(error);

    await CartController.allCartItems(req, res);

    expect(CartServices.allCartItems).toHaveBeenCalledWith(client, 1);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith('Failed to load cart.');
  });
});
