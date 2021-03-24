const express = require('express');
const router = express.Router();

/**
 * @route   GET api/profile
 * @desc    Test rout
 * @access  Public
 */
router.get('/', (re, res) => {
  res.send('Test Profile Route');
});

module.exports = router;
