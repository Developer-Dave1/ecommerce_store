const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController.js');
const Validators = require('../validators/validators.js');
const {handleValidationErrors} = require('../middleware/middleware.js');

router.get('/', UserController.renderLoginPage);
router.get('/login', UserController.renderLoginPage);
router.post('/login', 
    Validators.validateLogin, 
    handleValidationErrors,
    UserController.login);

router.get('/signup', UserController.renderSignupPage);
router.post('/signup', 
    Validators.validateCreateLogin, 
    handleValidationErrors,
    UserController.createUser);

router.get('/logout', UserController.renderLogoutPage);

module.exports = router;
