const express = require('express');
const router = express.Router();

const { check, validationResult } = require('express-validator');

const User = require('../../models/User'); // import User model
const gravatar = require('gravatar'); // import gravatar
const bcrypt = require('bcryptjs'); // import bcrypt

const jwt = require('jsonwebtoken');
const config = require('config'); // import config to use the secret key while signing the jwt payload

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
      const payload = {
        user: {
          id: user.id, // get the _id from the mongodb data but mongoose abstracts _id with id
        },
      }; // Payload which contains data to verify the current user

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        {
          expiresIn: config.get('TIMEOUT'), // set webToken timeout to expire user session
        },
        // in the callback either get an err or a final token. if err exists then throw it else send token in res
        (err, token) => {
          if (err) {
            console.error(
              "User Registered but couldn't generate token. Error: ",
              err.message
            );
            throw err;
          }
          console.log('User POST req sent: ', req.body);
          //   res.send('User Registered to DB!');
          res.json({ msg: 'User registered to DB!', token: token });
        }
      );
    } catch (err) {
      console.error("Couldn't register user. Error: ", err.message);
      res.status(500).send('Server error!');
    }
  }
);

module.exports = router;
