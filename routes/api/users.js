const express = require('express');
const router = express.Router();

/**
 * @route   POST api/users
 * @desc    Register User
 * @access  Public
 */
router.post('/', (req, res) => {
  console.log('User POST req sent: ', req.body);
  res.send('Test User Route');
});

module.exports = router;
