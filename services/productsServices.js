const ProductModel = require('../models/productModels');

exports.validNameLength = (product_name) => {
  if (product_name.length > 50) {
    throw new Error(`Product name is too long. Maximum 50 characters.`);
  } else if (product_name.length < 3) {
    throw new Error(`Product name is too short. Minimum 3 characters.`);
  }
};

exports.createProduct = async (client, product_name, price, quantity) => {
  exports.validNameLength(product_name);

  const doesNotExist = await ProductModel.productDoesntExist(client, product_name);
  if (!doesNotExist) {
    throw new Error(`A product with the name "${product_name}" already exists.`);
  }

  if (price <= 0 || quantity <= 0) {
    throw new Error(`Price and quantity values must be greater than 0.`);
  }

  return await ProductModel.addProduct(client, product_name, price, quantity);
};


exports.deleteProduct = async (client, productID) => {
  const product = await ProductModel.getProductByID(client, productID);
  if (!product) {
    throw new Error(`Product with ID ${productID} does not exist.`);
  }
  return ProductModel.deleteProduct(client, productID);
};


exports.renameProduct = async (client, productID, newName) => {
  const doesNotExist = await ProductModel.productDoesntExist(client, newName);
  if (!doesNotExist) {
    throw new Error(`A product with the name "${newName}" already exists.`);
  }

  exports.validNameLength(newName);

  return await ProductModel.changeProductName(client, productID, newName);
}

exports.changePrice = async (client, productID, newPrice) => {
  if (newPrice <= 0) {
    throw new Error('New price must be greater than 0.');
  }

  const product = await ProductModel.getProductByID(client, productID);
  if (!product) {
    throw new Error(`Product with ID ${productID} does not exist.`);
  }

  return ProductModel.changePrice(client, productID, newPrice);
};


exports.changeQuantity = async (client, productID, newQuantity) => {
  if (newQuantity < 0) {
    throw new Error(`The new quantity must be equal to or greater than 0.`);
  }

  const product = await ProductModel.getProductByID(client, productID);
  if (!product) {
    throw new Error(`Product with ID ${productID} does not exist.`);
  }

  return ProductModel.changeQuantity(client, productID, newQuantity);
};


exports.amountInStock = async (client, productID) => {
    return await ProductModel.amountInStock(client, productID)
}

exports.getProductName = async (client, productID) => {
    return await ProductModel.getProductName(client, productID);
}

exports.getAllProducts = async (client) => {
    return await ProductModel.getAllProducts(client);
}
