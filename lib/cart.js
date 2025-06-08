const { Client } = require("pg");

class Cart {
    constructor(userId, product_name) {
        this.userId = userId;
        this.product_name = product_name;
    }

  static async addProductToCart(client, user_id, product_id, quantity) {
  try {
    let queryString = 'INSERT INTO cart_products (user_id, product_id, quantity) VALUES ($1, $2, $3)';
    let queryParameters = [user_id, product_id, quantity];
    await client.query(queryString, queryParameters);
    console.log(`Item added to cart.`);
  } catch (error) {
      console.error(`Cart error, item not addded: ${error.name} - ${error.message}`);
      throw error; 
  }
 }

 static async deleteProductInCart(client, user_id, product_id) {
  try {
    let queryString = 'DELETE FROM cart_products WHERE user_id = $1 AND product_id = $2';
    let queryParameters = [user_id, product_id];
    await client.query(queryString, queryParameters);
    console.log(`Item deleted from cart.`);
  } catch (error) {
      console.error(`Cart error, item not deleted: ${error.name} - ${error.message}`);
      throw error; 
  }
 }

 static async getCartContents(client, user_id) {
  try {
    const query = `
      SELECT 
        p.product_name,
        p.price,
        c.quantity,
        (p.price * c.quantity) AS total
      FROM cart_products c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = $1
    `;
    const result = await client.query(query, [user_id]);
    return result.rows;
  } catch (error) {
    console.error(`Could not retrieve cart contents: ${error.name} - ${error.message}`);
    throw error;
  }
}

static async updateCartQuantity(client, user_id, product_id, newQuantity) {
  try {
    const queryString = `
      UPDATE cart_products
      SET quantity = $3
      WHERE user_id = $1 AND product_id = $2
    `;
    await client.query(queryString, [user_id, product_id, newQuantity]);
    console.log(`Cart updated: user ${user_id}, product ${product_id} set to quantity ${newQuantity}`);
  } catch (error) {
    console.error(`Could not update cart quantity: ${error.name} - ${error.message}`);
    throw error;
  }
}


   
}

module.exports = Cart;
