const { Client } = require("pg");

class User {
    constructor (username, password) {
    this.username = username;
    this.password = password;
    }

static async addUser(client, username, password) {
  try {
    const queryString = 'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id';
    const queryParamaters = [username, password];
    const res = await client.query(queryString, queryParamaters);
    const id = res.rows[0].id;
    console.log(`${username} has been added with the ID ${id}.`);
    return id;
  } catch (error) {
    console.log(`User could not be added. ${error.name}: ${error.message}`);
    throw error;
  }
}

static async deleteUser(client, username) {
  try {
    const queryString = 'DELETE FROM users WHERE username = $1 RETURNING *';
    const queryParameters = [username];
    const res = await client.query(queryString, queryParameters);

    if (res.rowCount === 0) {
      console.log(`No user found with username: ${username}`);
      return null;
    } else {
      const deletedUser = res.rows[0];
      console.log(`User ${deletedUser.username} (ID: ${deletedUser.id}) has been deleted.`);
      return deletedUser;
    }
  } catch (error) {
    console.error(`User could not be deleted. ${error.name}: ${error.message}`);
    throw error;
  }
}


}

module.exports = User;
// will need to add password hashing