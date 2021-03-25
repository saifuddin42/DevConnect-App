/**
 * Actions for alertReducer.
 */
import { SET_ALERT, REMOVE_ALERT } from './types';
import { v4 as uuidv4 } from 'uuid'; // to generate random id value for alert object

export const setAlert = (msg, alertType, timeout = 5000) => (dispatch) => {
  //dispatch is from thunk middleware in store.js
  const id = uuidv4();

  dispatch({
    type: SET_ALERT,
    payload: { msg, alertType, id },
  });

  // remove alert after displaying for 5 seconds
  setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: id }), timeout);
};
