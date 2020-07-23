import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {db, fire, auth, firestore} from '../../firebase.js';
import Config from '../pages/Config.jsx';


class Create extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pagetype: 'not-created',
            gameId: '',
        }
    }
    
    componentDidMount() {
    }

    updatePageType = (status,_gameId) => {
        this.setState({
            pagetype: status,
            gameId: _gameId,
        })
    }

    render() {
        console.log('render called');
        const {pagetype,gameId} = this.state;
        console.log(pagetype);
        console.log(gameId);
        return (

            <div className="app-page create-page">
                {pagetype === 'not-created' &&
                   <Config updatePageType ={this.updatePageType.bind(this)}/>
                }

                {pagetype === 'created' && (
                    <div>
                        <span>Created game PIN: </span>
                        {' '}
                        <span className="dynamic-text">{gameId}</span>
                        {' '}
                        <Link to="/host">Copy this ID and use it host the game</Link>
                    </div>
                )}
            </div>
        );
    }
}

export default Create;