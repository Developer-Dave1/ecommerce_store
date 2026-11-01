const { validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const messages = errors.array().map(err => err.msg);
    return res.status(400).json({ error: 'Validation failed.', errors: messages }); 
  }

  next();
};

const requireLogin = (req, res, next) => {
  if (!req.session.username) {
    console.warn('Login required to access this page.');
    return res.status(401).json({message: 'Please log in.'});
  }
  next();
};

const isAdmin = (req, res, next) => {
  if (!req.session.user_id) {
    return res.status(401).json({message: 'Please log in.'});
  }
  if (req.session.isAdmin !== true) {
    return res.status(403).json({message: 'User is logged in, but not admin.'});
  }
  next();
};

module.exports = {
  handleValidationErrors,
  requireLogin,
  isAdmin
};
