import React, { Component, createContext } from "react";
import { auth } from "../../firebase";
export const UserContext = createContext({ user: null });


class UserProvider extends Component {
  state = {
    user: null
  };

  componentDidMount = () => {
    auth.onAuthStateChanged(userAuth => {
      // The event stuff here is only done because when sign in is triggered on the same page
      // it won't cause a rerender.
      // if the authentication status is changed it won't cause a rerender, only if it's on a different page.
      // That's why I'm adding the dispatch event to force trigger.
      var event = document.createEvent("Event");
      event.initEvent("storage", true, true);

      if(userAuth == null){
        localStorage.setItem('User', 'N/A');
        window.dispatchEvent(event);
        console.log("UserProvider User is N/A");
        this.setState({user: null});
      }
      else {
        localStorage.setItem('User',userAuth.displayName);
        window.dispatchEvent(event);
        this.setState({user:userAuth.displayName});
      } 
    });
  }

  render() {
    return (
      <UserContext.Provider value={this.state.user}>
        {this.props.children}
      </UserContext.Provider>
    );
  }
}
export default UserProvider;