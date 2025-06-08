const { Client } = require("pg");

class Product {
  constructor(id, name, price, quantity) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.quantity = quantity;
  }

<<<<<<< HEAD
<<<<<<< HEAD
  static async addProduct(client, name, price, quantity, inStock) {
=======
  static async addProduct(client, name, price, quantity) {
>>>>>>> products
=======
  static async addProduct(client, name, price, quantity) {
>>>>>>> users
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

<<<<<<< HEAD
  static async deleteProduct(client, id) {
    try {
      const deletedProduct = await client.query(
        'DELETE FROM products WHERE id = $1 RETURNING *',
        [id]
      );

      if (deletedProduct.rows.length === 0) {
        console.log(`No product found with ID: ${id}`);
        return null;
=======
  
  static async deleteProduct(client, name) {
    try {
      await client.query('DELETE FROM products WHERE product_name = $1', [name]);
    } catch (error) {
      console.log(`There was an error delete ${name} from the database.`);
      throw error;
    }
  }

  static async changeProductName(client, product_name, newName) {
    try {
      let queryString = 'UPDATE products SET product_name = $2 WHERE product_name = $1';
      let queryParams = [product_name, newName];
      await client.query(queryString, queryParams);
    } catch (error) {
      console.log(`Product name not changed. ${error.name}: ${error.message}`);
      throw error;
    }
  }

  static async changePrice(client, product_name, newPrice) {
    try {
      let queryString = 'UPDATE products SET price = $2 WHERE product_name = $1';
      let queryParams = [product_name, newPrice];
      await client.query(queryString, queryParams);
    } catch (error) {
      console.log(`Price was not changed. ${error.name}: ${error.message}`);
      throw error;
    }
  }

  static async changeQuantity(client, product_name, newQuantity) {
    try {
      let queryString = 'UPDATE products SET quantity = $2 WHERE product_name = $1';
      let queryParams = [product_name, newQuantity];
      await client.query(queryString, queryParams);
    } catch (error) {
      console.log(`Quantity not changed. ${error.name}: ${error.message}`);
      throw error;
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
      throw error;
    }
  }
  
  static async isInStock(client, product_name) {
    try {
      let queryString = 'SELECT quantity FROM products WHERE product_name = $1';
      let queryParameters = [product_name];
      let res = await client.query(queryString, queryParameters);
      if (res.rows[0].quantity > 0) {
        return true;
      } else {
        return false;
>>>>>>> users
      }

      console.log(`${deletedProduct.rows[0].product_name} has been deleted from the database.`);
    } catch (error) {
<<<<<<< HEAD
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
=======
>>>>>>> users
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
    const queryString = 'SELECT * FROM products';
    const res = await client.query(queryString);

    if (res.rows.length > 0) {
      return res.rows.map(row => ({
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
