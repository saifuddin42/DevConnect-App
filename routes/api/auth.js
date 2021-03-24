const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

const User = require('../../models/User');

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

module.exports = router;
