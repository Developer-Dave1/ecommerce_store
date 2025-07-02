const ProductServices = require('../services/productServices');

exports.viewProducts = async (client, req, res) => {
    try {
      const products = await ProductServices.getAllProducts(client);
      console.log(`Products fetched: ${products.length} products`);
      res.render('products', {products});

    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).send('Error loading products');
    }
};