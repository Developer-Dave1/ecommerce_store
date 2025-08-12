const { Client } = require('pg');
const config = require('./config');

const isHeroku = config.DATABASE_URL && config.DATABASE_URL.includes('heroku');

const client = new Client({
  connectionString: config.DATABASE_URL,
  ssl: isHeroku ? { rejectUnauthorized: false } : false,
});

client.connect()
  .then(() => console.log("PostgreSQL connected"))
  .catch(err => console.error("DB Connection Error:", err.message));

module.exports = client;
