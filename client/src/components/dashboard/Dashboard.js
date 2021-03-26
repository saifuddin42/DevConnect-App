import React, { Fragment, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import DashboardActions from './DashboardActions';
import Experience from './Experience';
import Education from './Education';

import { getCurrentProfile } from '../../actions/profile';
import { deleteAccount } from '../../actions/profile';

const Dashboard = ({
  getCurrentProfile,
  deleteAccount,
  auth: { user },
  profile: { profile, loading },
}) => {
  useEffect(() => {
    getCurrentProfile();
  }, [getCurrentProfile]);

  return loading && profile === null ? (
    <Spinner />
  ) : (
    <>
      <h1 className="large text-primary">Dashboard</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Welcome {user && user.name}
      </p>
      {profile !== null ? (
        <>
          <DashboardActions />

          <Experience experience={profile.experience} />

          <Education education={profile.education} />

          <div className="my-2">
            <button className="btn btn-danger" onClick={() => deleteAccount()}>
              <i className="fas fa-user-minus" /> Delete My Account
            </button>
          </div>
        </>
      ) : (
        <>
          <p>You have not yet setup a profile, please add some info</p>
          <Link to="/create-profile" className="btn btn-primary my-1">
            Create Profile
          </Link>
        </>
      )}
    </>
  );
};

Dashboard.propTypes = {};

// validating the prop types and enforcing rules
Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  deleteAccount: PropTypes.func.isRequired,
};

// Use when you want to fetch redux state into a component.
const mapStateToProps = (state) => ({
  // mapping the redux state to the props in this component
  auth: state.auth, // doing this will give me everything in the auth reducer component i.e. { token: localStorage.getItem('token'), isAuthenticated: null, loading: true, user: null,}
  profile: state.profile, // doing this will give me everything in the profile reducer component i.e. { profile: null, profiles: [], repos: [], loading: true, error: {}, // list of errors }
});

export default connect(mapStateToProps, { getCurrentProfile, deleteAccount })(
  Dashboard
);
