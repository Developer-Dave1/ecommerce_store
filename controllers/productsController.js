const { client } = require('../lib/db');
const ProductServices = require('../services/productsServices');
const UserServices = require('../services/userServices');

exports.viewProducts = async (req, res) => {
  try {
    const username = req.session.username;

    if (!username) {
      console.warn(`You need to successfully login in order to see products.`);
      req.flash('error', 'You must login to see products.');
      return res.redirect('/login');
    }

    const products = await ProductServices.getAllProducts(client);
    res.render('products', { products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send('Error loading products');
  }
};

