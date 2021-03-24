const express = require('express');
const router = express.Router();

const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

const { check, validationResult } = require('express-validator');

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

/**
 * @route   POST api/profile/me
 * @desc    Create or update a user's profile
 * @access  Private
 */
router.post(
  '/',
  [
    auth,
    [
      check('status', 'Status is required').not().isEmpty(),
      check('skills', 'Skills are required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin,
    } = req.body; // destructure everything from req.body

    // Build Profile object while handling cases if the all profile attributes were passed or not
    let profileFields = {};
    profileFields.user = req.user.id;
    if (company) {
      profileFields.company = company;
    }
    if (website) {
      profileFields.website = website;
    }
    if (location) {
      profileFields.location = location;
    }
    if (bio) {
      profileFields.bio = bio;
    }
    if (status) {
      profileFields.status = status;
    }
    if (githubusername) {
      profileFields.githubusername = githubusername;
    }
    if (skills) {
      // convert the incoming string "html,   css,js" to a proper array like ['html', 'css', 'js']
      profileFields.skills = skills.split(',').map((skill) => skill.trim());
    }
    // checking social needs extra steps cuz it has nested objects
    profileFields.social = {};
    if (profileFields.social.youtube) {
      profileFields.social.youtube = youtube;
    }
    if (profileFields.social.twitter) {
      profileFields.social.twitter = twitter;
    }
    if (profileFields.social.instagram) {
      profileFields.social.instagram = instagram;
    }
    if (profileFields.social.facebook) {
      profileFields.social.facebook = facebook;
    }
    if (profileFields.social.linkedin) {
      profileFields.social.linkedin = linkedin;
    }

    // Now that the profileFields are properly initialized, we can create or update profile
    try {
      // Find the individual user profile
      let profile = await Profile.findOne({ user: req.user.id }); // the user in here is the user field in the Profile schema

      // If a profile is found then update
      if (profile) {
        // Update
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return res.json({ msg: 'Profile found and Updated', profile: profile });
      }

      // Else, create a profile
      profile = new Profile(profileFields);

      // Save the profile
      await profile.save();

      return res.json({ msg: 'Profile Created', profile: profile });
    } catch (err) {
      console.error('Error creating/updating profile: ', err.message);
      res.status(500).send('Profile Server error!');
    }
  }
);

module.exports = router;
