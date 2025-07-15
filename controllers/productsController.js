const { client } = require('../lib/db');
const ProductServices = require('../services/productsServices');
const UserServices = require('../services/userServices');

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

    res.render('products', {
      products: result.rows,
      currentPage: page,
      totalPages: totalPages
    });

  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send('Error loading products');
  }
};

