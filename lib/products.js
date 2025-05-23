const { Client } = require("pg");

class Product {
  constructor(name, price, quantity, inStock) {
    this.name = name;
    this.price = price;
    this.quantity = quantity;
    this.inStock = inStock;
  }

  static async addProduct(name, price, quantity, inStock, client) {
    try {
      const result = await client.query(
      'INSERT INTO products (product_name, price, quantity, in_stock) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, price, quantity, inStock]
      );

    const row = result.rows[0];
    return new Product(row.product_name, row.price, row.quantity, row.in_stock);
    } catch (error) {
      console.log(`There was an error add ${name}`);
    }
  }

  
  static async deleteProduct(name, client) {
    try {
      await client.query('DELETE FROM products WHERE product_name = $1', [name]);
    } catch (error) {
      console.log(`There was an error delete ${name} from the database.`)
    }
  }

  static async amountInStock(client, product_name) {
    try {
      let queryString = 'SELECT quantity FROM products WHERE product_name = $1';
      let queryParameters = [product_name];
      let res = await client.query(queryString, queryParameters);
      return res.rows[0].quantity;
    } catch (error) {
      console.log(`There was an error displaying all products`);
    }
  }
  
  static async inStock(client, product_name) {
    try {
      let queryString = 'SELECT quantity FROM products WHERE product_name = $1';
      let queryParameters = [product_name];
      let res = await client.query(queryString, queryParameters);
      if (res.rows[0].quantity > 0) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log(`${error.name}, ${error.message}`);
    }
  }

   static async changeQuantity(client, product_name, newQuantity) {
    try {
      let queryString = 'UPDATE products SET quantity = $2 WHERE product_name = $1';
      let queryParams = [product_name, newQuantity];
      await client.query(queryString, queryParams);
    } catch (error) {
      console.log(`${error.name}: ${error.message}`);
    }
  }

  static async changePrice(client, product_name, newPrice) {
    try {
      let queryString = 'UPDATE products SET price = $2 WHERE product_name = $1';
      let queryParams = [product_name, newPrice];
      await client.query(queryString, queryParams);
    } catch (error) {
      console.log(`${error.name}: ${error.message}`);
    }
  }

  static async changeProductName(client, product_name, newName) {
    try {
      let queryString = 'UPDATE products SET product_name = $2 WHERE product_name = $1';
      let queryParams = [product_name, newName];
      await client.query(queryString, queryParams);
    } catch (error) {
      console.log(`${error.name}: ${error.message}`);
    }
  }

  // get rid of this.inStock in constructor and throughout products.js. We have
  // a method "inStock" that determines if the product is available or not.

}




module.exports = Product;
