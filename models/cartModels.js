exports.addToCart = async (client, user_id, product_id, quantityToAdd) => {
  try {
    const updateResult = await client.query(
      'UPDATE cart SET quantity = quantity + $1 WHERE user_id = $2 AND product_id = $3',
      [quantityToAdd, user_id, product_id]
    );

    if (updateResult.rowCount === 0) {
      await client.query(
        'INSERT INTO cart (user_id, product_id, quantity) VALUES ($1, $2, $3)',
        [user_id, product_id, quantityToAdd]
      );
    }

    console.log(`Added ${quantityToAdd} of product ${product_id} to cart for user ${user_id}`);
  } catch (error) {
    console.error(`Cart error: could not add to cart.`);
    console.error(`${error.name} - ${error.message}`);
    throw error;
  }
};


exports.deleteFromCart = async (client, user_id, product_id) => {
    try {
      const shopperId = user_id || 1;
      const queryString = 'DELETE FROM cart WHERE user_id = $1 AND product_id = $2';
      const queryParameters = [shopperId, product_id];
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
      ORDER BY products.product_name ASC;
    `;
    const queryParameters = [user_id];
    const result = await client.query(queryString, queryParameters);

  if (result.rowCount === 0) {
  return [];
}

    const productNames = result.rows.map(product => product.product_name).join(', ');
    console.log(`The following products are in the cart: ${productNames}`);

    return result.rows;
  } catch (error) {
    console.error(`Cart error: Could not retrieve products in cart. ${error.name} : ${error.message}`);
    throw error;
  }
};
