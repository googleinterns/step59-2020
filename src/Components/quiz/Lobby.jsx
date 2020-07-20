import React, { Component, Fragment } from 'react';
import {Link} from 'react-router-dom';
import {Helmet} from 'react-helmet';
import {getUserID} from '../../firebase';
import {firestore} from '../../firebase';
import {setUpRoom} from '../firestore-access';

class GameLobby extends React.Component
{
    constructor (props) {
        super(props);
        this.state = {
            roomID: null,
        }
    }
    async componentDidMount() {
        this.setState({
            roomID: await setUpRoom(firestore,1,3,getUserID())
        })
    }

    render () {
        return (
        <Fragment>
            <Helmet><title>Game Lobby</title></Helmet>
            <div className="room code container">
                <p>Room code</p>
                <p>{this.state.roomID}</p>
            </div>
            <div className="lobby members list">
                <p>room members</p>
                <ul>
                    <li>Aneesha</li>
                    <li>John</li>
                    <li>Jack</li>
                    <li>Yeet</li>
                </ul>
            </div>
            <Link to={{
                pathname:"/play/round",
                state: {
                    roomID: this.state.roomID
                }
            }}> start game </Link>
        </Fragment>
        )
    }
}

export default GameLobby;