import React, {Component,Fragment} from 'react';
import {Text} from 'react-native';
import Button from '@material-ui/core/Button';
import {Typography,Card} from '@material-ui/core';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import {Helmet} from 'react-helmet';
import {Link} from 'react-router-dom';
import * as styles from '../styles/Home.jsx';
import Instructions from '../quiz/Instructions.jsx'

class Home extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            user : 'N/A',
            displayInstruction: false,
        };
    }
    
    componentDidMount() 
    {
        let userAuth = null;
        if(localStorage.getItem('User') == 'N/A')
            userAuth = 'N/A'
        else
            userAuth = localStorage.getItem('User')
        window.addEventListener("storage", e => {
            let change = localStorage.getItem('User')
            this.setState({user: change});
        });
        this.setState({user : userAuth});
    }

    toggleInstructions() {
        this.setState({
            displayInstructions: !this.state.displayInstructions
        })
    }

    render() {

        const {user,displayInstructions} = this.state;
        return (
            <Fragment>
                <Helmet><title> Toohak </title></Helmet>

                <body style={styles.body}>

                    {displayInstructions &&
                    <Instructions
                        info='generic'
                        closeInstructions={this.toggleInstructions.bind(this)}
                    />
                    }

                    <div>
                        <Text style={styles.h1}> Toohak Stock Game! </Text>
                        <p> Toohak game is a stocks game that let's the user simulate investing in stocks in a quick,
                        game based format. It is essentially Kahoot, but instead of answering questions you are buying
                        stocks! </p>
                    </div>


                    <div style={styles.displayAlign}>
                        <section>

                            <div>
                                <Button style={styles.buttonStyle} onClick={this.toggleInstructions.bind(this)}>
                                    Instructions
                                </Button>

                            </div>

                            {user !== 'N/A' &&
                                <div>
                                    <div>
                                        <Link to='/play' style={{textDecoration: 'none'}}>
                                            <Button className="button" style={styles.buttonStyle}>
                                                Join a game
                                            </Button>
                                        </Link>

                                        <Link to='/auth/signOut' style={{textDecoration: 'none'}}>
                                            <Button className="button" style={styles.buttonStyle}>
                                                Logout
                                            </Button>
                                        </Link>
                                    </div>
                                    <div>
                                        <Link to='/host' style={{textDecoration: 'none'}}>
                                            <Button className="button" style={styles.buttonStyle}>
                                                Host a game
                                            </Button>
                                        </Link>

                                        <Link to='/create' style={{textDecoration: 'none'}}>
                                            < Button className="button" style={styles.buttonStyle}>
                                                Create a game
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            }

                            {user === 'N/A' &&
                                <div>
                                    <div>
                                        <Link to='/play' style={{textDecoration: 'none'}}>
                                            <Button className="button" style={styles.buttonStyle}>
                                                Join a game
                                            </Button>
                                        </Link>

                                        <Link to='/auth/signIn' style={{textDecoration: 'none'}}>
                                            <Button className="button" style={styles.buttonStyle}>
                                                Log in with Google
                                            </Button>
                                        </Link>

                                    </div>
                                    <div>
                                        < Button className="button" style={styles.disabledButtonStyle} disabled>
                                            Host a game
                                        </Button>

                                        < Button className="button" style={styles.disabledButtonStyle} disabled>
                                            Create a game
                                        </Button>
                                    </div>
                                </div>

                            }
                        </section>
                    </div>
                </body>
            </Fragment>
        )
    }
}

export default Home;