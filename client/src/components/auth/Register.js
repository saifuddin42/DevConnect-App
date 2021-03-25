import React, { Fragment, useState } from 'react';
import axios from 'axios';

const Register = () => {
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
      console.log('Passwords do not match');
    }
    // register new user to database using axios request
    else {
      const newUser = {
        name,
        email,
        password,
      };

      try {
        // create header for request
        const config = {
          headers: {
            'Content-Type': 'application/json',
          },
        };

        // create body for request
        const body = JSON.stringify(newUser);

        //send a request to api and await a promise from axios
        const res = await axios.post('/api/users', body, config); // didn't need to use full link because package,json has a proxy set up with http://localhost:5000

        // log result from api
        console.log(res);
      } catch (err) {
        console.error(err.response.data);
      }
    }
  };

  return (
    <Fragment>
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
        Already have an account? <a href="login.html">Sign In</a>
      </p>
    </Fragment>
  );
};

export default Register;
