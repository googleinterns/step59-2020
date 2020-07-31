import React, {Component} from 'react';

import UserProvider from "./components/authenticate/UserProvider";
import Application from "./Application"

class App extends Component {
  constructor(props) {
    super(props);
    this.state={};
  }
  render() {
    return (
      <UserProvider>
        <Application />
      </UserProvider>
    )
  }
}

export default App;