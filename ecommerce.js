const { Client } = require("pg");
const express = require("express");
const app = express();
const host = "localhost";
const port = 3001;
const Product = require('./lib/products');


const client = new Client({
  database: 'ecommerce',
});

async function main() {
  try {
    await client.connect();

    let quantity = await Product.amountInStock(client, 'jersey');

  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.end();
  }
}

main();
