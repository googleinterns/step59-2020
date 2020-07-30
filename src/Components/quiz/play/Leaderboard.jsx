import React, {Component,Fragment} from 'react';

import {firestore} from '../../../../../integrity-capstone-temp/src/firebase';
import {getUserID} from '../../../../../integrity-capstone-temp/src/firebase';
import {makeInvestment} from '../../../../../integrity-capstone-temp/src/Components/firebase-access';

/*
* Displays all users in the room and orders them by their net worth.
* Also functions as a summary page to display at the end of the game.
*/

class Leaderboard extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount () {
        this.setState({
            leaders: this.props.leaders,
        });
    }

    static getDerivedStateFromProps(props,state) {
        return {
            leaders: props.leaders,
        }
    }

    render () {
        const {leaders} = this.state;
        return (
            <Fragment>
                {
                    leaders.map(function(item,index) {
                        return <li key={item.userID}>{index}. ${item.netWorth} - {item.nickname} </li>
                    })
                }
            </Fragment>
        )
    }
}
