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
 * @route    GET api/posts
 * @desc     Get all posts
 * @access   Private (Since need to be logged in to see posts)
 */
router.get('/', auth, async (req, res) => {
  try {
    // find all posts and sort by date in descending order
    const posts = await Post.find().sort({ date: -1 });

    res.json({ msg: 'Posts Fetched', post: posts });
  } catch (err) {
    console.error(err.message);
    res.status(500).send(' Posts Server Error');
  }
});

/**
 * @route    GET api/posts/:id
 * @desc     Get post by id
 * @access   Private (Since need to be logged in to see posts)
 */
router.get('/:id', auth, async (req, res) => {
  try {
    // find post using id in params
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    res.json({ msg: 'Post Fetched', post: post });
  } catch (err) {
    console.error(err.message);

    if ((err.kind = 'ObjectId')) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    res.status(500).send(' Posts Server Error');
  }
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

/**
 * @route    DELETE api/posts/:id
 * @desc     Delete a post using id
 * @access   Private
 */
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // Check for ObjectId format and post to see if user and the post exist
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/) || !post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    // Check if the post is of the user who is trying to delete
    if (post.user.toString() !== req.user.id) {
      // used toString() because originally post.user is ObjectId and it won't match with req.user.id which is String
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await post.remove();

    res.json({ msg: 'Post removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send(' Posts Server Error');
  }
});

/**
 * @route    PUT api/posts/like/:id
 * @desc     Like a post
 * @access   Private
 */
router.put('/like/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // Check if the post has already been liked by the current user
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length >
      0
    ) {
      return res.status(400).json({ msg: 'Post already liked' });
    }

    // push like to the start of array
    post.likes.unshift({ user: req.user.id });

    await post.save();

    res.json({ msg: 'Post Liked', post: post.likes });
  } catch (err) {
    console.error(err.message);
    res.status(500).send(' Posts Server Error');
  }
});

/**
 * @route    PUT api/posts/unlike/:id
 * @desc     Unlike a post
 * @access   Private
 */
router.put('/unlike/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // Check if the post has no likes by the current user
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id)
        .length === 0
    ) {
      return res.status(400).json({ msg: 'Post has not yet been liked' });
    }

    // Get remove index
    const removeIndex = post.likes
      .map((like) => like.user.toString())
      .indexOf(req.user.id);

    post.likes.splice(removeIndex, 1);

    await post.save();

    res.json({ msg: 'Post Unliked', post: post.likes });
  } catch (err) {
    console.error(err.message);
    res.status(500).send(' Posts Server Error');
  }
});

/**
 * @route    POST api/posts/comment/:id
 * @desc     Comment on a post using the post's id
 * @access   Private
 */
router.post(
  '/comment/:id',
  [auth, [check('text', 'Text is required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');
      const post = await Post.findById(req.params.id);

      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      };

      // add comment to beginning of array
      post.comments.unshift(newComment);

      await post.save();

      res.json({ msg: 'Comment Posted', post: post.comments });
    } catch (err) {
      console.error(err.message);
      res.status(500).send(' Posts Server Error');
    }
  }
);

/**
 * @route    DELETE api/posts/comment/:id/:comment_id
 * @desc     Delete comment on a post by comment id
 * @access   Private
 */
router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // Pull out comment
    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    );
    // Make sure comment exists
    if (!comment) {
      return res.status(404).json({ msg: 'Comment does not exist' });
    }
    // Check user
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    post.comments = post.comments.filter(
      ({ id }) => id !== req.params.comment_id
    );

    await post.save();

    res.json({ msg: 'Comment Deleted', post: post.comments });
  } catch (err) {
    console.error(err.message);
    res.status(500).send(' Posts Server Error');
  }
});

module.exports = router;
