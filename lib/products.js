const { Client } = require("pg");

class Product {
  constructor(id, name, price, quantity) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.quantity = quantity;
  }

  static async addProduct(client, name, price, quantity) {
    try {
      const result = await client.query(
        'INSERT INTO products (product_name, price, quantity) VALUES ($1, $2, $3) RETURNING *',
        [name, price, quantity]
      );

      if (result.rows.length === 0) {
        console.log(`No product was added.`);
        return null;
      } else {
        console.log(`${result.rows[0].product_name} was added to the inventory`);
      }

      const row = result.rows[0];
      return new Product(row.id, row.product_name, row.price, row.quantity);
    } catch (error) {
      console.log(`There was an error add ${name}`);
      throw error;
    }
  }

  static async deleteProduct(client, id) {
    try {
      const deletedProduct = await client.query(
        'DELETE FROM products WHERE id = $1 RETURNING *',
        [id]
      );

      if (deletedProduct.rows.length === 0) {
        console.log(`No product found with ID: ${id}`);
        return null;
      }

      console.log(`${deletedProduct.rows[0].product_name} has been deleted from the database.`);
    } catch (error) {
      console.log(`There was an error deleting product with ID ${id} from the database.`);
      throw error;
    }
  }

  static async changeProductName(client, id, newName) {
    try {
      const result = await client.query(
        'UPDATE products SET product_name = $2 WHERE id = $1 RETURNING product_name',
        [id, newName]
      );

      if (result.rows.length === 0) {
        console.log(`Product name was not changed in the database.`);
      } else {
        console.log(`The product name was changed to "${newName}".`);
      }

      return result.rows[0]?.product_name ?? null;
    } catch (error) {
      console.log(`Product name not changed. ${error.name}: ${error.message}`);
      throw error;
    }
  }

  static async changePrice(client, id, newPrice) {
    try {
      await client.query('UPDATE products SET price = $2 WHERE id = $1', [id, newPrice]);
    } catch (error) {
      console.log(`Price was not changed. ${error.name}: ${error.message}`);
      throw error;
    }
  }

  static async changeQuantity(client, id, newQuantity) {
    try {
      await client.query('UPDATE products SET quantity = $2 WHERE id = $1', [id, newQuantity]);
    } catch (error) {
      console.log(`Quantity not changed. ${error.name}: ${error.message}`);
      throw error;
    }
  }

  static async amountInStock(client, id) {
    try {
      const res = await client.query('SELECT quantity FROM products WHERE id = $1', [id]);
      return res.rows[0]?.quantity ?? null;
    } catch (error) {
      console.log(`There was an error displaying the quantity in stock.`);
      throw error;
    }
  }

  static async isInStock(client, id) {
    try {
      const res = await client.query('SELECT quantity FROM products WHERE id = $1', [id]);
      return res.rows[0]?.quantity > 0;
    } catch (error) {
      console.log(`Cannot check if product is in stock. ${error.name}, ${error.message}`);
      throw error;
    }
  }

  static async productsInStock(client) {
    try {
      const res = await client.query('SELECT id, product_name FROM products WHERE quantity > 0');
      if (res.rowCount > 0) {
        return res.rows;
      } else {
        return 'no products are currently in stock';
      }
    } catch (error) {
      console.log(`Cannot check if product is in stock. ${error.name}, ${error.message}`);
      throw error;
    }
  }

  static async getProductById(client, id) {
    try {
      const result = await client.query('SELECT * FROM products WHERE id = $1', [id]);
      if (result.rows.length === 0) return null;
      const row = result.rows[0];
      return new Product(row.id, row.product_name, row.price, row.quantity);
    } catch (error) {
      console.log(`Error fetching product by ID. ${error.name}: ${error.message}`);
      throw error;
    }
  }

}

module.exports = Product;
