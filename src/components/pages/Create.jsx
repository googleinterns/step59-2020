import React, {Component} from 'react';
import {Link,Redirect} from 'react-router-dom';
import {db,fire,auth,firestore} from '../../firebase.js';
import Config from '../quiz/create/Config.jsx';
import {Helmet} from "react-helmet";
import {CopyToClipboard} from 'react-copy-to-clipboard';

import {Text} from 'react-native';
import * as styles from '../styles/CreateStyle.jsx';
import Button from "@material-ui/core/Button";

class Create extends Component {

    constructor(props) {
        super(props);
        let userAuth = null;
        if(localStorage.getItem('User'))
            userAuth = localStorage.getItem('User');
        else
            userAuth = 'N/A'

        this.state = {
            authenticated: userAuth,
            pagetype: 'not-created',
            gameId: '',
        }
    }
    
    componentDidMount() {
        let userAuth = null;
        if(localStorage.getItem('User'))
            userAuth = localStorage.getItem('User');
        else
            userAuth = 'N/A';

        this.setState({authenticated : userAuth});

        window.addEventListener("storage", e => {
            let change = localStorage.getItem('User');
            this.setState({ authenticated: change});
        });
        const {gameId} = this.state;
    }

    updatePageType = (status,_gameId) => {
        this.setState({
            pagetype: status,
            gameId: _gameId,
        })
    }

    render() {
        const {authenticated,pagetype,gameId} = this.state;
        if (authenticated == 'N/A') 
            return <Redirect to="/" />   
        return (
            <div className="app-page create-page">
                <Helmet><title>Create Room</title></Helmet>
                {pagetype === 'not-created' &&
                   <Config updatePageType={this.updatePageType.bind(this)}/>
                }

                {pagetype === 'created' && (
                    <div>
                        <body style={styles.body}>
                            <div style={styles.box}>
                                <Text style={styles.h1}>Successfully created room!</Text>
                            </div>
                            <br/>

                            <label style={styles.gamePIN}>Game PIN: </label>
                            <span className="dynamic-text">{gameId}</span>

                            <CopyToClipboard text={gameId}
                                onCopy={() => alert('Copied to clipboard!')}
                            >
                                <button style={styles.copyButtonStyle}>Copy</button>
                            </CopyToClipboard>
                            <br/>

                            <p>Click the Copy button above to copy the Game PIN to your clipboard.</p>
                            <p>Then, click the button below to host the game!</p>
                            <Link to='/host' style={{textDecoration: 'none'}}>
                                <Button style={styles.buttonStyle} to="/host">Host</Button>
                            </Link>
                            
                        </body>
                    </div>
                )}
            </div>
        );
    }
}
export default Create;