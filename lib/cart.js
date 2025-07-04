const { Client } = require("pg");

class Cart {
    constructor(userId, product_name) {
        this.userId = userId;
        this.product_name = product_name;
    }

  static async addProductToCart(client, user_id, product_id) {
  try {
    let queryString = 'INSERT INTO cart_products (user_id, product_id) VALUES ($1, $2)';
    let queryParameters = [user_id, product_id];
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
    const queryString = `
      SELECT 
        c.product_id,
        p.product_name,
        p.price,
        c.quantity,
        (p.price * c.quantity) AS total
      FROM cart_products c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = $1
      ORDER BY c.quantity DESC;
    `;
    const result = await client.query(queryString, [user_id]);
    return result.rows.map(row => ({
      product_id: row.product_id,     
      product_name: row.product_name,
      price: parseFloat(row.price),
      quantity: row.quantity,
      total: parseFloat(row.total)
    }));
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
