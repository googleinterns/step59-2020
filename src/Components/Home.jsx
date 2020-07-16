import React, {Fragment,useContext} from 'react';
import {Helmet} from 'react-helmet';
import {Link} from 'react-router-dom';

import UserProvider from "../providers/UserProvider";
import { UserContext } from "../providers/UserProvider";
import GameLobby from "./quiz/Lobby";

import { BrowserRouter as Router, Route } from 'react-router-dom';

const Home = () => {
    const user = useContext(UserContext);        
    return (
        user ?
        <GameLobby />
        :
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