const client = require('../lib/client');
const ProductModels = require('../models/productModels');
const ProductServices = require('../services/productsServices');
const UserServices = require('../services/userServices');
const ReviewsModels = require('../models/reviewsModels.js');
const { validationResult } = require('express-validator');


exports.viewProducts = async (req, res, next) => {
  try {
    const username = req.session.username;

    if (!username) {
      req.flash('error', 'You must login to see products.');
      return res.redirect('/login');
    }

    const limit = 3;
    const rawPage = req.query.page; 
    const page = parseInt(rawPage, 10); 
    const hasPageParam = typeof rawPage !== 'undefined';

    const countResult = await client.query('SELECT COUNT(*) FROM products;');
    const totalProducts = parseInt(countResult.rows[0].count);
    const totalPages = totalProducts === 0 ? 1 : Math.ceil(totalProducts / limit);

    if (hasPageParam && (page > totalPages || page < 1 || Number.isNaN(page))) {
      req.flash('error', 'The page requested in the query is not valid');
      return res.redirect('/products?page=1');
    }

    const safePage = Number.isNaN(page) ? 1 : page;
    const offset = (safePage - 1) * limit;

    const result = await client.query(
      'SELECT * FROM products ORDER BY product_name ASC LIMIT $1 OFFSET $2',
      [limit, offset]
    );

    return res.render('allProducts', {
      products: result.rows,
      currentPage: safePage,
      totalPages,
      username
    });

  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).send('Error loading products');
  }
};

exports.getProductsByType = async (req, res) => {
  try {
    const username = req.session.username;

    if (!username) {
      console.warn(`You need to successfully login in order to see products.`);
      req.flash('error', 'You must login to see products.');
      return res.redirect('/login');
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
      req.flash('error', 'The page requested in the query is not valid.');
      console.log(`this executed`);
      return res.redirect(`/products/category/${product_type}?page=1`);
    }

    const safePage = Number.isNaN(page) ? 1 : page;
    const offset = (safePage - 1) * limit;

    const result = await client.query(
      'SELECT * FROM products WHERE product_type = $1 ORDER BY product_name ASC LIMIT $2 OFFSET $3',
      [product_type, limit, offset]
    );

    return res.render('categoryPages', {
      products: result.rows,
      currentPage: safePage,
      totalPages,
      username,
      productType: product_type
    });

  } catch (error) {
    console.error('Error fetching product category page:', error);
    res.status(500).send('Error loading products');
  }
};


exports.getSingleProduct = async (req, res) => {
  const product_id = parseInt(req.params.product_id, 10);
  
  try {
    const username = req.session.username;

    if (!username) {
      console.warn(`You need to login to see product details.`);
      req.flash('error', 'You must login to see products.');
      return res.redirect('/login');
    }
    
    const result = await client.query(
      'SELECT * FROM products WHERE id = $1',
      [product_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).send('Product not found.');
    }

    const product = result.rows[0];
    const reviews = await ReviewsModels.getProductReviews(client, product_id);
    
    res.render('singleProduct', {
      product,
      username,
      reviews
    });

  } catch (error) {
    console.error(`Error fetching single product page: ${error.name} - ${error.message}`);
    res.status(500).send('Error loading product page.');
  }
};

exports.postReview = async (req, res) => {
  const user_id = req.session.user_id;
  const username = req.session.username;
  const product_id = parseInt(req.body.product_id, 10);
  const comment = req.body.comment;
  
  try {
    const result = await client.query('SELECT * FROM products WHERE id = $1', [product_id]);
    const product = result.rows[0];
    await ReviewsModels.postReview(client, product_id, user_id, comment, username);
    req.flash('success', 'Review added!');
    res.redirect(`/products/item/${product_id}`);

  } catch (error) {
    console.error(`There was an error adding the review.`);
    console.error(`${error.name} - ${error.message}`);
    throw error;
  }
}


exports.renderManagePage = async (req, res) => {
  try {
    const products = await ProductServices.getAllProducts(client);
    res.render('manageProducts', {products});

  } catch (error) {
    console.error(`There was an error loading the manage page.`);
    console.error(`${error.name} - ${error.message}`);
    throw error;
  }
}


exports.deleteProduct = async (req, res) => {
  const product_id = parseInt(req.body.product_id, 10);
  
  try {
    await ProductServices.deleteProduct(client, product_id);
    req.flash('success', 'Product deleted!');
    res.redirect(`/products/manage`);

  } catch (error) {
    console.error(`There was an error adding the review.`);
    console.error(`${error.name} - ${error.message}`);
    throw error;
  }
}


exports.renderManageSingleProduct = async (req, res) => {
  try {
    const product_id = parseInt(req.params.product_id, 10);
    const productQuery = await client.query(`SELECT * FROM products WHERE id = $1`, [product_id]);
    const product = productQuery.rows[0];
    res.render('manageSingleProduct', {product});

  } catch (error) {
    console.error(`There was an error loading the manage single product page.`);
    console.error(`${error.name} - ${error.message}`);
    throw error;
  }
}

exports.inventoryChangeQuantity = async (req, res) => {
  const product_id = parseInt(req.params.product_id, 10);
  const quantity = parseInt(req.body.quantity);
  await ProductModels.changeQuantity(client, product_id, quantity);
    const productQuery = await client.query(`SELECT * FROM products WHERE id = $1`, [product_id]);
  const product = productQuery.rows[0];

  try {
    req.flash('success', 'Product quantity updated.');
    res.render('manageSingleProduct', {
    product,
    });

  } catch (error) {
    console.error(`There was an error changing the product's price.`);
    console.error(`${error.name} - ${error.message}`);
    res.redirect('/products/manage');
  }
}

exports.changeProductName = async (req, res) => {
  const product_id = parseInt(req.params.product_id, 10);
  const newName = req.body.new_name;
  console.log(`new name is ${newName}`);
  await ProductModels.changeProductName(client, product_id, newName);
  const productQuery = await client.query(`SELECT * FROM products WHERE id = $1`, [product_id]);
  const product = productQuery.rows[0];

  try {
    req.flash('success', 'Product name changed.');
    res.render('manageSingleProduct', {
    product,
    });

  } catch (error) {
    console.error(`There was an error changing the product's name.`);
    console.error(`${error.name} - ${error.message}`);
    res.redirect('/products/manage');
  }
}

exports.changeProductDescription = async (req, res) => {
  const product_id = parseInt(req.params.product_id, 10);
  const newDescription = req.body.description;
  console.log(`new description is ${newDescription}`);
  await ProductModels.changeProductDescription(client, product_id, newDescription);
  const productQuery = await client.query(`SELECT * FROM products WHERE id = $1`, [product_id]);
  const product = productQuery.rows[0];

  try {
    req.flash('success', 'Product description changed.');
    res.render('manageSingleProduct', {
    product,
    });

  } catch (error) {
    console.error(`There was an error changing the product's price.`);
    console.error(`${error.name} - ${error.message}`);
    res.redirect('/products/manage');
  }
}