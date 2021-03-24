const express = require('express');
const router = express.Router();

const { check, validationResult } = require('express-validator/check');

/**
 * @route   POST api/users
 * @desc    Register User
 * @access  Public
 */
router.post(
  '/',
  // Added validation checks for user
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please enter a valid email address').isEmail(),
    check(
      'password',
      'Please enter a valid password with 6 or more characters'
    ).isLength({ min: 6 }),
  ],
  (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    console.log('User POST req sent: ', req.body);
    res.send('Test User Route');
  }
);

module.exports = router;
