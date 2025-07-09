const bcrypt = require('bcrypt');

exports.createUser = async (client, username, hashedPassword) => {
  const result = await client.query(
    'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *',
    [username, hashedPassword]
  );
  console.log(`User ${username} saved to database.`);
  return result.rows[0];
};

exports.findUserByUsername = async (client, username) => {
  const result = await client.query(
    'SELECT * FROM users WHERE username = $1',
    [username]
  );
  return result.rows[0];
};

exports.userExists = async (client, username) => {
    const result = await client.query('SELECT * FROM users WHERE username = $1', [username]);
    return result.rows[0];
}