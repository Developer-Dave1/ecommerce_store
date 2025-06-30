exports.addProduct = async (client, productName, price, quantity) => {
  try {
    const query = 'INSERT INTO products (product_name, price, quantity) VALUES ($1, $2, $3) RETURNING *';
    const params = [productName, price, quantity];
    const result = await client.query(query, params);
    console.log(`${productName} has been added into the system.`);
    return result.rows[0];
  } catch (error) {
    console.error(`Error adding product ${productName}. ${error.name} - ${error.message}`);
    throw error;
  }
};

exports.deleteProduct = async (client, productID) => {
  try {
    const nameQuery = await client.query(`SELECT product_name FROM products WHERE id = $1`, [productID]);
    const productName = nameQuery.rows[0]?.product_name;

    const result = await client.query('DELETE FROM products WHERE id = $1 RETURNING *', [productID]);

    if (result.rowCount === 0) {
      console.warn(`Product ${productName} not found. Nothing deleted.`);
      return null;
    }
    console.log(`Product ${productName} was deleted.`);
    return result.rows[0];
  } catch (error) {
    console.error(`Error deleting product ID ${productID}. ${error.name} - ${error.message}`);
    throw error;
  }
};

exports.changeProductName = async (client, productID, newName) => {
  try {
    const nameQuery = await client.query(`SELECT product_name FROM products WHERE id = $1`, [productID]);
    if (nameQuery.rowCount === 0) {
      console.warn(`No product found with ID ${productID}`);
      return null;
    }

    const originalName = nameQuery.rows[0].product_name;

    const result = await client.query(
      'UPDATE products SET product_name = $1 WHERE id = $2 RETURNING *',
      [newName, productID]
    );

    console.log(`"${originalName}" has been renamed to "${newName}".`);
    return result.rows[0];
  } catch (error) {
    console.error(`Error renaming product ID ${productID}. ${error.name} - ${error.message}`);
    throw error;
  }
};

exports.changePrice = async (client, productID, newPrice) => {
  try {
    const productQuery = await client.query(
      'SELECT price, product_name FROM products WHERE id = $1',
      [productID]
    );

    if (productQuery.rowCount === 0) {
      console.warn(`No product found with ID ${productID}`);
      return null;
    }

    const { price: oldPrice, product_name: productName } = productQuery.rows[0];

    const result = await client.query(
      'UPDATE products SET price = $1 WHERE id = $2 RETURNING *',
      [newPrice, productID]
    );

    console.log(`${productName} price changed from ${oldPrice} to ${newPrice}.`);
    return result.rows[0];
  } catch (error) {
    console.error(`Error changing price for product ID ${productID}. ${error.name} - ${error.message}`);
    throw error;
  }
};

exports.changeQuantity = async (client, productID, newQuantity) => {
  try {
    const productQuery = await client.query(
      'SELECT product_name, quantity FROM products WHERE id = $1',
      [productID]
    );

    if (productQuery.rowCount === 0) {
      console.warn(`No product found with ID ${productID}`);
      return null;
    }

    const oldQuantity = productQuery.rows[0].quantity;
    const productName = productQuery.rows[0].product_name;

    const result = await client.query(
      'UPDATE products SET quantity = $1 WHERE id = $2 RETURNING *',
      [newQuantity, productID]
    );

    console.log(`Quantity of ${productName} changed from ${oldQuantity} to ${newQuantity}.`);
    return result.rows[0];
  } catch (error) {
    console.error(`Error changing quantity for product ID ${productID}. ${error.name} - ${error.message}`);
    throw error;
  }
};

exports.amountInStock = async (client, productID) => {
  try {
    const result = await client.query(
      'SELECT product_name, quantity FROM products WHERE id = $1',
      [productID]
    );

    if (result.rowCount === 0) {
      console.warn(`No product found with ID ${productID}`);
      return null;
    }

    const productName = result.rows[0].product_name;
    const quantity = result.rows[0].quantity;

    console.log(`${productName} (ID ${productID}) has ${quantity} in stock.`);
    return quantity;
  } catch (error) {
    console.error(`Error retrieving stock for product ID ${productID}. ${error.name} - ${error.message}`);
    throw error;
  }
};

exports.getProductName = async (client, productID) => {
  try {
    const result = await client.query('SELECT product_name FROM products WHERE id = $1', [productID]);

    if (result.rowCount === 0) {
      console.warn(`No product found with ID ${productID}`);
      return null;
    }

    return result.rows[0].product_name;
  } catch (error) {
    console.error(`Error getting name for product ID ${productID}. ${error.name} - ${error.message}`);
    throw error;
  }
};

exports.isInStock = async (client, productID) => {
  try {
    const result = await client.query(
      'SELECT quantity FROM products WHERE id = $1',
      [productID]
    );

    if (result.rowCount === 0) {
      console.warn(`No product found with ID ${productID}`);
      return null;
    }

    return result.rows[0].quantity > 0;
  } catch (error) {
    console.log(`Error checking stock for product ID ${productID}. ${error.name} - ${error.message}`);
    throw error;
  }
};

exports.productsInStock = async (client) => {
  try {
    const result = await client.query('SELECT * FROM products WHERE quantity > 0');

    if (result.rowCount === 0) {
      console.warn(`There are no products in stock.`);
      return [];
    }

    const names = result.rows.map(product => product.product_name);
    console.log(names);
    console.log(`Products in stock: ${names.join(', ')}`);
    return names;
  } catch (error) {
    console.error(`Error retrieving products in stock. ${error.name} - ${error.message}`);
    throw error;
  }
};

exports.getProductByID = async (client, productID) => {
  try {
    const result = await client.query('SELECT * FROM products WHERE id = $1', [productID]);

    if (result.rowCount === 0) {
      console.warn(`No product found with ID ${productID}`);
      return null;
    }

    return result.rows[0];
  } catch (error) {
    console.error(`Error fetching product by ID ${productID}. ${error.name} - ${error.message}`);
    throw error;
  }
};

exports.getAllProducts = async (client) => {
  try {
    const result = await client.query('SELECT * FROM products');

    if (result.rowCount === 0) {
      console.warn(`There are no products in the store.`);
      return [];
    }

    return result.rows;
  } catch (error) {
    console.error(`Error retrieving all products. ${error.name} - ${error.message}`);
    throw error;
  }
};
