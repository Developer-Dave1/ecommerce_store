const { Pool } = require('pg');
const config = require('./config');

const client = new Pool(config.database);

client.query('SELECT NOW()')
  .then(() => console.log(`PostgreSQL connected to ${config.database.database}`))
  .catch(err => {
    console.error('DB Connection Error:', err.message);
    process.exitCode = 1;
  });

module.exports = client;