const express = require('express');
const router = express.Router();

const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

/**
 * @route   GET api/profile/me
 * @desc    Get curent user's profile
 * @access  Private
 */
router.get('/me', auth, async (req, res) => {
  // the auth authorizes if there is a token in the header of the request or not
  try {
    // Find the individual user profile
    const profile = await Profile.findOne({ user: req.user.id }) // the user in here is the user field in the Profile schema!
      .populate('user', ['name', 'avatar']); // populate the profile user field with name and avatar from user using their id

    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' });
    }

    res.json({ msg: 'Profile found', profile: profile });
  } catch (err) {
    console.error('Error loading profile: ', err.message);
    res.status(500).send('Profile Server error!');
  }
});

module.exports = router;
