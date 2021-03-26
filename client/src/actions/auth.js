import api from '../utils/api';
import { setAlert } from './alert';
import setAuthToken from '../utils/setAuthToken';
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
} from './types';
import axios from 'axios';

// Load User
export const loadUser = () => async (dispatch) => {
  try {
    // if token exists in local storage
    if (localStorage.token) {
      // my utils function to set it to current header
      setAuthToken(localStorage.token);
    }

    // get authenticated user using current token
    const res = await axios.get('/api/auth');

    dispatch({
      type: USER_LOADED,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
    });
  }
};

// Register User
export const register = ({ name, email, password }) => async (dispatch) => {
  try {
    // create header for request
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    // create body for request
    const body = JSON.stringify({ name, email, password });

    //send a request to api and await a promise from axios
    const res = await axios.post('/api/users', body, config); // didn't need to use full link because package,json has a proxy set up with http://localhost:5000

    // on success use dispatch
    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data,
    });
    dispatch(loadUser());
  } catch (err) {
    // get error message array
    const errors = err.response.data.errors;
    // if they exist, alert them all out
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }
    // then call register_fail
    dispatch({
      type: REGISTER_FAIL,
    });
  }
};

// Login User
export const login = (email, password) => async (dispatch) => {
  const body = { email, password };

  try {
    const res = await api.post('/auth', body);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    });

    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: LOGIN_FAIL,
    });
  }
};

// Logout
export const logout = () => ({ type: LOGOUT });
