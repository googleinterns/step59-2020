import React, {Component,Fragment} from 'react';
import {Helmet} from 'react-helmet';
import {Link, withRouter} from 'react-router-dom';
import Button from '@material-ui/core/Button';
import * as styles from '../styles/InstructionsStyle.jsx';

/*
* Renders instructions as jsx and uses conditional rendering to only render the
* specified type of instruction.
*
* Can easily be rendered in different pages by passing in the type
* of information to display as props.
*/

class Instructions extends Component {
    /*
        Prop property will be all given under 'info'
        props values:
            - 'generic' -> generic stuff
            - 'ta' -> technical analysis information stuff
            - 'host' -> for hosts to read (in hosts page)
            - 'play' -> for players to read (in play page)
            - 'create' -> for creating the room
     */

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    // TODO: (@johnkongtcheu) add technical indicator instructions
    render() {
        const {info} = this.props;
        return (
            <Fragment>
                <div style={styles.popup}>
                    <div style={styles.popup_inner}>
                        {info === 'generic' &&
                            <div>
                                <h1> What is Toohak? </h1>
                                <p> Toohak is an investing game. You essentially go through Kahoot questions except invest in
                                    stocks
                                    each round. </p>

                                <h1> How can I play it? </h1>
                                <h2> Well, there's two things you can do, join a room or host a room (or both) </h2>
                                <h3> Joining a room </h3>
                                <p> To join a room, click "Play" on the home page and enter the room code provided by the host
                                    to
                                    join </p>
                                <h3> Hosting a room </h3>
                                <p> To host a room, you need to first be logged in with an account. </p>
                                <p> On the homepage, click "login" to login with your Google account. </p>
                                <p> Then, go to "Create", and use the options available there to create a hostable game </p>
                                <p> It will then take you to host where you can host the game and let others join. </p>
                            </div>
                        }

                        {info === 'play' &&
                            <div>
                                <h1>This is the play page</h1>
                                <h2>There are a couple of things you can see and can do to invest</h2>
                                <h3>You can see</h3>
                                <p>- Your current net worth, which is your cash + the value of your shares</p>
                                <p>- Your current cash, which you can buy shares with</p>
                                <p>After you select a symbol from the dropdown, you can see</p>
                                <p>- How many shares of that symbol you have</p>
                                <p>- How much each share costs</p>
                                <p>- Graphs that have multiple technical indicators for the symbol</p>
                                <p>- A box to enter the number of shares you want to buy or sell</p>
                                <p>- The option to buy or sell a certain number of shares</p>
                                <h2> Progression </h2>
                                <p>The way time works in this game is that the host has predefined "stages"</p>
                                <p>In each of these stages, you can buy or sell shares at a given price</p>
                                <p>Whoever has the largest net worth after the last stage wins</p>
                                <h2> Stage Control </h2>
                                <p> For now, stage control is entirely decided by the host. So once they click "next stage"
                                    it will be reflected across all players</p>
                            </div>
                        }

                        {info === 'ta' &&
                            <div>
                                <h1> you are looking at the technical analysis indicators </h1>
                                <h2> more explanations to be added soon </h2>
                            </div>
                        }

                    </div>
                <div> <Button style={styles.buttonStyle} onClick={this.props.closeInstructions}> Close </Button> </div>

                </div>
            </Fragment>
        )
    }
}

export default Instructions;
