import React, {Fragment, useContext, Component} from 'react';
// import {Helmet} from 'react-helmet';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Create from './Components/pages/Create'
import Host from './Components/pages/Host'
import Play from './Components/pages/Play'
import Home from './Components/pages/Home'

import UserContext from "./Components/authenticate/providers/UserProvider";
import SignIn from "./Components/authenticate/SignIn";
import SignUp from "./Components/authenticate/SignUp";

function Application() {
    return (
      <Router>
        <div className="App">
          <div id="content">
            <Route exact path="/play" render={() => <Play />} />
            <Route exact path="/host" render={() => <Host />} />
            <Route path = "/auth/signIn" exact component={SignIn}/>
            <Route path = "/auth/signUp" exact component={SignUp}/>
            <Route exact path="/create" render={() => <Create />} />
            <Route exact path="/" render={() => <Home />} />
          </div>
        </div>
      </Router>
    )
}

export default Application;