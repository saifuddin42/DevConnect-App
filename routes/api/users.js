const express = require('express');
const router = express.Router();

const { check, validationResult } = require('express-validator');

const User = require('../../models/User'); // import User model
const gravatar = require('gravatar'); // import gravatar
const bcrypt = require('bcryptjs'); // import bcrypt

// Note: we use await keyword before anything that returns a Promise. Using Promises helps us eliminate the clutter of using .then()s

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
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body; // destructure name email and password from req.body

    try {
      // Check if user exists
      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User with that email already exists.' }] }); // Added return before res.send() because it is not the last res.send(). There is one more below.
      }

      // Get user's gravatar
      const avatar = gravatar.url(email, {
        s: '200', //default size
        r: 'pg', // rating to avoid nsfw images
        d: 'mm', //default image if no pic exists
      });

      // Create instance of a user
      user = new User({
        name,
        email,
        avatar,
        password,
      });

      //Encrypt password using bcrypt
      const salt = await bcrypt.genSalt(10); // salt for hashing
      user.password = await bcrypt.hash(password, salt);

      // Save user to db
      await user.save();

      // Return jsonwebtoken

      console.log('User POST req sent: ', req.body);
      res.send('User Registered to DB!');
    } catch (err) {
      console.error("Couldn't register user. Error: ", err.message);
      res.status(500).send('Server error!');
    }
  }
);

module.exports = router;
