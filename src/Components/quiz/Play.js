import React, {Component,Fragment} from 'react';
import {Helmet} from 'react-helmet';

class Play extends React.Component {

    constructor (props) {
        super(props);
        this.state = {
            chartURL: null,
            technicalIndicators: null,
            currentCash: null,
            currentShares: null,
            leaderboard: null,
        }
    }

    render () {
        return (
            <h1> WIP quiz page </h1>
        )
    }
}

export default Play;