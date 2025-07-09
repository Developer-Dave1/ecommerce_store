const UserModels = require('../models/userModels.js');
const bcrypt = require('bcrypt');

exports.createUser = async(client, username, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await UserModels.createUser(client, username, hashedPassword);
    return newUser;
};

exports.userExists = async(client, username) => {
    const result = await UserModels.userExists(client, username);
    if (result.rowCount === 0) {
        return false;
    }

    return true;
}

exports.findUserByUsername = async (client, username) => {
  const result = await UserModels.findUserByUsername(client, username);
  return result;
};