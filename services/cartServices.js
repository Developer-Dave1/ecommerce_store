const CartModels = require('../models/cartModels');
const ProductModels = require('../models/productModels');


exports.addToCart = async (client, user_id, product_id) => {
    const product = await ProductModels.getProductByID(client, product_id);
    if (!product) {
        throw new Error(`Product with ID ${product_id} does not exist.`);
    }

    if (product.quantity < 1) {
        throw new Error(`Product ${product.product_name} is out of stock.`);
    }

    return await CartModels.addToCart(client, user_id, product_id);
};

exports.deleteFromCart = async (client, user_id, product_id) => {
    const product = await ProductModels.getProductByID(client, product_id);
    if (!product) {
        throw new Error(`Product with ID ${product_id} does not exist.`);
    }
    return await CartModels.deleteFromCart(client, user_id, product_id);
};
