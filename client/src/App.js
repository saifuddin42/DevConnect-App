import React, { Fragment } from 'react';
import './App.css';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './components/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';

const App = () => {
  return (
    <Router>
      <>
        <Navbar />
        <Switch>
          <Route exact path="/" component={Landing} />
          <section className="container">
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
          </section>
        </Switch>
      </>
    </Router>
  );
};

export default App;
