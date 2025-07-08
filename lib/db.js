const { Client } = require('pg');
const client = new Client({
  database: 'ecommerce_test',
});
client.connect();
module.exports = { client };
