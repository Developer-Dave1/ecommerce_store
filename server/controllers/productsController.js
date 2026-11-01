const client = require('../lib/client');
const ProductModels = require('../models/productModels');
const ProductServices = require('../services/productsServices');
const UserServices = require('../services/userServices');
const ReviewsModels = require('../models/reviewsModels.js');
const { validationResult } = require('express-validator');


exports.viewProducts = async (req, res, next) => {
  try {
    const username = req.session.username;

    //if (!username) {
    //  res.status(401).json({ error: "Please log in to view products." });
    //}

    // Pagination temporarily disabled so the main page shows all products.
    /*
    const limit = 3;
    const rawPage = req.query.page; 
    const page = parseInt(rawPage, 10); 
    const hasPageParam = typeof rawPage !== 'undefined';

    const countResult = await client.query('SELECT COUNT(*) FROM products;');
    const totalProducts = parseInt(countResult.rows[0].count);
    const totalPages = totalProducts === 0 ? 1 : Math.ceil(totalProducts / limit);

    if (hasPageParam && (page > totalPages || page < 1 || Number.isNaN(page))) {
      return res.status(400).json({ error: "Requested page not available."});
    }

    const safePage = Number.isNaN(page) ? 1 : page;
    const offset = (safePage - 1) * limit;

    const result = await client.query(
      'SELECT * FROM products ORDER BY product_name ASC LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    */

    const result = await client.query(
      'SELECT * FROM products ORDER BY product_name ASC'
    );

    console.log(result);
    return res.json(result.rows);

  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({error: "Error loading products."});
  }
};

exports.getProductsByType = async (req, res) => {
  try {
    const username = req.session.username;

    if (!username) {
      console.warn(`You need to successfully login in order to see products.`);
      res.status(401).json({ error: "Please log in to view products." });
    }

    const limit = 3;
    const rawPage = req.query.page;
    const page = parseInt(rawPage, 10);
    const hasPageParam = typeof rawPage !== 'undefined';
    const product_type = req.params.product_type;

    const countResult = await client.query(
      'SELECT COUNT(*) FROM products WHERE product_type = $1',
      [product_type]
    );
    const totalProducts = parseInt(countResult.rows[0].count, 10);
    const totalPages = totalProducts === 0 ? 1 : Math.ceil(totalProducts / limit);

    if (hasPageParam && (page > totalPages || page < 1 || Number.isNaN(page))) {
      const targetPage = (!Number.isInteger(page) || page < 1) ? 1 : totalPages;
      return res.status(200);
    }

    const safePage = Number.isNaN(page) ? 1 : page;
    const offset = (safePage - 1) * limit;

    const result = await client.query(
      'SELECT * FROM products WHERE product_type = $1 ORDER BY product_name ASC LIMIT $2 OFFSET $3',
      [product_type, limit, offset]
    );

    return res.status(200);

  } catch (error) {
    console.error('Error fetching product category page:', error);
    return res.status(500).json({error: "Error loading product category page."});
  }
};


exports.getSingleProduct = async (req, res) => {
  const product_id = parseInt(req.params.product_id, 10);
  
  try {
    const username = req.session.username;

    if (!username) {
      console.warn(`You need to login to see product details.`);
       return res.status(401).json({ error: "Please log in to view products." });
    }
    
    const result = await client.query(
      'SELECT * FROM products WHERE id = $1',
      [product_id]
    );

    if (result.rowCount === 0) {
      return res.status(400).json({ error: "Product not found." });
    }

    const product = result.rows[0];
    const reviews = await ReviewsModels.getProductReviews(client, product_id);
    
    return res.status(200);

  } catch (error) {
    console.error(`Error fetching single product page: ${error.name} - ${error.message}`);
    return res.status(500).json({ error: "Error loading product page." });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product_id = parseInt(req.body.product_id, 10);
    await ProductServices.deleteProduct(client, product_id);
    console.log('Product successfully deleted.');
    return res.status(200).json({message: 'Product successfully deleted.'});

  } catch (error) {
    console.error('There was an error deleting the product.');
    console.error(`${error.name} - ${error.message}`);
    return res.status(500).json({message:'There was an error deleting the product.'});
  }
}

exports.inventoryChangeQuantity = async (req, res) => {
  const product_id = parseInt(req.params.product_id, 10);
  const newQuantity = parseInt(req.body.quantity, 10);

  if (!Number.isInteger(product_id) || product_id <= 0) {
    return res.status(400).json({message: 'Error: invalid product ID'});
  }

  if (!Number.isInteger(newQuantity) || newQuantity < 0 || newQuantity > 100) {
    return res.status(400).json({message: 'Quantity cannot be less than 0 or more than 100.'});
  }

  try {
    await ProductModels.changeQuantity(client, product_id, newQuantity);
    const productQuery = await client.query(
      `SELECT * FROM products WHERE id = $1`,
      [product_id]
    );
    const product = productQuery.rows[0];
    return res.status(200).json({message: 'Success updated product quantity'});

  } catch (error) {
    console.error(`There was an error changing the product's quantity.`);
    console.error(`${error.name} - ${error.message}`);
    return res.status(500).json({message: 'Unable to update product quantity.'});
  }
};


exports.changeProductName = async (req, res) => {
  const product_id = parseInt(req.params.product_id, 10);
  const newName = req.body.new_name?.trim();

  if (!Number.isInteger(product_id) || product_id <= 0) {
    return res.status(400).json({message: 'Invalid product ID.'});
  }

  if (!newName || newName.length > 50) {
    return res.status(400).json({message: 'Product name must be between 1 and 50 characters.'});
  }

  try {
    await ProductModels.changeProductName(client, product_id, newName);
    const productQuery = await client.query(
      `SELECT * FROM products WHERE id = $1`,
      [product_id]
    );
    return res.status(200).json({message: 'Product name changed.'});
  } catch (error) {
    console.error(`There was an error changing the product's name.`);
    console.error(`${error.name} - ${error.message}`);
    return res.status(500).json({message: 'Unable to change product name.'});
  }
};


exports.changeProductDescription = async (req, res) => {
  try {
    const product_id = parseInt(req.params.product_id, 10);
    const newDescription = req.body.description;
    await ProductModels.changeProductDescription(client, product_id, newDescription);
    return res.status(200).json({message: 'Product description changed.'});
  } catch (error) {
    console.error(`There was an error changing the product's price.`);
    console.error(`${error.name} - ${error.message}`);
    return res.status(500).json({message: "There was an error changing the product's price."});
  }
}


exports.updateProduct = async (req, res) => {
  const product_id = Number(req.params.product_id);
  const { product_name, price, quantity, description } = req.body;

  if (!Number.isSafeInteger(product_id) || product_id <= 0) {
    return res.status(400).json({ error: 'Invalid product ID.' });
  }

  if (typeof product_name !== 'string' || product_name.trim().length === 0 || product_name.trim().length > 50) {
    return res.status(400).json({ error: 'Product name must be between 1 and 50 characters.' });
  }

  if (!Number.isSafeInteger(quantity) || quantity < 0 || quantity > 100) {
    return res.status(400).json({ error: 'Quantity must be a whole number between 0 and 100.' });
  }

  if (!Number.isFinite(price) || price < 0.01 || price > 100) {
    return res.status(400).json({ error: 'Price must be between $0.01 and $100.00.' });
  }

  if (typeof description !== 'string') {
    return res.status(400).json({ error: 'Description must be a string.' });
  }

  try {
    const product = await ProductModels.updateProduct(client, product_id, {
      product_name: product_name.trim(),
      price,
      quantity,
      description
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    return res.status(200).json(product);
  } catch (error) {
    console.error('Could not update product:', error);
    return res.status(500).json({ error: 'Could not update product.' });
  }
};

exports.changeProductPrice = async (req, res) => {
  try {
    const product_id = parseInt(req.params.product_id, 10);
    const reqPrice = Number.parseFloat(req.body.reqPrice);
    const newPrice = Math.round(reqPrice * 100) / 100;

     if (isNaN(product_id) || isNaN(reqPrice) || reqPrice <= 0 || reqPrice > 100) {
      return res.status(400).json({message: 'Invalid price. Min price is $0.01 and max item price is 100.00'});
    }

    await ProductModels.changePrice(client, product_id, newPrice)
    const productQuery = await client.query(`SELECT * FROM products WHERE id = $1`, [product_id]);
    return res.status(200).json({message: 'The price of the product has been successfully updated.'})
  } catch (error) {
    console.error(`There was an error changing the price of the product.`);
    return res.status(500).json({message: 'There was an error changing the price of the product.'})
  }
}
