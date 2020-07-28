import React, {Component,Fragment} from 'react';
import {Helmet} from 'react-helmet';
import {Link} from 'react-router-dom';

class Home extends Component {
    
    constructor(props) {
        super(props);
        this.state ={user : 'N/A'};
    }
    
    componentDidMount() 
    {
        let userAuth = null;
        if( localStorage.getItem('User') == 'N/A')
            userAuth = 'N/A'
        else
            userAuth = localStorage.getItem('User')
        window.addEventListener("storage", e =>{
            let change = localStorage.getItem('User')
            this.setState({ user: change});
        });
        this.setState({user:userAuth})
        const {gameId} = this.state;
    }

    getAuth = () => {
        const user = this.state.user;
        let auth = [];
        if(user == 'N/A') {
            let link =<div className="login-button-container"><p><Link to="/auth/signIn">Login</Link></p></div> ;
            auth.push(link);
            link = <div className="signup-button-container"><p><Link to="/auth/signUp">Sign Up</Link></p></div>;
            auth.push(link);
        }
        else {
            let link = <Link to ="/auth/signOut">SignOut</Link>;
            auth.push(link);
        }
        return auth;
    }
    

    render() {

        return (
            <Fragment>
                <Helmet><title> toohak stonks </title></Helmet>
                <div id="home">
                    <section>
                        <div></div>
                        <h1>toohak app   </h1>
                        <div className="play-button-container">
                           <p><Link to="/play">Play</Link></p> 
                        </div>
                        {this.state.user !== 'N/A' &&
                        <div className ="locked">
                            <div className="host-button-container">
                                <p><Link to="/host">Host a room</Link></p>
                            </div>
                            <div className="create-button-container">
                                <p><Link to="/create">Create a room</Link></p>
                            </div>
                        </div>
                        }
                        <div className="auth-container">
                            {this.getAuth()}
                        </div>
                    </section>
                </div>
            </Fragment>
        )
    }
}
export default Home;