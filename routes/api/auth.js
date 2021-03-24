const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

const User = require('../../models/User');

const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config'); // import config to use the secret key while signing the jwt payload
const bcrypt = require('bcryptjs');

/**
 * @route   GET api/auth
 * @desc    Test route
 * @access  Public
 */
//This gets the user data on successful validation
router.get('/', auth, async (req, res) => {
  // in the router.get I pass the authentication funtion (middleware) which is imported on line 3 and that function is executed. In that funtion the req object is updated using the token with the user's _id and then next is called which executes the callback function in the third parameter in this file above with the req and res from the auth middleware
  try {
    const user = await User.findById(req.user.id) // in the middleware i passed the user id in req.user on successful token validation
      .select('-password'); // do not include the password field in this user object

    res.json({ msg: 'Authenticated user successfully', user: user });
  } catch (err) {
    console.error('Error authenticating user: ', err.message);
    res.status(500).send('Error authenticating user');
  }
});

/**
 * @route   POST api/auth
 * @desc    Authenticate User and get token
 * @access  Public
 */
router.post(
  '/',
  // Added validation checks for user object in the req body
  [
    check('email', 'Please enter a valid email address').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body; // destructure email and password from req.body

    try {
      // Check if user exists
      let user = await User.findOne({ email });

      console.log(user);

      // If user doesn't exist in the database then:
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid credentials' }] }); // Added return before res.send() because it is not the last res.send(). There is one more below.
      }

      // Match the user's email and password
      const isMatch = await bcrypt.compare(password, user.password); // compare the plain text password from the req.body with the encrypted password from the mongodb database

      // If the user's password is incorrect:
      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid credentials' }] }); // Added return before res.send() because it is not the last res.send(). There is one more below.
      }

      /**
       * Note: Kept the msg same for either invalid user or password so that the person logging in doesn't know what was the incorrect entry to reduce security risks
       */

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
              "User authenticated but auth token couldn't be generated. Error: ",
              err.message
            );
            throw err;
          }
          //   res.send('User Registered to DB!');
          res.json({ msg: 'User Authenticated!', token: token });
        }
      );
    } catch (err) {
      console.error("Couldn't authenticate user. Error: ", err.message);
      res.status(500).send('Auth Server error!');
    }
  }
);

module.exports = router;
