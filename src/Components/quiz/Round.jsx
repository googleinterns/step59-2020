import React, {Component,Fragment} from 'react';
import {Helmet} from 'react-helmet';

import {firestore} from '../../firebase';
import {getUserID} from '../../firebase';

import {setUpRoom} from '../firestore-access';
import {getCurrentPrice} from '../firestore-access';
import {advanceDay} from '../firestore-access';
import {getDate} from '../firestore-access';
import {getUserShares} from '../firestore-access';
import {makeInvestment} from '../firestore-access';
import {getUserBalance} from '../firestore-access';

class Round extends React.Component {

    constructor (props) {
        super(props);

        this.state = {
            chartURL: null,
            technicalIndicators: null,
            roomID: setUpRoom(firestore, 'AAPL', getUserID()),
            currentCash: null,
            currentShares: null,
            currentPrice: null,
            userChoice: null,
            userNumShares: null
            //leaderboard: null,
        }
    }

    async componentDidMount() {
        const userID = getUserID();

        this.setState({
            currentCash: await getUserBalance(firestore, this.state.roomID, userID),
            currentShares: await getUserShares(firestore, this.state.roomID, userID),
            currentPrice: await getCurrentPrice(firestore, this.state.roomID),
            userNumShares: (await getUserShares(firestore, this.state.roomID, userID)).length
        });
    }

    buy = () => {
      this.setState({userChoice: 'buy'});
    }

    hold = () => {
      this.setState({userChoice: 'hold'});
    }

    sell = () => {
      this.setState({userChoice: 'sell'});
    } 

    submitHandler = (event) => {
      event.preventDefault(); // prevent page refresh
      // make the investment
      makeInvestment(firestore, this.state.roomID, getUserID(), "AAPL", 100, 3/*event.target.value*/);
      alert("recorded the investment");
    }

    render () {
        /*let numShares = '';
        if (this.state.userChoice) {
            numShares = <input type='number'name='user-shares' />;
        } else {
            numShares = '';
        } */

        return (
            <div>
                <p className="price">The current price per share is ${this.state.currentPrice}</p>
                <p className="usr-current-shares">You current hold {this.state.userNumShares} shares</p>
                <p className="usr-available-money">You have ${this.state.currentCash} left to spend.</p>

                <form onSubmit={this.submitHandler}>
                    <button onClick={this.buy}>Buy</button>
                    
                    <label>Enter number of shares:</label>
                    <input
                        name="num-shares"
                        type="number"
                    />

                    <button onClick={this.sell}>Sell</button>
                    <button onClick={this.hold}>Hold</button>

                    <input
                        type="submit"
                    />
                </form>
                

                <div id="confirmation"></div>
            </div>
        )
    }
}

export default Round;