import React, { Fragment, useEffect } from 'react';
import './App.css';
import setAuthToken from './utils/setAuthToken';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Alert from './components/layout/Alert';
import Dashboard from './components/dashboard/Dashboard';
import PrivateRoute from './components/routing/PrivateRoute';
import CreateProfile from './components/profile-forms/CreateProfile';
import EditProfile from './components/profile-forms/EditProfile';
import AddExperience from './components/profile-forms/AddExperience';
import AddEducation from './components/profile-forms/AddEducation';
import Profiles from './components/profiles/Profiles';
import Profile from './components/profile/Profile';
import Posts from './components/posts/Posts';
import Post from './components/post/Post';

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
  }, []);

  // return
  return (
    <Provider store={store}>
      <Router>
        <>
          <Navbar />
          <Switch>
            <Route exact path="/" component={Landing} />
            <>
              <section className="container">
                <Alert />
                <Route exact path="/register" component={Register} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/profiles" component={Profiles} />
                <Route exact path="/profile/:id" component={Profile} />
                <PrivateRoute exact path="/dashboard" component={Dashboard} />
                <PrivateRoute
                  exact
                  path="/create-profile"
                  component={CreateProfile}
                />
                <PrivateRoute
                  exact
                  path="/edit-profile"
                  component={EditProfile}
                />
                <PrivateRoute
                  exact
                  path="/add-experience"
                  component={AddExperience}
                />
                <PrivateRoute
                  exact
                  path="/add-education"
                  component={AddEducation}
                />
                <PrivateRoute exact path="/posts" component={Posts} />
                <PrivateRoute exact path="/post/:id" component={Post} />
              </section>
            </>
          </Switch>
        </>
      </Router>
    </Provider>
  );
};

export default App;
