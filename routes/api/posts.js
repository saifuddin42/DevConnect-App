/**
 * I have not commented stuff in here a lot but if in doubt just check the profiles.js or users.js
 */

const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

const Post = require('../../models/Post');
const User = require('../../models/User');

/**
 * @route   GET api/posts
 * @desc    Test route
 * @access  Public
 */
router.get('/', (re, res) => {
  res.send('Test Posts Route');
});

/**
 * @route   POST api/posts
 * @desc    Create a post
 * @access  Private
 */
router.post(
  '/',
  // run auth for token validation and express-validator to validate body of the request
  [auth, [check('text', 'Text is required').not().isEmpty()]],
  async (req, res) => {
    // check if validation threw any erros
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // find user details by id but exlude the password field in the result
      const user = await User.findById(req.user.id).select('-password');

      // create new Post object
      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      });

      const post = await newPost.save();

      res.json({ msg: 'Post Created', post: post });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Posts Server Error');
    }
  }
);

module.exports = router;
