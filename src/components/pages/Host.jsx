import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import {db,fire,fval} from '../../firebase.js';
import {addUser,advanceDay,getUserData,getUserRef,getRoomData,getRoomRef,getNumDays} from '../firebase-access.jsx';

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
                var numDays = getNumDays(roomId);
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

    advanceQuestionLocalAndServer() {
        const {roomId} = this.state;
        const that = this;
        this.setState({
            questionNum: that.state.questionNum + 1,
        });
        advanceDay(roomId);
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
                <div className="page-container host-page">
                    <FormControl>
                        <TextField label="Game PIN" name="Game ID" value={roomId}
                                   onChange={this.handleChange('roomId')}/>
                    </FormControl>
                    <FormControl>
                        <TextField label="Password" type="password" name="password" value={password}
                                   onChange={this.handleChange('password')}/>
                    </FormControl>
                    <Button onClick={() => this.joinGame()} variant="contained">Host</Button>
                </div>
            )
        } else if (authenticated === 'yes') {
            if (phase === 'connection') {
                return (
                    <div className="page-container host-page">
                        <p> Users List </p>
                        <ul id="user-list">
                            {users.map(user => (
                                <li >{user.nickname}</li>
                            ))
                            }
                        </ul>
                        <button onClick={() => this.startGame()}>start stonks game</button>
                    </div>
                )
            } else if (phase === 'question') {
                return (
                    <div className="page-container host-page">
                        <span>Current question: </span>
                        {' '}
                        <span className="dynamic-text">{questionNum}</span>
                        <p> Users List </p>
                        <ul id="user-list">
                            {users.map(user => (
                                <li key={user.id}>{user.nickname}</li>
                            ))
                            }
                        </ul>
                        <button onClick={() => this.advanceQuestionLocalAndServer()}>next question</button>
                    </div>
                )
            } else if (phase === 'ended') {

            }
        }
    }
}

export default Host;