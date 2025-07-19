const { validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const messages = errors.array().map(err => err.msg);
    req.flash('validationErrors', messages);
    return res.redirect('back'); 
  }

  next();
};

const requireLogin = (req, res, next) => {
  if (!req.session.username) {
    console.warn('Login required to access this page.');
    req.flash('error', 'You must log in to view that page.');
    return res.redirect('/login');
  }
  next();
};

module.exports = {
  handleValidationErrors,
  requireLogin
};
