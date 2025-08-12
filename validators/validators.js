const { body, validationResult } = require('express-validator');

exports.validateLogin = [
  body('username')
    .trim()
    .notEmpty().withMessage('username required.')
    .escape(),

 body('password')
   .trim()
   .notEmpty().withMessage('password required.')
   .escape()
];

exports.validateCreateLogin = [
  body('username')
  .trim()
  .notEmpty().withMessage('A username is required to create an account.')
  .escape(),

  body('password')
  .trim()
  .notEmpty().withMessage('A password is required to create an account.')
  .escape()
];

exports.validateReview = [
  body('comment')
  .trim()
  .notEmpty().withMessage('A review comment cannot be empty.')
  .escape()
];

exports.validateProductName = [
  body('new_name')
  .trim()
  .isLength({ min: 1, max: 100 }).withMessage('Product name must be 1-100 characters long.')
  .escape()
];


exports.validateProductDescription = [
  body('description')
  .trim()
  .isLength({ min: 1, max: 500 }).withMessage('Product description can be up to 500 characters only.')
  .escape()
];