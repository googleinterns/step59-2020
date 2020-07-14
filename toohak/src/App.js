import React, {Fragment} from 'react';
import {Helmet} from 'react-helmet';
import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Route} from 'react-router-dom';


import Home from './Components/Home';
import GameLobby from './Components/quiz/Lobby.js';
import Play from './Components/quiz/Play.js';


function App() {
  return (
    <Router>
      <Route path = "/" exact component={Home}/>
      <Route path = "/play/lobby" exact component={GameLobby}/>
      <Route path = "/play/game" exact component={Play}/>
    </Router>
  );
}

export default App;