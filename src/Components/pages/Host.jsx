import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import {Quiz} from '../quiz/host/Quiz.js';
import {db,fire} from '../../firebase.js';

function fetchGame(gameId, callback) {
    return fire.database().ref('/Rooms').orderByChild('gameId').equalTo(gameId).once('value',callback);
}

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
- starting_money: contains starting value for users
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
            gameId: null,
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
    }

    componentDidMount() {
        const {gameId} = this.state;
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
        this.state.users.array.forEach(function(item,index) {
            if (item.id == userId) return true;
        });
        return false;
    }

    updatePhase(gameupdate) {
        const {gameId} = this.state;
        this.setState({
            phase: gameupdate,
        })
        db.collection('Rooms').doc(gameId).update({
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

    addDummyUser(nickname) {
        const {gameId} = this.state;
        const gameRef = db.collection('Rooms').doc(gameId);
        const userRef = gameRef.collection('users').doc(nickname);

        const gameInfo = {
            nickname: nickname,
            investments: [],
            personal_value: -1,
            money_left: -1,
            gains: 0,
            losses: 0,
        }
        userRef.set(gameInfo);
    }

    updateUsers() {
        const {password,gameId} = this.state;
        const that = this;
        var gameRef = db.collection('Rooms').doc(gameId);
        gameRef.collection('users').get().then((snapshot) => {
            snapshot.docs.forEach(user => {
                if (!that.userExists(user.id)) {
                    console.log("adding new user");
                    var newUser = user.data();
                    that.setState({
                        users: that.state.users.concat([newUser]),
                    })
                }
            });
        });
    }

    joinGame() {
        const {password,gameId} = this.state;
        const that = this;
        var gameRef = db.collection('Rooms').doc(gameId);
        gameRef.get().then(function(gameData) {
            if (gameData.exists) {
                var gameInfo = gameData.data();
                if (gameInfo.password === password && gameInfo.phase === 'no-host') {
                    that.setState({
                        authenticated: 'yes',
                        phase: 'connection',
                    });

                    that.addDummyUser('dummy user');
                    that.updateUsers();
                    that.initGameListener();
                    gameRef.update({
                        phase: 'connection',
                    })
                } else {
                    console.log("wrong password");
                }
            } else {
                console.log("room " + gameId + " does not exist");
            }
        });
    }

    initGameListener() {
        const {gameId} = this.state;
        var gameRef = db.collection('Rooms').doc(gameId);
        const that = this;

        gameRef.onSnapshot(function(gameData) {
            that.updateUsers();
        });
    }

    startGame() {
        const that = this;
        that.updatePhase('question');
    }

    advanceQuestion() {
        const {gameId} = this.state;
        const that = this;
        this.setState({
            questionNum: that.state.questionNum + 1,
        });
        db.collection('Rooms').doc(gameId).update({
            date_index: that.state.questionNum,
        });
    }

    /*
    Possible phases:
    - not-joined : display joining game
    - connection : players joining phase
    - question : displaying questions phase
    - between-question : display a page between questions
    - leaderboards : display the winners at the end
    - ended : the game has ended
     */
    render() {
        const {gameId, password, phase, authenticated, users, questionNum} = this.state;
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
                        <TextField label="Game PIN" name="Game ID" value={gameId}
                                   onChange={this.handleChange('gameId')}/>
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
                        <button onClick={() => this.advanceQuestion()}>next question</button>
                    </div>
                )
            }
        }
    }
}

export default Host;