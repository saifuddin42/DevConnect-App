/**
 * Alert Reducer.
 */
import { SET_ALERT, REMOVE_ALERT } from '../actions/types';

// initial state for alert reducer
const initialState = [];

function alertReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case SET_ALERT:
      // ...state copies the original state basically so that we apply updates to the state instead of replacing it
      return [...state, payload]; // payload is the object of the alert with id msg and alertType (defined in Action of alertReducer)

    // remove a specific alert by id
    case REMOVE_ALERT:
      // for each alert check if the alert id is != payload
      return state.filter((alert) => alert.id !== payload);

    default:
      return state;
  }
}

export default alertReducer;
