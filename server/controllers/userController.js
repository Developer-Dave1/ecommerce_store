const bcrypt = require('bcrypt');
const UserServices = require('../services/userServices.js');
const client = require('../lib/client');

async function establishSession(req, user) {
  await new Promise((resolve, reject) => {
    req.session.regenerate(error => error ? reject(error) : resolve());
  });

  req.session.user_id = user.id;
  req.session.username = user.username;
  req.session.isAdmin = user.is_admin;

  await new Promise((resolve, reject) => {
    req.session.save(error => error ? reject(error) : resolve());
  });
}

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await UserServices.findUserByUsername(client, username);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid username or password.' });
    }

    await establishSession(req, user);
    return res.status(200).json({ message: 'Login successful.', isAdmin: user.is_admin});
  } catch (error) {
    console.error(`Login error: ${error.name} - ${error.message}`);
    return res.status(500).json({ error: 'Failed to log in.' });
  }
};

exports.createUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await UserServices.findUserByUsername(client, username);
    if (existingUser) {
      return res.status(400).json({ error: 'This username already exists.' });
    }

    const newUser = await UserServices.createUser(client, username, password);
    await establishSession(req, newUser);
    return res.status(201).json({ message: 'Account created successfully.' });
  } catch (error) {
    console.error(`Error creating a new user: ${error.name} - ${error.message}`);
    return res.status(500).json({ error: 'Failed to create user.' });
  }
};

exports.logout = async (req, res) => {
  try {
    await new Promise((resolve, reject) => {
      req.session.destroy(error => error ? reject(error) : resolve());
    });
    res.clearCookie('connect.sid', { path: '/' });
    return res.status(200).json({ message: 'Logout successful.' });
  } catch (error) {
    console.error(`Logout error: ${error.name} - ${error.message}`);
    return res.status(500).json({ error: 'Failed to log out.' });
  }
};
