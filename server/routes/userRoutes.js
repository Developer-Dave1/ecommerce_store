const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController.js');
const Validators = require('../validators/validators.js');
const {handleValidationErrors} = require('../middleware/middleware.js');

router.post('/login', 
    Validators.validateLogin, 
    handleValidationErrors,
    UserController.login);

router.post('/signup', 
    Validators.validateCreateLogin, 
    handleValidationErrors,
    UserController.createUser);

router.post('/logout', UserController.logout);

module.exports = router;
