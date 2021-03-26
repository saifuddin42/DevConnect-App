import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';

// Redux
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from '../../actions/auth';

const Login = (
  // pull out from props
  { login, isAuthenticated }
) => {
  // to keep track of form state using useState() hook
  // formData is the state and setFormData is a setState function for that state
  const [formData, setFormData] = useState({
    // initial states
    email: '',
    password: '',
  });

  // destructure the state values
  const { email, password } = formData;

  // onChange function for text fields in the form to update formState
  const onChange = (e) => {
    // copy the formData and set the attribute values (e.target.name - this fetches the name of the field from the form) to new value (e.target.value - this fetches the value of the field from the form)
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // onSubmit function for the form
  const onSubmit = async (e) => {
    e.preventDefault();

    login(email, password); //login using form contents
  };

  // Redirect if logged in
  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <>
      <h1 className="large text-primary">Sign In</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Sign Into Your Account
      </p>
      <form className="form" onSubmit={(e) => onSubmit(e)}>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={email} // fetching the value from formState
            onChange={(e) => onChange(e)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            minLength="6"
            value={password} // fetching the value from formState
            onChange={(e) => onChange(e)}
            required
          />
        </div>

        <input type="submit" className="btn btn-primary" value="Login" />
      </form>
      <p className="my-1">
        Don't have an account? <Link to="/register">Sign Up</Link>
      </p>
    </>
  );
};

// validating the prop types and enforcing rules
Login.propTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};

// Use when you want to fetch redux state into a component.
const mapStateToProps = (state) => ({
  // mapping the redux state to the props in this component
  // auth: state.auth, // doing this will give me everything in the auth reducer component i.e. { token: localStorage.getItem('token'), isAuthenticated: null, loading: true, user: null,} but i just want the isAuthenticated
  // so
  isAuthenticated: state.auth.isAuthenticated, // and now since this is a prop i'll add it to proptypes for validity checks
});

// connect(mapStateToProps, mapDispatchToProps)
export default connect(mapStateToProps, { login })(Login);
