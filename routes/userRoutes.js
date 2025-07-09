const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController.js');

router.get('/login', UserController.renderLoginPage);
router.post('/login', UserController.login);
router.get('/signup', UserController.renderSignupPage);
router.post('/signup', UserController.createUser);
router.get('/logout', UserController.logout);



module.exports = router;
