const CartModels = require('../models/cartModels');
const ProductModels = require('../models/productModels');


exports.addToCart = async (client, user_id, product_id, quantity) => {
    try {
      const product = await ProductModels.getProductByID(client, product_id);
      const productQuantity = product.quantity;
    if (!product) {
        throw new Error(`Product with ID ${product_id} does not exist.`);
    }

    if (product.quantity < 1) {
        throw new Error(`Product ${product.product_name} is out of stock.`);
    }

    let result = await CartModels.addToCart(client, user_id, product_id, quantity);
    await ProductModels.changeQuantity(client, product_id, productQuantity - quantity);
    return result;
    } catch (error) {
        console.error(`There was an error adding item to cart using service module.`);
        console.error(`${error.name} - ${error.message}`);
        throw error;
    }

};



exports.allCartItems = async (client, user_id) => {
    try {
      const cartItems = await CartModels.allCartItems(client, user_id);
      return cartItems;
    } catch (error) {
        console.error(`There was an error retrieving products in the cart using cart services.`);
        console.error(`${error.name} - ${error.message}`);
        throw error;
    }
};


exports.deleteFromCart = async (client, user_id, product_id) => {
    try {
      const product = await ProductModels.getProductByID(client, product_id);
      const productQuantity = product.quantity;
      const currentCartQuantityQuery = await client.query('SELECT quantity FROM cart WHERE product_id = $1', [product_id]);
      const currentCartQuantity = currentCartQuantityQuery.rows[0].quantity;
    if (!product) {
        throw new Error(`Product with ID ${product_id} does not exist.`);
    }
    const deletedProduct = await CartModels.deleteFromCart(client, user_id, product.id);
    const updatedQuantity = await ProductModels.changeQuantity(client, product_id, productQuantity + currentCartQuantity);
    } catch (error) {
        console.error(`There was an error deleting the item in your cart.`);
        console.error(`${error.name} - ${error.message}`);
        throw error;
    }
    
};

exports.changeQuantity = async (client, user_id, product_id, newQuantity) => {
  let productName = '';
  try {
    const availableStock = await ProductModels.amountInStock(client, product_id);
    productName = await ProductModels.getProductName(client, product_id);

    if (newQuantity > availableStock) {
      throw new Error(`Cannot set quantity to ${newQuantity}. Only ${availableStock} available in stock.`);
    }

    await client.query(
      'UPDATE cart SET quantity = $1 WHERE user_id = $2 AND product_id = $3',
      [newQuantity, user_id, product_id]
    );

    console.log(`Cart updated: product ${productName} quantity set to ${newQuantity} for user ${user_id}.`);

    return newQuantity;
  } catch (error) {
    console.log(`Cart error: cannot update cart quantity for product ${productName}.`);
    throw error;
  }
};


