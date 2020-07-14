/*import React from "react";
import { Router } from "@reach/router";
import SignIn from "./authenticate/SignIn";
import SignUp from "./authenticate/SignUp";
function Home() {
  const user = null;
  return (
    <Router>
        <SignUp path="signUp" />
        <SignIn path="/" />
    </Router>

  );
}
export default Home;
*/

import React, {Fragment} from 'react';
import {Helmet} from 'react-helmet';
import {Link} from 'react-router-dom';

import UserProvider from "../providers/UserProvider";
import { UserContext } from "../providers/UserProvider";

import { BrowserRouter as Router, Route } from 'react-router-dom';

const Home = () => {
    //const user = useContext(UserContext);        
    return (
        <Fragment>
            <Helmet> <title> toohak stonks quizzes </title> </Helmet>
            <div id="home">
                <section>
                    <div></div>
                    <h1>toohak app</h1>
                    <div className="play-button-container">
                        <ul>
                            <li><Link to="/play/lobby">Play</Link></li>
                        </ul>
                    </div>
                    <div className="auth-container">
                        <Link to="/auth/signIn">Login</Link>
                        <Link to="/auth/signUp">Signup</Link>
                    </div>
                </section>
            </div>
        </Fragment>
    )
}

export default Home;