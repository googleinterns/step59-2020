import React, {Component,Fragment} from 'react';

import {firestore} from '../../../../../integrity-capstone-temp/src/firebase';
import {getUserID} from '../../../../../integrity-capstone-temp/src/firebase';
import {makeInvestment} from '../../../../../integrity-capstone-temp/src/Components/firebase-access';

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
