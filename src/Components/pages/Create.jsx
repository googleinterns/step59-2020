import React, {Component} from 'react';
import {Link,Redirect} from 'react-router-dom';
import {db,fire,auth,firestore} from '../../firebase.js';
// import Config from '../pages/Config.jsx';

class Create extends Component {

    constructor(props) {
        super(props);
        let userAuth = null;
        if( localStorage.getItem('User'))
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
        if( localStorage.getItem('User'))
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
                {/*{pagetype === 'not-created' &&*/}
                {/*   <Config updatePageType ={this.updatePageType.bind(this)}/>*/}
                {/*}*/}

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