const express = require('express');
const router = express.Router();

/**
 * @route   Get api/posts
 * @desc    Test rout
 * @access  Public
 */
router.get('/', (re, res) => {
  res.send('Test Posts Route');
});

module.exports = router;
