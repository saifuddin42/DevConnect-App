const express = require('express');
const router = express.Router();

/**
 * @route   GET api/auth
 * @desc    Test rout
 * @access  Public
 */
router.get('/', (re, res) => {
  res.send('Test Auth Route');
});

module.exports = router;
