const pool = require('../lib/db');

exports.addProduct = async (productName, price, quantity) => {
  try {
    const queryString = 'INSERT INTO products (product_name, price, quantity) VALUES ($1, $2, $3) RETURNING *';
    const queryParameters = [productName, price, quantity];
    const databaseQuery = await pool.query(queryString, queryParameters);
    console.log(`${productName} has been added into the system.`);
    return databaseQuery.rows[0];
  } catch (error) {
    console.error(`There was an error adding the product ${productName}.`);
    console.error(`${error.name} - ${error.message}`);
    throw error;
  }
};

exports.deleteProduct = async (productID) => {
  try {
   const nameQuery = await pool.query(`SELECT product_name FROM products WHERE id = $1`, [productID]);
   const productName = nameQuery.rows[0].product_name;
   const databaseQuery = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [productID]);

   
   if (databaseQuery.rowCount === 0) {
      console.warn(`Product ${productName} not found. Nothing has been deleted.`);
      return null;
    } else {
      console.log(`Product ${productName} was deleted from the system.`);
      return databaseQuery.rows[0];  
    }

  } catch (error) {
    console.error(`There was an error deleting ${productName} from the system.`);
    console.error(`${error.name} - ${error.message}`);
    throw error;
  }
};

exports.changeProductName = async (productID, newName) => {
  try {
    const nameQuery = await pool.query(`SELECT product_name FROM products WHERE id = $1`, [productID]);
    if (nameQuery.rowCount === 0) {
      console.warn(`No product found with the ID ${productID}`);
      return null;
    }

    const originalName = nameQuery.rows[0].product_name;

    const resultUpdate = await pool.query(
      'UPDATE products SET product_name = $1 WHERE id = $2 RETURNING *',
      [newName, productID]
    );

    console.log(`"${originalName}" has been renamed to "${newName}".`);
    return resultUpdate.rows[0];
  } catch (error) {
    console.error(`Could not change the name of ${originalName} with ID ${productID}.`);
    console.error(`${error.name} - ${error.message}`);
    throw error;
  }
};

exports.changePrice = async (productID, newPrice) => {
  try {
    const initialProductQuery = await pool.query(
      'SELECT price, product_name FROM products WHERE id = $1',
      [productID]
    );

    if (initialProductQuery.rowCount === 0) {
      console.warn(`No product found with ID ${productID}`);
      return null;
    }

    const { price: initialProductPrice, product_name: productName } = initialProductQuery.rows[0];

    const databaseQuery = await pool.query(
      'UPDATE products SET price = $1 WHERE id = $2 RETURNING *',
      [newPrice, productID]
    );

    console.log(`${productName} price has been changed from ${initialProductPrice} to ${newPrice}.`);
    return databaseQuery.rows[0];
  } catch (error) {
    console.error(`There was an error changing the price for product ID ${productID}.`);
    console.error(`${error.name} - ${error.message}`);
    throw error;
  }
};


exports.changeQuantity = async (productID, newQuantity) => {
  try {
    const initialProductQuery = await pool.query(
      'SELECT product_name, quantity FROM products WHERE id = $1',
      [productID]
    );

    if (initialProductQuery.rowCount === 0) {
      console.warn(`No product found with ID ${productID}`);
      return null;
    }

    const oldQuantity = initialProductQuery.rows[0].quantity;
    const productName = initialProductQuery.rows[0].product_name;

    const databaseQuery = await pool.query(
      'UPDATE products SET quantity = $1 WHERE id = $2 RETURNING *',
      [newQuantity, productID]
    );

    console.log(`The quantity of ${productName} has been changed from ${oldQuantity} to ${newQuantity}.`);
    return databaseQuery.rows[0];
  } catch (error) {
    console.error(`There was an error changing the quantity.`);
    console.error(`Error updating quantity: ${error.name} - ${error.message}`);
    throw error;
  }
};


exports.amountInStock = async (product_id) => {
  try {
    const databaseQuery = await pool.query(
      'SELECT product_name, quantity FROM products WHERE id = $1',
      [product_id]
    );

    if (databaseQuery.rowCount === 0) {
      console.warn(`No product found with ID ${product_id}`);
      return null;
    }

    const productName = databaseQuery.rows[0].product_name;
    const quantity = databaseQuery.rows[0].quantity;

    console.log(`${productName} (ID ${product_id}) has ${quantity} in stock.`);
    return quantity;
  } catch (error) {
    console.error(`There was an error retrieving the product quantity for ID: ${product_id}.`);
    console.error(`${error.name} - ${error.message}`);
    throw error;
  }
};


exports.getProductName = async (product_id) => {
  try {
    const databaseQuery = await pool.query('SELECT product_name FROM products WHERE id = $1', [product_id]);

    if (databaseQuery.rowCount === 0) {
      console.warn(`No product found with ID ${product_id}`);
      return null;
    }

    return databaseQuery.rows[0].product_name;

  } catch (error) {
    console.error(`There was an error getting the product name for the product id: ${product_id}`);
    console.error(`${error.name} - ${error.message}`);
    throw error;
  }
}

exports.isInStock = async (product_id) => {
  try {
    const databaseQuery = await pool.query(
      'SELECT product_name, quantity FROM products WHERE id = $1',
      [product_id]
    );

    if (databaseQuery.rowCount === 0) {
      console.warn(`There are no products with ID: ${product_id}`);
      return null;
    }

    return databaseQuery.rows[0].quantity > 0;
  } catch (error) {
    console.log(`There was an error checking if product ID: ${product_id} is in stock.`);
    console.log(`${error.name} - ${error.message}`);
    throw error;
  }
};


exports.productsInStock = async () => {
  try {
    const databaseQuery = await pool.query('SELECT * FROM products WHERE quantity > 0');

    if (databaseQuery.rowCount === 0) {
    console.warn(`There are no products in stock.`);
    return [];
    }

    const productsCurrentlyInStock = databaseQuery.rows.map(product => product.product_name);
    console.log(`These are the products currently in stock:`);
    productsCurrentlyInStock.forEach(product => console.log(product));
    return productsCurrentlyInStock;

  } catch (error) {
    console.error(`There was an error finding products in stock`);
    console.error(`${error.name} - ${error.message}`);
    throw error;
  }
}

exports.getProductByID = async (product_id) => {
  try {
    const databaseQuery = await pool.query('SELECT * FROM products WHERE id = $1', [product_id]);

    if (databaseQuery.rowCount === 0) {
      console.warn(`There are no products with the ID: ${product_id}`);
      return null;
    }

    return databaseQuery.rows[0];

  } catch (error) {
    console.error(`There was an error looking for a product with the ID: ${product_id}`);
    console.error(`${error.name} - ${error.message}`);
    throw error;
  }
}

exports.getAllProducts = async () => {
  try {
    const databaseQuery = await pool.query('SELECT * FROM products ORDER BY product_name ASC');
    if (databaseQuery.rowCount === 0) {
      console.warn(`There are no products in the store.`);
      return [];
    }

    return databaseQuery.rows;

  } catch (error) {
    console.error(`There was an error retrieving all the products.`);
    console.error(`${error.name} -  ${error.message}`);
    throw error;
  }
}

