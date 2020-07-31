import React, {useState,useContext,Fragment} from "react";
import {Helmet} from "react-helmet";
import { Link } from "@reach/router";
import { signOut } from "../../firebase";
import SignIn from "./SignIn"
import { useHistory } from "react-router"
import {Text} from 'react-native';
import * as styles from '../styles/SignInStyle.jsx';
import Button from "@material-ui/core/Button";

const SignOut = () => {
    const [error, setError] = useState(null);
    const history = useHistory();
    let user = 'N/A';
    if(localStorage.getItem('User') == null) {
        localStorage.setItem('User', 'N/A');
    }
    else {
        user = localStorage.getItem('User');
    }

    const handleSignOut = () => {
        signOut();
        history.push({
            pathname:  "/",
        });
    }
    const handleHome = () =>{
        history.push({
            pathname:  "/",
        });
    }

    return (
    (user != 'N/A')  
    ?
    <Fragment>
        <Helmet><title> Sign Out </title></Helmet>
        <body style={styles.body}>
            <div style={styles.box}>
                <Text style={styles.h1}> Sign Out </Text>
            </div>
            <div>
            {error !== null && <div>{error}</div>}
            <p>
                <Button to="/" style={styles.buttonStyle} onClick={() => { handleSignOut() }} className="text-blue-500 hover:text-blue-600">
                Sign Out
                </Button>{" "}
                <br />{" "}
            </p>
            <p>
                <Link to="/" onClick={() => { handleHome() }} className="text-blue-500 hover:text-blue-600">
                Home
                </Link>{" "}
                <br />{" "}
            </p>
            </div>
        </body>
    </Fragment>
    :
    <SignIn/>
    );
};
export default SignOut;