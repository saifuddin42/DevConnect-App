import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

const ProfileAbout = ({
  profile: {
    bio,
    skills,
    user: { name },
  },
}) => (
  <div className="profile-about bg-light p-2">
    {/* show bio if it exists */}
    {bio && (
      <>
        {/* name of the user */}
        <h2 className="text-primary">{name.trim().split(' ')[0]}'s Bio</h2>
        <p>{bio}</p>
        <div className="line" />
      </>
    )}
    <h2 className="text-primary">Top Skill Set</h2>
    {/* map through all skills and print */}
    {/* limit the skills to only 6 */}
    <div className="skills">
      {skills.slice(0, 6).map((skill, index) => (
        <div key={index} className="p-1">
          <i className="fas fa-check" /> {skill}
        </div>
      ))}
    </div>
  </div>
);

ProfileAbout.propTypes = {
  profile: PropTypes.object.isRequired,
};

export default ProfileAbout;
