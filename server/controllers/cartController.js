const CartServices = require('../services/cartServices');
const client = require('../lib/client');


exports.allCartItems = async (req, res) => {
  const username = req.session.username;

    if (!username) {
      console.warn(`You need to successfully login in order to see your cart.`);
      return res.status(401).json({message: 'You need to successfully login in order to see your cart.'})
    }

  const user_id = req.session.user_id || 1;
  try {
    const items = await CartServices.allCartItems(client, user_id);

    let total = 0;
    if (items && items.length > 0) {
      total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }

    return res.status(200).json({
      items,
      total: total.toFixed(2),
    });

  } catch (error) {
    console.error(`Error in controller while fetching cart: ${error.name} - ${error.message}`);
    return res.status(500).json({ error: 'Failed to load cart items.' });
  }
};


exports.addToCart = async (req, res) => {
  const user_id = req.session.user_id || 1;

  const product_id = parseInt(req.body.product_id || req.query.product_id, 10);
  const quantityRaw = req.body.quantity || req.query.quantity;
  const quantityToAdd = parseInt(quantityRaw, 10);

  if (!Number.isInteger(product_id) || product_id <= 0) {
    return res.status(400).json({ error: 'Invalid product ID.' });
  }

  if (!Number.isInteger(quantityToAdd) || quantityToAdd <= 0) {
    return res.status(400).json({ error: 'Quantity must be greater than zero and equal to or less than the in stock quantity.' });
  }

  try {
    const currentQuantityQuery = await client.query('SELECT quantity FROM products WHERE id=$1', [product_id]);

    if (currentQuantityQuery.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    const currentQuantity = currentQuantityQuery.rows[0].quantity;

    if (quantityToAdd > currentQuantity) {
      return res.status(400).json({ error: 'You cannot add more items to the cart than are in stock.' });
    }

    await CartServices.addToCart(client, user_id, product_id, quantityToAdd);
    return res.status(200).json({ message: 'Added to your cart.' });
  } catch (error) {
    console.error(`Error adding item to cart: ${error.name} - ${error.message}`);
    return res.status(500).json({ error: 'Unable to add item to cart.' });
  }
};


exports.removeFromCart = async (req, res) => {
  const user_id = req.session.user_id || 1;
  const product_id = parseInt(req.body.product_id, 10);

  if (!Number.isInteger(product_id) || product_id <= 0) {
    return res.status(400).json({ error: 'Invalid product ID.' });
  }

  try {
    await CartServices.deleteFromCart(client, user_id, product_id);

    const items = await CartServices.allCartItems(client, user_id);
    const total = items ? items.reduce((sum, item) => sum + item.price * item.quantity, 0) : 0;

    return res.status(200).json({
      message: 'Item removed from cart.',
      items,
      total: total.toFixed(2),
    });
  } catch (error) {
    console.error(`Error removing item from cart: ${error.name} - ${error.message}`);
    return res.status(500).json({ error: 'Failed to remove item from cart.' });
  }
};
