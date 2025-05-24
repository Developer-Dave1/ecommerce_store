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
  }
}

static async addProductToCart(client, user_id, product_id) {
  try {
    let queryString = 'INSERT INTO cart (user_id, product_id) VALUES ($1, $2)';
    let queryParameters = [user_id, product_id];
    await client.query(queryString, queryParameters);
    console.log(`Item added to cart.`);
  } catch (error) {
      console.log(`There was an error. Your item was NOT added to cart.`);
  }
 }

}

module.exports = User;
// will need to test addUser
// will need to add password hashing