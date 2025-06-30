const { Pool } = require('pg');

const pool = new Pool({
  database: 'ecommerce_test', // or 'ecommerce'
});

module.exports = pool;
