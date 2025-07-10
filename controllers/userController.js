const bcrypt = require('bcrypt');
const UserServices = require('../services/userServices.js');
const { client } = require('../lib/db');

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {

    const user = await UserServices.findUserByUsername(client, username);
   
    if (!user) {
      return res.status(401).send('Invalid username or password.');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
  

    if (!passwordMatch) {
      return res.status(401).send('Invalid username or password.');
    }

    req.session.user_id = user.id;
    req.session.username = user.username;
    res.render('welcome', { username: user.username });
  } catch (error) {
    console.error(`Login error: ${error.name} - ${error.message}`);
    res.status(500).send('Failed to log in.');
  }
};

exports.renderLoginPage = async (req, res) => {
  try {
    res.render('login');
  } catch (error) {
    console.error(`Error rendering login page: ${error.name} - ${error.message}`);
    res.status(500).send('Failed to load login page.');
  }
};

exports.renderSignupPage = async (req, res) => {
  try {
    res.render('signup');
  } catch (error) {
    console.error(`Error rendering signup page: ${error.name} - ${error.message}`);
    res.status(500).send('Failed to load login page.');
  }
};

exports.createUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await UserServices.findUserByUsername(client, username);
    if (existingUser) {
      return res.status(400).send('This username already exists.');
    }

    const newUser = await UserServices.createUser(client, username, password);

    req.session.user_id = newUser.id;
    req.session.username = newUser.username;

    console.log(`Successfully created user ${username}`);
    res.render('welcome', { username: newUser.username });
  } catch (error) {
    console.error(`There was an error creating a new user.`);
    console.error(`${error.name} - ${error.message}`);
    res.status(500).send('Failed to create user.');
  }
};

exports.logout = (req, res) => {
  try {
    req.session.destroy(err => {
      if (err) {
        console.error(`Error destroying session: ${err}`);
        return res.status(500).send('Could not log out.');
      }
      res.redirect('/'); 
    });
  } catch (error) {
    console.error(`Logout error: ${error.name} - ${error.message}`);
    res.status(500).send('Failed to log out.');
  }
};

