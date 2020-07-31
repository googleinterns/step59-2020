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
                        <div style="font-size:0.7em">
                            <h1> you are looking at the technical analysis indicators </h1>
                            <h2> There are 4 graphs. </h2>
                            <ul>
                              <li><h3>Stock Graph</h3> </li>
                              <li>Green Line:A graph of the price.</li>
                              <li>Red Line: A 10 day EMA average, 10 Day EMA:Exponential Moving Average is the average of the last 10 days price weighted towards recent data. It is useful for gauging the strength of the trend of a price.  </li>
                              <li>May not be showing fully: Yellow: A 50 day SMA. 50  Day moving averagee: The 50 day moving average non weighted. You should look for stocks with prices above their 50 day moving averages. Can be useful in identifying trends</li>
                              <li>May not be showing fully: Orange: A 200 day SMA. 200  Day moving averagee: The 200 day moving average non weighted. You should look for stocks with prices above their 50 day moving averages. Can be useful in identifying trends</li>
                            </ul>
                            <ul>
                              <li><h3>ADX Graph</h3> </li>
                              <li>Black Line:The adx value. Used to identify the strength of the trend. </li>
                              <li>ADX values less than 25 indicate a weak or absent trend. </li>
                              <li> ADX values greater than 25 but lower than 50 indicate a strong trend.</li>
                              <li> ADX values greater than 50 but less than 75 indicate a very strong trend.</li>
                              <li> ADX values greater than 75 indicate an extremely strong trend</li>
                              <li>Green Line: + DMI</li>
                              <li>Red Line: -DMI</li>
                              <li>When the +DMI is above the -DMI, prices are moving up, and ADX measures the strength of the uptrend. When the -DMI is above the +DMI, prices are moving down, and ADX measures the strength of the downtrend. </li>
                            </ul>
                            <ul>
                              <li><h3>MACD Graph</h3> </li>
                              <li>Green Line:The MACD value. </li>
                              <li>Yellow Liine: The Signal line</li>
                              <li>MACD triggers technical signals when it crosses above (to buy) or below (to sell) its signal line. </li>
                              <li>The speed of crossovers is also taken as a signal of a market is overbought or oversold.</li>
                              <li>MACD helps investors understand whether the bullish or bearish movement in the price is strengthening or weakening.</li>
                            </ul>
                            <ul>
                                <li><h3>RSi Graph </h3> </li>
                                <li> Black Line: THe RSI value  </li>
                                <li>The Rsi value is used to check if a stock is overbought or oversold. Extended stays with value of the RSI over 70 may indicate it is overextended in buy territory which may indicate a reversal coming soon. </li>
                                <li> RSI values under 30 may indicate underbought stocks. Note. Underbought stocks could be readying for a crash or a reversal attempt to buy stocks closer to 70 but not over it,</li>
                            </ul>
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
