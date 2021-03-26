import React, { Fragment, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getCurrentProfile } from '../../actions/profile';

const Dashboard = ({ getCurrentProfile, auth, profile }) => {
  useEffect(() => {
    getCurrentProfile();
  }, []);

  return <div>Dashboard</div>;
};

Dashboard.propTypes = {};

// validating the prop types and enforcing rules
Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
};

// Use when you want to fetch redux state into a component.
const mapStateToProps = (state) => ({
  // mapping the redux state to the props in this component
  auth: state.auth, // doing this will give me everything in the auth reducer component i.e. { token: localStorage.getItem('token'), isAuthenticated: null, loading: true, user: null,}
  profile: state.profile, // doing this will give me everything in the profile reducer component i.e. { profile: null, profiles: [], repos: [], loading: true, error: {}, // list of errors }
});

export default connect(mapStateToProps, { getCurrentProfile })(Dashboard);
