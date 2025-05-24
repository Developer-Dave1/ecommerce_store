const { Client } = require('pg');
const User = require('../lib/user.js');


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

test('add user to db', async () => {
  // Clear database and start from scratch
  await client.query('TRUNCATE products, cart, users RESTART IDENTITY CASCADE');

  // Add user
  const user = await User.addUser(client, 'steve', 'stevespassword');

 // Check to see if user is in db
 let res = await client.query('SELECT * FROM users WHERE id = 1');
  expect(res.rows[0].username).toBe('steve');
});
