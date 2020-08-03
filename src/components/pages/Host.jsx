import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import {db,fire,fval} from '../../firebase.js';
import {addUser,advanceDay,getUserData,getUserRef,getRoomData,getRoomRef,getNumDays} from '../firebase-access.jsx';
import * as styles from '../styles/HostStyle.jsx';
import {NavLink} from "react-router-dom";
import HomeButton from '../tools/HomeButton';

/*
Possible phases:
- not-joined : display joining game
- connection : players joining phase
- question : displaying questions phase
- between-question : display a page between questions
- leaderboards : display the winners at the end
- ended : the game has ended
 */

/*
Game structure:
- phase: (see above)
- startingMoney: contains starting value for users
- day_index: which date is used
- password: password
- symbols: array of symbols
* User collection

 */

// TODO @Jack make sure end game occurs on the right question index
class Host extends Component {

    constructor(props) {
        super(props);
        this.state = {
            phase: 'not-joined',
            questionNum: 0,
            roomId: null,
            password: '',
            authenticated: 'no',
            listening: 'no',
            users: [],
            leaders: null,
        }
        this.userExists = this.userExists.bind(this);
        this.updateUsers = this.updateUsers.bind(this);
        this.joinGame = this.joinGame.bind(this);
        this.updatePhase = this.updatePhase.bind(this);
        this.initGameListener = this.initGameListener.bind(this);
        this.restartGame = this.restartGame.bind(this);
        this.quitGame = this.quitGame.bind(this);
        this.endGame = this.endGame.bind(this);
        this.advanceQuestionLocalAndServer = this.advanceQuestionLocalAndServer.bind(this);
    }

    componentDidMount() {
        const {roomId} = this.state;
    }

    componentDidChange() {
    }

    handleChangeSelect = (event) => {
        this.setState({[event.target.name]:event.target.value});
    };

    handleChange = name => (event) => {
        this.setState({
            [name]:event.target.value,
        });
    }

    userExists(userId) {
        const {users} = this.state;
        var exists = false;
        Array.from(users).forEach(function(item) {
            if (item.userId == userId) {
                exists = true;
            }
        });
        return exists;
    }

    updatePhase(gameupdate) {
        const {roomId} = this.state;
        this.setState({
            phase: gameupdate,
        });
        db.collection('Rooms').doc(roomId).update({
            phase: gameupdate,
        });
    }

    restartGame() {

    }

    quitGame() {
        const {toggleHeader} = this.props;
        this.updateGame({phase:null});
    }

    endGame(){
        this.updateGame({phase:'final_result'});
    }

    updateUsers() {
        const {password,roomId} = this.state;
        const that = this;
        var roomRef = db.collection('Rooms').doc(roomId);
        roomRef.collection('users').get().then((snapshot) => {
            snapshot.docs.forEach(user => {
                var userData = user.data();
                const userExistsBool = that.userExists(userData.userId);
                if (userExistsBool == false) {
                    that.setState({
                        users: that.state.users.concat([userData]),
                    })
                }
            });
        });
    }

    async joinGame() {
        const {password,roomId} = this.state;
        const that = this;
        var roomRef = getRoomRef(roomId);
        console.log(roomRef);
        var roomData = await getRoomData(roomId);
        console.log(roomData);
        if (roomData) {
            if (roomData.password === password && (roomData.phase === 'no-host' || roomData.phase === 'question' || roomData.phase === 'connection')) {
                that.setState({
                    authenticated: 'yes',
                    phase: (roomData.phase === 'no-host' ? 'connection' : roomData.phase),
                });
                roomRef.update({
                    phase: this.state.phase
                })
                await addUser(roomId,"dummy user");
                await that.updateUsers();
                await that.initGameListener();
                var numDays = await getNumDays(roomId);
                that.setState({
                    numDays: numDays,
                })
            } else {
                alert("wrong password");
            }
        } else {
            alert("room " + roomId + " does not exist");
        }
    }

    initGameListener() {
        const {roomId} = this.state;
        var roomRef = db.collection('Rooms').doc(roomId);
        const that = this;
        roomRef.collection('users').onSnapshot(function(roomData) {
            that.updateUsers();
        });
    }

    startGame() {
        const that = this;
        that.updatePhase('question');
    }

    async advanceQuestionLocalAndServer() {
        const {roomId,questionNum,numDays} = this.state;
        const that = this;
        this.setState({
            questionNum: that.state.questionNum + 1,
        });
        if (questionNum + 2 >= numDays)
            this.setState({
                phase: 'ended',
            });
        await advanceDay(roomId);
    }

    render() {
        const {roomId, password, phase, authenticated, users, questionNum} = this.state;
        const gameFunctions = {
            update: this.updateGame,
            restart: this.restartGame,
            end: this.endGame,
            quit: this.quitGame,
        }
        if (authenticated === 'no') {
            return (
                <body style={styles.body} className="page-container host-page">
                    <HomeButton/>
                    <div style={{position:'absolute',left:'50%',top:'40%',transform:'translate(-50%,-50%)',textAlign:'center'}}>
                        <h1 style={{opacity:'80%'}}> Enter your PIN and password (if applicable) to host a game! </h1>
                        <div style={styles.box}>
                        <FormControl style={{margin:'1rem 1rem 1rem 1rem'}}>
                            <TextField label="Game PIN" name="Game ID" value={roomId}
                                       onChange={this.handleChange('roomId')}/>
                        </FormControl>
                        <FormControl style={{margin:'1rem 1rem 1rem 1rem'}}>
                            <TextField label="Password" type="password" name="password" value={password}
                                       onChange={this.handleChange('password')}/>
                        </FormControl>
                        <Button  style={styles.buttonStyle} onClick={() => this.joinGame()} variant="contained">Host</Button>
                        </div>
                    </div>
                </body>
            )
        } else if (authenticated === 'yes') {
            if (phase === 'connection') {
                return (
                    <body style={styles.body}>
                    <NavLink to="/" style={{textDecoration: 'none'}}>
                        <Button style={styles.buttonStyle}>
                            Disconnect
                        </Button>
                    </NavLink>
                    <body style={styles.body}>
                        <h2 style={{textAlign:'center'}}>Room ID: {roomId}</h2>
                        <div style={styles.box} className="page-container host-page">
                            <h3>Users List:</h3>
                        
                            <div style={{textAlign:'center'}}>
                                {users.map(user => (
                                    <p style={styles.smallFont}>{user.nickname} - ${user.net_worth}</p>
                                ))
                                }
                                <button style={styles.buttonStyle} onClick={() => this.startGame()}>START GAME</button>
                            </div>
                        </div>
                    </body>
                    </body>
                )
            } else if (phase === 'question') {
                return (
                    <body style={styles.body}>
                        <NavLink to="/" style={{textDecoration: 'none'}}>
                            <Button style={styles.buttonStyle}>
                                Disconnect
                            </Button>
                        </NavLink>
                    <div style={styles.box} className="page-container host-page">
                        <span>Current question: </span>
                        {' '}
                        <span className="dynamic-text">{questionNum + 1}</span>
                        <h3> Users List </h3>
                        {users.map(user => (
                            <p style={styles.smallFont}>{user.nickname} - ${user.net_worth}</p>
                        ))
                        }
                        <button style={styles.buttonStyle} onClick={() => this.advanceQuestionLocalAndServer()}>NEXT QUESTION</button>
                    </div>
                    </body>
                )
            } else if (phase === 'ended') {
                return (
                    <body style={styles.body} className="page-container host-page">
                        <HomeButton/>
                        <div style={styles.box}>
                            <h1> Game has ended </h1>
                        </div>
                    </body>
                )
            }
        }
    }
}

export default Host;
