const CartServices = require('../services/cartServices');
const { client } = require('../lib/db');

exports.allCartItems = async (req, res) => {
  const user_id = req.session.user_id || 1;
  try {
    const items = await CartServices.allCartItems(client, user_id);
    res.render('cart', { items });
  } catch (error) {
    console.error(`Error in controller while fetching cart: ${error.name} - ${error.message}`);
    res.status(500).send('Failed to load all items in cart.');
  }
};

exports.addToCart = async (req, res) => {
  const user_id = req.session.user_id || 1;
  const product_id = parseInt(req.body.product_id, 10);
  const quantityToAdd = parseInt(req.body.quantity, 10) || 1;

  try {
    await CartServices.addToCart(client, user_id, product_id, quantityToAdd);
    res.redirect('/cart'); 
  } catch (error) {
    console.error(`Error adding item to cart: ${error.name} - ${error.message}`);
    res.status(500).send('Failed to add item to cart.');
  }
};

exports.removeFromCart = async (req, res) => {
  const user_id = req.session.user_id || 1;
  const product_id = parseInt(req.body.product_id, 10);

  try {
    await CartServices.deleteFromCart(client, user_id, product_id);
    res.redirect('/cart'); 
  } catch (error) {
    console.error(`Error removing item from cart: ${error.name} - ${error.message}`);
    res.status(500).send('Failed to remove item from cart.');
  }
};
