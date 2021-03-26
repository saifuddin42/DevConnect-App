import React from 'react';

import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const Landing = ({ isAuthenticated }) => {
  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <section className="landing">
      <div className="dark-overlay">
        <div className="landing-inner">
          <h1 className="x-large">Hello World;</h1>
          <p className="lead">
            Create a profile, share new discoveries, post articles and get help
            from other developers
          </p>
          <div className="buttons">
            <Link to="/register" className="btn btn-primary">
              Sign Up
            </Link>
            <Link to="/login" className="btn btn-light">
              Login
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

// validating the prop types and enforcing rules
Landing.propTypes = {
  isAuthenticated: PropTypes.bool,
};

// Use when you want to fetch redux state into a component.
const mapStateToProps = (state) => ({
  // mapping the redux state to the props in this component
  isAuthenticated: state.auth.isAuthenticated, // doing this will give me isAuthenticated from the auth reducer component { token: localStorage.getItem('token'), isAuthenticated: null, loading: true, user: null,}
  profile: state.profile, // doing this will give me everything in the profile reducer component i.e. { profile: null, profiles: [], repos: [], loading: true, error: {}, // list of errors }
});

export default connect(mapStateToProps)(Landing);
