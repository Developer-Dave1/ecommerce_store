exports.addToCart = async (client, user_id, product_id) => {
    try {
      const queryString = 'INSERT INTO cart (user_id, product_id) VALUES ($1, $2)';
      const queryParameters = [user_id, product_id];
      await client.query(queryString, queryParameters);
      console.log(`Item added to cart for ${user_id}`);
    } catch (error) {
      console.log(`Cart error, item not added: ${error.name} - ${error.message}`);
      throw error;
    }
};

exports.deleteFromCart = async (client, user_id, product_id) => {
    try {
      const queryString = 'DELETE FROM cart WHERE user_id = $1 AND product_id = $2';
      const queryParameters = [user_id, product_id];
      await client.query(queryString, queryParameters);
      console.log(`Item deleted from cart.`);
    } catch (error) {
         console.error(`Cart error, item not deleted: ${error.name} - ${error.message}`);
      throw error;  
    }
};

