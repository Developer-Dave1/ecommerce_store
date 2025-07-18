const { client } = require('../lib/db');
const ProductModels = require('../models/productModels');
const ProductServices = require('../services/productsServices');
const UserServices = require('../services/userServices');
const ReviewsModels = require('../models/reviewsModels.js');


exports.viewProducts = async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = 3;
  const offset = (page - 1) * limit;

  try {
    const username = req.session.username;

    if (!username) {
      console.warn(`You need to successfully login in order to see products.`);
      req.flash('error', 'You must login to see products.');
      return res.redirect('/login');
    }

    const countResult = await client.query('SELECT COUNT(*) FROM products;');
    const totalProducts = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalProducts / limit);

    const result = await client.query('SELECT * FROM products ORDER BY product_name ASC LIMIT $1 OFFSET $2', [limit, offset]);

    res.render('allProducts', {
      products: result.rows,
      currentPage: page,
      totalPages: totalPages,
      username: username
    });

  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send('Error loading products');
  }
};

exports.getProductsByType = async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = 3;
  const offset = (page - 1) * limit;
  const product_type = req.params.product_type;

  try {
    const username = req.session.username;

    if (!username) {
      console.warn(`You need to successfully login in order to see products.`);
      req.flash('error', 'You must login to see products.');
      return res.redirect('/login');
    }

    const countResult = await client.query(
      'SELECT COUNT(*) FROM products WHERE product_type = $1',
      [product_type]
    );
    const totalProducts = parseInt(countResult.rows[0].count, 10);
    const totalPages = Math.ceil(totalProducts / limit);

    const result = await client.query(
      'SELECT * FROM products WHERE product_type = $1 ORDER BY product_name ASC LIMIT $2 OFFSET $3',
      [product_type, limit, offset]
    );

    res.render('categoryPages', {
      products: result.rows,
      currentPage: page,
      totalPages: totalPages,
      username: username,
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
    //console.log(`userid: ${user_id}, username:${username}, product_id: ${product_id}, comment: ${comment}`);
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