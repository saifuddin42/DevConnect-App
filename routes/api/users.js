const express = require('express');
const router = express.Router();

/**
 * @route   GET api/users
 * @desc    Test rout
 * @access  Public
 */
router.get('/', (re, res) => {
  res.send('Test User Route');
});

module.exports = router;
