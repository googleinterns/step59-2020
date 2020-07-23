import React, {Component} from 'react';

import UserProvider from "./Components/authenticate/providers/UserProvider";
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