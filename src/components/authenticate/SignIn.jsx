import React, {useState,useContext,Fragment} from "react";
import {Helmet} from "react-helmet";
import { Link } from "@reach/router";
import { signInWithGoogle } from "../../firebase";
import SignOut from "./SignOut";
import { useHistory } from "react-router";
import {Text} from 'react-native';
import * as styles from '../styles/SignInStyle.jsx';
import Button from "@material-ui/core/Button";
import HomeButton from '../tools/HomeButton';

const SignIn = () => {
    const [error, setError] = useState(null);
    const history = useHistory();
    let user = 'N/A'

    if(localStorage.getItem('User') == null) {
        localStorage.setItem('User', 'N/A');
    }
    else {
        user = localStorage.getItem('User');
    }
    const handleSignIn = () => {
        signInWithGoogle();
        // This is to fix that weird bug where the link sometimes doesn't work
        history.push({
            pathname:  "/",
        })
    }
    const handleHome = () =>{
      history.push({
          pathname:  "/",
      })
    }
  //TODO: We need to make a separate users collections and a profile page. 
  //The users collection should store highest score, possibly friends etc. 
  //This page needs to have it set up it creates a user in the room collection on sign in
  return (
    (user == 'N/A')  
    ?
    <Fragment>
    <Helmet><title> Sign In </title></Helmet>
    <body style={styles.body}>
        <HomeButton/>
        <div style={styles.box}>
          <Text style={styles.h1}> Sign In </Text>
        </div>
        <div style={{position:'absolute',left:'50%',top:'40%',transform:'translate(-50%,-50%)',textAlign:'center'}}>
          {error !== null && <div>{error}</div>}

          <Button to="/" style={styles.buttonStyle} onClick={() => { handleSignIn() }} className="text-blue-500 hover:text-blue-600">
            Sign in With Google
          </Button>
        </div>
      </body>
    </Fragment>
    :
    <SignOut/>
  );
};
export default SignIn;
