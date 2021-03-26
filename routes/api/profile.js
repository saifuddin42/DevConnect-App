const express = require('express');
const router = express.Router();

const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

const { check, validationResult } = require('express-validator');

const axios = require('axios'); // request deprecated. change to axios
const config = require('config');

// bring in normalize to give us a proper url, regardless of what user entered
const normalize = require('normalize-url');

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

    res.json(profile);
  } catch (err) {
    console.error('Error loading profile: ', err.message);
    res.status(500).send('Profile Server error!');
  }
});

/**
 * @route   POST api/profile
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
    const profileFields = {
      user: req.user.id,
      company,
      location,
      website: website === '' ? '' : normalize(website, { forceHttps: true }),
      bio,
      skills: Array.isArray(skills)
        ? skills
        : skills.split(',').map((skill) => ' ' + skill.trim()),
      status,
      githubusername,
    };

    const socialfields = { youtube, twitter, instagram, linkedin, facebook };

    // checking social needs extra steps cuz it has nested objects
    for (const [key, value] of Object.entries(socialfields)) {
      if (value.length > 0)
        socialfields[key] = normalize(value, { forceHttps: true });
    }
    profileFields.social = socialfields;

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

      return res.json(profile);
    } catch (err) {
      console.error('Error creating/updating profile: ', err.message);
      res.status(500).send('Profile Server error!');
    }
  }
);

/**
 * @route   GET api/profile
 * @desc    Get all user profiles
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    // Find the individual user profile
    const profiles = await Profile.find() // the user in here is the user field in the Profile schema!
      .populate('user', ['name', 'avatar']); // populate the profile user field with name and avatar from user using their id

    if (!profiles) {
      return res.status(400).json({ msg: 'There are no profiles in the db' });
    }

    res.json(profiles);
  } catch (err) {
    console.error('Error loading user profiles: ', err.message);
    res.status(500).send('Profile Server error!');
  }
});

/**
 * @route   GET api/profile/user/:user_id
 * @desc    Get profile by user id
 * @access  Public
 */
router.get('/user/:user_id', async (req, res) => {
  try {
    // Find the individual user profile
    const profile = await Profile.findOne({ user: req.params.user_id }) // the user in here is the user field in the Profile schema! and the user_id is the parameter passed in the request url
      .populate('user', ['name', 'avatar']); // populate the profile user field with name and avatar from user using their id

    if (!profile) {
      return res.status(400).json({ msg: "The user doesn't exist in the db" });
    }

    res.json(profile);
  } catch (err) {
    // if the url_id syntax is entered incorrectly i.e. if it could never be an ObjectId (ex: api/profile/user/LOLIAMNOTID)
    if (err.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'Profile not found' });
    }

    // for any other errors
    console.error("Error loading the user's profile: ", err.message);
    res.status(500).send('Profile Server error!');
  }
});

/**
 * @route   DELETE api/profile
 * @desc    Delete user, profile and posts
 * @access  Private
 */
router.delete('/', auth, async (req, res) => {
  //auth checks for a valid token
  try {
    // @todo - Find and remove the particular user's posts

    // Find and remove the particular user profile
    await Profile.findOneAndRemove({ user: req.user.id }); // the user in here is the user field in the Profile schema!

    // Find and remove the particular user
    await User.findOneAndRemove({ _id: req.user.id }); // the _id in here is the _id field in the User schema!

    res.json({ msg: 'User, Profile and Posts Deleted' });
  } catch (err) {
    console.error('Error deleting user: ', err.message);
    res.status(500).send('Profile Server error!');
  }
});

/**
 * @route   PUT api/profile/experience
 * @desc    Add profile experience
 * @access  Private
 */
router.put(
  '/experience',
  [
    //auth checks for a valid token
    auth,
    //express-validator checks body for correct  data being passed
    [
      check('title', 'Title is Required').not().isEmpty(),
      check('company', 'Company is Required').not().isEmpty(),
      check('from', 'Start Date is Required').not().isEmpty(),
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
      location,
      title,
      from,
      to,
      current,
      description,
    } = req.body; // destructure everything from req.body

    // Build Experience object
    let newExp = { company, location, title, from, to, current, description };

    // Now that the newExp are properly initialized, we can create the experience
    try {
      // Find the individual user profile
      const profile = await Profile.findOne({ user: req.user.id }); // the user in here is the user field in the Profile schema

      // Push the newExp into profile.experience array at the beginning using unshift()
      profile.experience.unshift(newExp);

      // save profile
      await profile.save();

      return res.json(profile);
    } catch (err) {
      console.error('Error adding experience: ', err.message);
      res.status(500).send('Profile Server error!');
    }
  }
);

/**
 * @route   DELETE api/profile/experience/:exp_id
 * @desc    Delete user experience from profile
 * @access  Private
 */
router.delete('/experience/:exp_id', auth, async (req, res) => {
  //auth checks for a valid token
  try {
    // Find the particular user profile
    const profile = await Profile.findOne({ user: req.user.id }); // the user in here is the user field in the Profile schema!

    // Get the index for removing experience by using exp_id
    const removeIndex = profile.experience
      .map((item) => item.id)
      .indexOf(req.params.exp_id);

    profile.experience.splice(removeIndex, 1); // remove the element at the index

    await profile.save();

    res.json({ msg: 'Experience Deleted' });
  } catch (err) {
    console.error('Error deleting experience: ', err.message);
    res.status(500).send('Profile Server error!');
  }
});

/**
 * @route   PUT api/profile/education
 * @desc    Add profile education
 * @access  Private
 */
router.put(
  '/education',
  [
    //auth checks for a valid token
    auth,
    //express-validator checks body for correct  data being passed
    [
      check('school', 'School is Required').not().isEmpty(),
      check('degree', 'Degree is Required').not().isEmpty(),
      check('from', 'Start Date is Required').not().isEmpty(),
      check('fieldofstudy', 'Field is Required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    } = req.body; // destructure everything from req.body

    // Build Experience object
    let newEdu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    };

    // Now that the newExp are properly initialized, we can create the education
    try {
      // Find the individual user profile
      const profile = await Profile.findOne({ user: req.user.id }); // the user in here is the user field in the Profile schema

      // Push the newEdu into profile.education array at the beginning using unshift()
      profile.education.unshift(newEdu);

      // save profile
      await profile.save();

      return res.json(profile);
    } catch (err) {
      console.error('Error adding education: ', err.message);
      res.status(500).send('Profile Server error!');
    }
  }
);

/**
 * @route   DELETE api/profile/education/:edu_id
 * @desc    Delete user education from profile
 * @access  Private
 */
router.delete('/education/:edu_id', auth, async (req, res) => {
  //auth checks for a valid token
  try {
    // Find the particular user profile
    const profile = await Profile.findOne({ user: req.user.id }); // the user in here is the user field in the Profile schema!

    // Get the index for removing education by using edu_id
    const removeIndex = profile.education
      .map((item) => item.id)
      .indexOf(req.params.edu_id);

    profile.education.splice(removeIndex, 1); // remove the element at the index

    await profile.save();

    res.json({ msg: 'Education Deleted' });
  } catch (err) {
    console.error('Error deleting education: ', err.message);
    res.status(500).send('Profile Server error!');
  }
});

/**
 * @route   GET api/profile/github/:username
 * @desc    Get user repos from github
 * @access  Public
 */
router.get('/github/:username', async (req, res) => {
  try {
    const uri = encodeURI(
      `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc`
    );

    const headers = {
      'user-agent': 'node.js',
      Authorization: `token ${config.get('githubToken')}`,
    };

    const gitHubResponse = await axios.get(uri, { headers });

    return res.json(gitHubResponse.data);
  } catch (err) {
    console.error('Error fetching github repos: ', err.message);
    res.status(404).send('No github profile found for this username');
  }
});

module.exports = router;
