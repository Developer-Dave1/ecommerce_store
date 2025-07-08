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

exports.allCartItems = async (client, user_id) => {
  try {
    const queryString = `
      SELECT cart.*, products.product_name, products.price
      FROM cart
      JOIN products ON cart.product_id = products.id
      WHERE cart.user_id = $1
    `;
    const queryParameters = [user_id];
    const result = await client.query(queryString, queryParameters);

    const productNames = result.rows.map(product => product.product_name).join(', ');
    console.log(`The following products are in the cart: ${productNames}`);

    return result.rows;
  } catch (error) {
    console.error(`Cart error: Could not retrieve products in cart. ${error.name} : ${error.message}`);
    throw error;
  }
};
