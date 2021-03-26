import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';

// Redux
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { setAlert } from '../../actions/alert';
import { register } from '../../actions/auth';

const Register = (
  // pull out from props
  { setAlert, register, isAuthenticated }
) => {
  // to keep track of form state using useState() hook
  // formData is the state and setFormData is a setState function for that state
  const [formData, setFormData] = useState({
    // initial states
    name: '',
    email: '',
    password: '',
    password2: '',
  });

  // destructure the state values
  const { name, email, password, password2 } = formData;

  // onChange function for text fields in the form to update formState
  const onChange = (e) => {
    // copy the formData and set the attribute values (e.target.name - this fetches the name of the field from the form) to new value (e.target.value - this fetches the value of the field from the form)
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // onSubmit function for the form
  const onSubmit = async (e) => {
    e.preventDefault();

    if (password !== password2) {
      setAlert('Passwords do not match', 'danger'); // sends msg and alertType to setAlert. danger keyword is for css
    } else {
      register({ name, email, password }); //register using form contents
    }
  };

  // Redirect if logged in
  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <>
      <h1 className="large text-primary">Sign Up</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Create Your Account
      </p>
      <form className="form" onSubmit={(e) => onSubmit(e)}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Name"
            name="name"
            value={name} // fetching the value from formState
            onChange={(e) => onChange(e)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={email} // fetching the value from formState
            onChange={(e) => onChange(e)}
            required
          />
          <small className="form-text">
            This site uses Gravatar so if you want a profile image, use a
            Gravatar email
          </small>
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
        <div className="form-group">
          <input
            type="password"
            placeholder="Confirm Password"
            name="password2"
            minLength="6"
            value={password2} // fetching the value from formState
            onChange={(e) => onChange(e)}
            required
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Register" />
      </form>
      <p className="my-1">
        Already have an account? <Link to="/login">Sign In</Link>
      </p>
    </>
  );
};

// validating the prop types and enforcing rules
Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
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
export default connect(mapStateToProps, { setAlert, register })(Register);
