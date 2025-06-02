const { Client } = require('pg');
const User = require('../lib/users.js');
const Product = require('../lib/products.js');


let client;

beforeAll(async () => {
  client = new Client({
    database: 'ecommerce',
  });
  await client.connect();
});


afterAll(async () => {
  await client.end();
});

test('add user to database', async () => {
  // Clear database and start from scratch
  await client.query('TRUNCATE products, cart, users RESTART IDENTITY CASCADE');

  // Add user
  const user = await User.addUser(client, 'steve', 'stevespassword');

 // Check to see if user is in db
 let res = await client.query('SELECT * FROM users WHERE id = 1');
 console.log(res);
  expect(res.rows[0].id).toBe(1);
});


test('delete user from database', async () => {
  // Clear database
  await client.query('TRUNCATE products, cart, users RESTART IDENTITY CASCADE');

  // Add a user 
  await User.addUser(client, 'username', 'password');

  // Delete the user
  await User.deleteUser(client, 'username');
  const res = await client.query('SELECT * FROM users WHERE username = $1', ['username']);
  expect(res.rows.length).toBe(0);
});