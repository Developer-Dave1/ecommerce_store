const client = require('../lib/client');
const ReviewsModels = require('../models/reviewsModels');
const ProductServices = require('../services/productsServices');

exports.deleteUserReview = async (req, res) => {
  const user_id = req.session.user_id;
  const username = req.session.username;
  const product_id = parseInt(req.params.product_id, 10);

  if (!user_id || isNaN(product_id)) {
    req.flash('error', 'Missing required data to delete review.');
    return res.redirect('/products');
  }

  try {
    await ReviewsModels.deleteReview(client, user_id, product_id);
    req.flash('success', 'Review deleted');

    const productQuery = await client.query('SELECT * FROM products WHERE id = $1', [product_id]);
    const product = productQuery.rows[0];
    const reviews = await ReviewsModels.getProductReviews(client, product_id);
    console.log(`The username is ${username}`);

    res.render('singleProduct', {
      product,
      reviews,
      username,
      success: req.flash('success'),
      error: req.flash('error')
    });

  } catch (error) {
    console.error(`Could not delete user review with controller.`);
    console.error(`${error.name} - ${error.message}`);
    req.flash('error', 'There was a problem deleting your review.');
    res.redirect(`/products/item/${product_id}`);
  }
};
