import React, {Component,Fragment} from 'react';
import {db,fire} from '../../firebase.js';
import {Quiz} from '../quiz/play/Quiz.jsx';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import {addUser,getCharts,getSymbols,getDayIndex,getPrices,getUserData,getUserRef,makeInvestment,
    getCash,getShares,getRoomData,getRoomRef,getNetWorth,updateNetWorth,getLeaders} from '../firebase-access.jsx';
import {Helmet} from 'react-helmet';
import {isRedirect} from "@reach/router";
import * as styles from "../styles/PlayStyle";
import {NavLink} from "react-router-dom";
import HomeButton from '../tools/HomeButton';

class Play extends Component {

    /*
    Possible phases:
    - not-joined : display joining game
    - connection : players joining phase
    - question : displaying questions phase
    - between-question : display a page between questions
    - leaderboards : display the winners at the end
    - ended : the game has ended
     */

    constructor (props) {
        super(props);
        this.state = {
            // static properties
            roomId: null,
            password: '',
            userId: '',
            nickname: '',
            numSymbols: 0,

            // frequently updated properties
            phase: 'not-joined',
            questionNum: 0,
            chartURLs: null,
            net_worth: 0,
            money_left: 0,
            curShares: [],
            prices: [],
        };
        this.updatePortfolio = this.updatePortfolio.bind(this);
        this.joinGame = this.joinGame.bind(this);
        this.initGameListener = this.initGameListener.bind(this);
    }

    handleChangeSelect = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    };

    handleChange = name => (event) => {
        this.setState({
            [name]: event.target.value,
        });
    };

    async updatePortfolio() {
        const {roomId,userId} = this.state;
        await updateNetWorth(roomId,userId);
        var roomData = await getRoomData(roomId);
        var userData = await getUserData(roomId,userId);
        var chartUrls = await getCharts(roomId,roomData.day_index);
        var prices = await getPrices(roomId,roomData.day_index);

        this.setState({
            questionNum: roomData.day_index,
            chartUrls: chartUrls,
            prices: prices,
            net_worth: userData.net_worth,
            money_left: userData.money_left,
            curShares: userData.curShares,
        });
    }

    async initGameListener() {
        const that = this;
        const {questionNum,roomId,phase,nickname,userId} = this.state;
        const roomRef = db.collection('Rooms').doc(roomId);
        const userRef = roomRef.collection('users').doc(userId);
        roomRef.onSnapshot(async function(roomDoc) {
            const roomData = roomDoc.data();
            if (questionNum != roomData.day_index || phase != roomData.phase) {
                await that.updatePortfolio();
                that.setState({
                    phase: roomData.phase,
                });
                var leaders = await getLeaders(roomId);
                that.setState({
                    leaders: leaders,
                })
            }
        });
        userRef.onSnapshot(async function(userDoc) {
            await that.updatePortfolio();
        });
    }

    async joinGame() {
        const {roomId,password,nickname} = this.state;
        const that = this;
        const roomRef = db.collection('Rooms').doc(roomId);
        roomRef.get().then(async function(roomData) {
            if (roomData.exists) {
                var roomInfo = roomData.data();
                if (roomInfo.password === password && (roomInfo.phase === 'connection' || roomInfo.phase === 'question')) {
                    var uniqueUserId = await addUser(roomId,nickname);
                    that.setState({
                        phase: 'connection',
                        userId: uniqueUserId,
                        numSymbols: roomInfo.symbols.length,
                        net_worth: roomInfo.startingMoney,
                        money_left: roomInfo.startingMoney,
                    });
                    await that.initGameListener();
                    await that.updatePortfolio();
                } else if (roomInfo.password === password) {
                    alert("room not being hosted yet");
                } else if (roomInfo.phase === 'connection') {
                    alert("incorrect password");
                } else {
                    alert("room does not exist");
                }
            } else {
                alert("room " + roomId + " does not exist");
            }
        });
    }

    render () {
        const {phase,password,nickname,playerKey,questionNum,roomId,isRedirected,leaders} = this.state;
        if (phase === 'not-joined') {
            return (
                <body style={styles.body} className="page-container host-page">
                    <HomeButton/>

                    <div style={{position:'absolute',left:'50%',top:'40%',transform:'translate(-50%,-50%)',textAlign:'center'}}>
                        <h1 style={{opacity:'80%'}}> Enter your nickname, room PIN and password (if applicable) to join a game! </h1>
                        <div style={styles.box}>
                            <FormControl style={{margin:'1rem 1rem 1rem 1rem'}}>
                                <TextField label="Nickname" name="nickname" value={nickname}
                                           onChange={this.handleChange('nickname')}/>
                            </FormControl>
                            <FormControl style={{margin:'1rem 1rem 1rem 1rem'}}>
                                <TextField label="Game PIN" name="Game ID" value={roomId}
                                           onChange={this.handleChange('roomId')}/>
                            </FormControl>
                            <FormControl style={{margin:'1rem 1rem 1rem 1rem'}}>
                                <TextField label="Password" type="password" name="password" value={password}
                                           onChange={this.handleChange('password')}/>
                            </FormControl>
                            <Button  style={styles.buttonStyle} onClick={() => this.joinGame()} variant="contained">Join game</Button>
                        </div>
                    </div>
                </body>
            )
        } else if (phase === 'connection') {
            return (
                <body style={styles.body}>
                    <HomeButton/>
                    <div style={{textAlign:'center'}}>
                        <h3> Connected. Please wait for host to start game. </h3>
                    </div>
                    
                </body>
            )
        } else if (phase === 'question') {
            return (
                <div style={styles.back}>
                    <NavLink to="/" style={{textDecoration: 'none'}}>
                        <Button style={styles.buttonStyle}>
                            Disconnect
                        </Button>
                    </NavLink>
                    <Quiz {...this.state}></Quiz>
                </div>
            )
        } else if (phase === 'ended') {
            return (
                <body style={styles.body}>
                    <HomeButton/>
                <div style={styles.box}>
                    <h1 style={{textAlign:'center'}}> Game has ended </h1>
                    <h2> Here were the winners: </h2>
                    <ol id="user-list">
                        {leaders.map(user => (
                            <li key={user.id}><b>{user.nickname}</b>
                            <p>Net worth: ${user.net_worth}</p></li>
                        ))
                        }
                    </ol>
                </div>
                </body>
            )
        }
    }
}

export default Play;