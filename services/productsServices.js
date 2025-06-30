const ProductModel = require('../models/productModels');

exports.createProduct = async (client, product_name, price, quantity) => {
 return await ProductModel.addProduct(client, product_name, price, quantity);
  
};

exports.deleteProduct = async (client, productID) => {
    return await ProductModel.deleteProduct(client, productID);
}

exports.renameProduct = async (client, productID, newName) => {
    if (!newName || newName.length < 2) {
    throw new Error('New product name must be at least 2 characters long');
  }
    return await ProductModel.changeProductName(client, productID, newName);
}

exports.changePrice = async (client, productID, newPrice) => {
    return await ProductModel.changePrice(client. productID, newPrice);
}

exports.changeQuantity = async (client, productID, newQuantity) => {
    return await ProductModel.changeQuantity(client, productID, newQuantity);
}

exports.amountInStock = async (client, productID) => {
    return await ProductModel.amountInStock(client, productID)
}

exports.getProductName = async (client, productID) => {
    return await ProductModel.getProductName(client, productID);
}

// need to add more business logic to these methods. use renameProduct as a starting
// places