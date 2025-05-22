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

  static async createProductNameArray(client) {
    try {
      let res = await client.query('SELECT * FROM products');
      return res.rows.map(product => product.product_name);
    } catch (error) {
      console.log(`There was an error displaying all products`);
    }
  }

}




module.exports = Product;
