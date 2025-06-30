const pool = require('../lib/db');

exports.addToCart = async (user_id, product_id) => {
    try {
      const queryString = 'INSERT INTO cart_products (user_id, product_id) VALUES ($1, $2)';
      const queryParameters = [user_id, product_id];
      await pool.query(queryString, queryParameters);
      console.log(`Item added to cart for ${user_id}`);
    } catch (error) {
      console.log(`Cart error, item not added: ${error.name} - ${error.message}`);
      throw error;
    }
};

exports.deleteFromCart = async (user_id, product_id) => {
    try {
      const queryString = 'DELETE FROM cart_products WHERE user_id = $1 AND product_id = $2';
      const queryParameters = [user_id, product_id];
      await pool.query(queryString, queryParameters);
      console.log(`Item deleted from cart.`);
    } catch (error) {
         console.error(`Cart error, item not deleted: ${error.name} - ${error.message}`);
      throw error;  
    }
};

