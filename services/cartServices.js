const CartModels = require('../models/cartModels');
const ProductModels = require('../models/productModels');


exports.addToCart = async (client, user_id, product_id) => {
    try {
      const product = await ProductModels.getProductByID(client, product_id);
    if (!product) {
        throw new Error(`Product with ID ${product_id} does not exist.`);
    }

    if (product.quantity < 1) {
        throw new Error(`Product ${product.product_name} is out of stock.`);
    }

    return await CartModels.addToCart(client, user_id, product_id);
    } catch (error) {
        console.error(`There was an error adding item to cart.`);
        console.error(`${error.name} - ${error.message}`);
        throw error;
    }

};


exports.deleteFromCart = async (client, user_id, product_id) => {
    try {
      const product = await ProductModels.getProductByID(client, product_id);
    console.log(`Item deleted from cart.`);
    if (!product) {
        throw new Error(`Product with ID ${product_id} does not exist.`);
    }
    return await CartModels.deleteFromCart(client, user_id, product_id);
    } catch (error) {
        console.error(`There was an error deleting the item in your cart.`);
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

