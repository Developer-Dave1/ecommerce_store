const CartServices = require('../services/cartServices');
const client = require('../lib/client');


exports.allCartItems = async (req, res) => {
  const username = req.session.username;

    if (!username) {
      console.warn(`You need to successfully login in order to see your cart.`);
      req.flash('error', 'You must login to see your cart.');
      return res.redirect('/login');
    }

  const user_id = req.session.user_id || 1;
  try {
    const items = await CartServices.allCartItems(client, user_id);

    let total = 0;
    if (items && items.length > 0) {
      total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }

    res.render('cart', {
      items: items,
      total: total.toFixed(2),
    });

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
    const page = parseInt(req.body.page, 10) || 1;
    await CartServices.addToCart(client, user_id, product_id, quantityToAdd);
    req.flash('success', 'Product added to cart.');
    res.redirect(`/cart`); 
  } catch (error) {
    req.flash('error', 'error: product not added to cart.')
    console.error(`Error adding item to cart: ${error.name} - ${error.message}`);
    res.status(500).send('Failed to add item to cart.');
  }
};

exports.removeFromCart = async (req, res) => {
  const user_id = req.session.user_id || 1;
  const product_id = parseInt(req.body.product_id, 10);

  try {
    await CartServices.deleteFromCart(client, user_id, product_id);
    req.flash('success', 'Item removed from cart.');

    const items = await CartServices.allCartItems(client, user_id);
    const total = items ? items.reduce((sum, item) => sum + item.price * item.quantity, 0) : 0;

    res.redirect('/cart');
  } catch (error) {
    console.error(`Error removing item from cart: ${error.name} - ${error.message}`);
    res.status(500).send('Failed to remove item from cart.');
  }
};
