const { client } = require('../lib/db');
const ProductServices = require('../services/productsServices');

exports.viewProducts = async (req, res) => {
  try {
    const products = await ProductServices.getAllProducts(client);
    res.render('products', { products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send('Error loading products');
  }
};
