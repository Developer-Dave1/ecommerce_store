const client = require('../lib/client');
const ReviewsModels = require('../models/reviewsModels');

exports.getProductReviews = async (req, res) => {
  const product_id = Number(req.params.product_id);

  if (!Number.isSafeInteger(product_id) || product_id <= 0) {
    return res.status(400).json({ error: 'Invalid product ID.' });
  }

  try {
    const reviews = await ReviewsModels.getProductReviews(client, product_id);
    return res.json(reviews);
  } catch (error) {
    console.error('Could not load product reviews:', error.message);
    return res.status(500).json({ error: 'Could not load reviews.' });
  }
};

exports.deleteUserReview = async (req, res) => {
  const user_id = req.session.user_id;
  const product_id = Number(req.params.product_id);

  if (!user_id) {
    return res.status(401).json({ error: 'Please log in.' });
  }

  if (!Number.isSafeInteger(product_id) || product_id <= 0) {
    return res.status(400).json({ error: 'Invalid product ID.' });
  }

  try {
    await ReviewsModels.deleteReview(client, user_id, product_id);
    return res.status(204).end();
  } catch (error) {
    console.error('Could not delete user review:', error);
    return res.status(500).json({ error: 'Could not delete review.' });
  }
};

exports.postReview = async (req, res) => {
  const user_id = req.session.user_id;
  const username = req.session.username;
  const product_id = parseInt(req.body.product_id, 10);
  const comment = req.body.comment;
  
  try {
    const userReviewsForProduct = await ReviewsModels.getReviewsFromUserForSpecificProduct(client, user_id, product_id);
    if (userReviewsForProduct.length >= 1) {
      return res.status(409).json({message: 'There can only be one review per user per product.'});
    }

    const result = await client.query('SELECT * FROM products WHERE id = $1', [product_id]);
    await ReviewsModels.postReview(client, product_id, user_id, comment, username);
    res.status(200).json({message: 'Review successfully added.'});

  } catch (error) {
    if (error.code === '23505' && error.constraint === 'reviews_user_product_unique') {
      return res.status(409).json({message: 'There can only be one review per user per product.'});
    }
    console.error(`There was an error adding the review.`);
    console.error(`${error.name} - ${error.message}`);
    res.status(500).json({message: 'There was an error adding the review'});
  }
}
