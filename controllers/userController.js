const bcrypt = require('bcrypt');
const UserServices = require('../services/userServices.js');
const client = require('../lib/client');


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
    req.flash('success', 'You are logged in.');
    res.redirect('/products');
  } catch (error) {
    console.error(`Login error: ${error.name} - ${error.message}`);
    res.status(500).send('Failed to log in.');
  }
};

exports.renderLoginPage = async (req, res) => {
  try {
    res.render('login', {
      success: req.flash("success")
    });
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

    console.log(" Session values set. Attempting to save...");

    req.session.save(err => {
      if (err) {
        console.error("Session save error:", err);
        return res.status(500).send("Failed to save session.");
      }

      console.log("Session saved. Redirecting to /products");
      req.flash('success', 'You successfully created an account and are now logged in.');
      res.redirect('/products');
    });

  } catch (error) {
    console.error(`Error creating a new user: ${error.name} - ${error.message}`);
    res.status(500).send('Failed to create user.');
  }
};


exports.renderLogoutPage = (req, res) => {
  try {
    req.session.destroy(error => {
      if (error) {
        console.error(`Error destroying session: ${error}`);
        return res.status(500).send('Could not log out.');
      }
      res.redirect('/login'); 
    });
  } catch (error) {
    console.error(`Logout error: ${error.name} - ${error.message}`);
    res.status(500).send('Failed to log out.');
  }
};

