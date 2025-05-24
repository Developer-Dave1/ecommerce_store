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
      console.error(`Cart error: ${error.name} - ${error.message}`);
      throw error; 
  }
 }

}

module.exports = User;
// will need to add password hashing