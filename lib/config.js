require("dotenv").config();

module.exports = {
  PORT: process.env.PORT || 3000,
  SECRET: process.env.SECRET,
  DATABASE_URL: process.env.DATABASE_URL,
  NODE_ENV: process.env.NODE_ENV
};
