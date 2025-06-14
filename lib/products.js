const { Client } = require("pg");

class Product {
  constructor(id, name, price, quantity) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.quantity = quantity;
  }

  static async addProduct(client, product_name, price, quantity, inStock) {
    try {
      const result = await client.query(
        'INSERT INTO products (product_name, price, quantity) VALUES ($1, $2, $3) RETURNING *',
        [product_name, price, quantity]
      );

      if (result.rows.length === 0) {
        console.log(`No product was added.`);
        return null;
      } else {
        console.log(`${result.rows[0].product_id} was added to the inventory`);
      }

      const row = result.rows[0];
      return new Product(row.id, row.product_name, row.price, row.quantity);
    } catch (error) {
      console.log(`There was an error add ${name}`);
      throw error;
    }
  }

  
  static async deleteProduct(client, product_id) {
    try {
      await client.query('DELETE FROM products WHERE id = $1', [name]);
    } catch (error) {
      console.log(`There was an error delete ${product_id} from the database.`);
      throw error;
    }
  }

  static async changeProductName(client, product_id, newName) {
    try {
      let queryString = 'UPDATE products SET product_name = $2 WHERE id = $1';
      let queryParams = [product_id, newName];
      await client.query(queryString, queryParams);
    } catch (error) {
      console.log(`Product name not changed. ${error.name}: ${error.message}`);
      throw error;
    }
  }

  static async changePrice(client, product_id, newPrice) {
    try {
      let queryString = 'UPDATE products SET price = $2 WHERE id = $1';
      let queryParams = [product_id, newPrice];
      await client.query(queryString, queryParams);
    } catch (error) {
      console.log(`Price was not changed. ${error.name}: ${error.message}`);
      throw error;
    }
  }

  static async changeQuantity(client, product_id, newQuantity) {
    try {
      let queryString = 'UPDATE products SET quantity = $2 WHERE id = $1';
      let queryParams = [product_id, newQuantity];
      await client.query(queryString, queryParams);
    } catch (error) {
      console.log(`Quantity not changed. ${error.name}: ${error.message}`);
      throw error;
    }
  }

  static async amountInStock(client, product_id) {
    try {
      let queryString = 'SELECT quantity FROM products WHERE id = $1';
      let queryParameters = [product_id];
      let res = await client.query(queryString, queryParameters);
      return res.rows[0].quantity;
    } catch (error) {
      console.log(`There was an error getting the amount of units in stock`);
      throw error;
    }
  }
  
  static async isInStock(client, product_id) {
    try {
      let queryString = 'SELECT quantity FROM products WHERE id = $1';
      let queryParameters = [product_id];
      let res = await client.query(queryString, queryParameters);
      if (res.rows[0].quantity > 0) {
        return true;
      } else {
        return false;
      }

      console.log(`${deletedProduct.rows[0].product_name} has been deleted from the database.`);
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

  static async getAllProducts(client) {
  try {
    const queryString = 'SELECT * FROM products ORDER BY quantity DESC';
    const res = await client.query(queryString);

    if (res.rows.length > 0) {
      return res.rows.map(row => ({
        id: row.id,
        name: row.product_name,
        price: parseFloat(row.price),
        quantity: row.quantity,
        inStock: row.in_stock
      }));
      
    } else {
      console.log('There are no products in store.');
      return [];
    }
  } catch (error) {
    console.log(`${error.name}, ${error.message}`);
    throw error;
  }
}


}

module.exports = Product;
