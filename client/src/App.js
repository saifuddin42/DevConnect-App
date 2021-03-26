import React, { Fragment, useEffect } from 'react';
import './App.css';
import setAuthToken from './utils/setAuthToken';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './components/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Alert from './components/layout/Alert';

// Redux
import { Provider } from 'react-redux';
import store from './store';
import { loadUser } from './actions/auth';

// Every time the app loads check if the correct token exists
// if token exists in local storage
if (localStorage.token) {
  // my utils function to set it to current header
  setAuthToken(localStorage.token);
}

const App = () => {
  // React hook similar to componentDidMount and componentDidUpdate
  // using this cuz App is a function instead of a class
  // will run whenever the state updates. If you only one to run once, add a second parameter []
  useEffect(() => {
    // run loadUser() action in auth.js
    store.dispatch(loadUser());
  });

  // return
  return (
    <Provider store={store}>
      <Router>
        <>
          <Navbar />
          <Switch>
            <>
              <Route exact path="/" component={Landing} />
              <section className="container">
                <Alert />
                <Route exact path="/register" component={Register} />
                <Route exact path="/login" component={Login} />
              </section>
            </>
          </Switch>
        </>
      </Router>
    </Provider>
  );
};

export default App;
