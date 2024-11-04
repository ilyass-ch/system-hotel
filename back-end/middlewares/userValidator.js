const { check, validationResult } = require('express-validator');

exports.userSignupValidator = [
  check('name')
    .notEmpty().withMessage('Name is required'),
  check('email')
    .isEmail().withMessage('Email must be valid'),
  check('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
];

exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
