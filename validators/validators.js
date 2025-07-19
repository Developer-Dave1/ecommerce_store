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