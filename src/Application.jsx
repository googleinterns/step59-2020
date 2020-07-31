import React, {Fragment, useContext, Component} from 'react';
// import {Helmet} from 'react-helmet';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Create from './components/pages/Create'
import Host from './components/pages/Host'
import Play from './components/pages/Play'
import Home from './components/pages/Home'

import UserContext from "./components/authenticate/UserProvider";
import SignIn from "./components/authenticate/SignIn";
import SignUp from "./components/authenticate/SignUp";
import SignOut from "./components/authenticate/SignOut";

function Application() {
    return (
      <Router>
        <div className="App">
          <div id="content">
            <Route exact path="/play" render={() => <Play />} />
            <Route exact path="/host" render={() => <Host />} />
            <Route path = "/auth/signIn" exact component={SignIn}/>
            <Route path = "/auth/signUp" exact component={SignUp}/>
            <Route path = "/auth/signOut" exact component ={SignOut}/>
            <Route exact path="/create" render={() => <Create />} />
            <Route exact path="/" render={() => <Home />} />
          </div>
        </div>
      </Router>
    )
}

export default Application;