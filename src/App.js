import React, {Fragment} from 'react';
import {Helmet} from 'react-helmet';

import {BrowserRouter as Router, Route} from 'react-router-dom';

import UserProvider from "./providers/UserProvider";
import Game from "./Components/Game";

function App() {
  
  return (
    <UserProvider>
      <Game />
    </UserProvider>
  );
}

export default App;