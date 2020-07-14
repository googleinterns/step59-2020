import React, {Fragment} from 'react';
import {Helmet} from 'react-helmet';
import {Link} from 'react-router-dom';

import { BrowserRouter as Router, Route } from 'react-router-dom';

const Home = () => {
    return (
        <Fragment>
            <Helmet> <title> toohak stonks quizzes </title> </Helmet>
            <div id="home">
                <section>
                    <div>
                        // insert icon here
                    </div>
                    <h1>toohak app</h1>
                    <div className="play-button-container">
                        <ul>
                            <li><Link to="/play/lobby">Play</Link></li>
                        </ul>
                    </div>
                    <div className="auth-container">
                        <Link to="/login">Login</Link>
                        <Link to="/register">Signup</Link>
                    </div>
                </section>
            </div>
        </Fragment>
    )
}

export default Home;