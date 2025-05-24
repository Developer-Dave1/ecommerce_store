const { Client } = require("pg");

class User {
    constructor (username, password) {
    this.username = username;
    this.password = password;
    }

static async addUser(client, username, password) {
  try {
    const queryString = 'INSERT INTO users (username, password) VALUES ($1, $2)';
    const queryParamaters = [username, password];
    await client.query(queryString, queryParamaters);
    console.log(`${username} has been added.`);
    return new User(username, password);
  } catch (error) {
    console.log(`User could not be added. ${error.name}: ${error.message}`);
    throw error;
  }
}

static async addProductToCart(client, user_id, product_id, quantity) {
  try {
    let queryString = 'INSERT INTO cart (user_id, product_id, quantity) VALUES ($1, $2, $3)';
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
    let queryString = 'DELETE FROM cart WHERE user_id = $1 AND product_id = $2';
    let queryParameters = [user_id, product_id];
    await client.query(queryString, queryParameters);
    console.log(`Item deleted from cart.`);
  } catch (error) {
      console.error(`Cart error, item not deleted: ${error.name} - ${error.message}`);
      throw error; 
  }
 }

}

module.exports = User;
// will need to add password hashing