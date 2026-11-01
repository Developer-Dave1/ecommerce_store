const path = require('path');
const { randomBytes } = require('crypto');

require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const nodeEnv = process.env.NODE_ENV || 'development';

if (nodeEnv === 'production' && !process.env.SECRET) {
  throw new Error('Set SECRET before starting the server in production.');
}

module.exports = {
  PORT: process.env.PORT || 3000,
  HOST: process.env.HOST || 'localhost',
  // A temporary development secret signs users out after a server restart.
  SECRET: process.env.SECRET || randomBytes(32).toString('hex'),
  NODE_ENV: nodeEnv,
  database: {
    host: process.env.PGHOST || 'localhost',
    port: Number(process.env.PGPORT || 5432),
    database: process.env.PGDATABASE || 'ecommerce_test',
    // Without PGUSER/PGPASSWORD, pg uses the local user's connection defaults.
    user: process.env.PGUSER || undefined,
    password: process.env.PGPASSWORD || undefined,
    ssl: false,
    connectionTimeoutMillis: 5000,
  },
};
