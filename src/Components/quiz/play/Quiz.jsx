import React, { Component } from 'react';
import Select from 'react-select'

import {makeInvestment} from '../../firebase-access';

/*
  - retrieves and displays user information
  - gets graph URLs from parent and displays
  - HTML form to gather all input data
  - submitHandlers for:
    - buy (+ # of shares)
    - sell (+ # of shares)
  - create changeArray to record investment in firestore
*/

class Quiz extends Component {

    constructor(props) {
        super(props);
        this.state = {
            roomId: null,
            password: '',
            userId: '',
            nickname: '',
            numSymbols: null,
            symbolSelect: [],
            chartUrls: null,

            // frequently updated properties
            questionNum: 0,
            net_worth: 0,
            money_left: 0,
            curShares: [],
            prices: [],
            curBuyArray: null,
            curSymbol: null  // symbol that's info is displayed (selected symbol)
        };
    }

    componentDidMount () {
        var empArray = new Array(this.state.numSymbols).fill(0);
        this.setState({
            roomId: this.props.roomId,
            userId: this.props.userId,
            nickname: this.props.nickname,
            questionNum: this.props.questionNum,
            chartUrls: this.props.chartUrls,
            net_worth: this.props.net_worth,
            money_left: this.props.money_left,
            curShares: this.props.curShares,
            prices: this.props.prices,
            curBuyArray: empArray,
            symbolSelect: this.getSymbolData()
        });
    }

    static getDerivedStateFromProps(props,state) {
        return {
            questionNum: props.questionNum,
            chartUrls: props.chartUrls,
            net_worth: props.net_worth,
            money_left: props.money_left,
            curShares: props.curShares,
            prices: props.prices,
            numSymbols: props.numSymbols
        }
    }

    getSymbolData = () => {
        const newSymbolSelect = new Array(this.state.numSymbols).fill(0);
        for (let i = 0; i < newSymbolSelect.length; i++) {
            const selectLabel = 'Symbol ' + i;
            newSymbolSelect[i] = {label: selectLabel, value: i};
        } 
        
        return newSymbolSelect;
    }

    // update the symbol being traded
    symbolSelectHandler = (selectedSymbol) => {
        this.setState({
            curSymbol: selectedSymbol.value,
        });
    }

    submitHandler = (event) => {
        event.preventDefault();
    }

    buy = (event) => {
        const {roomId, userId, questionNum} = this.state;
        var changeArray = new Array(this.state.numSymbols).fill(0);

        var numShares = null;

        // reset to 0 if user deletes the value
        !event.target.value ? numShares = 0 : numShares = event.target.value;
        changeArray[this.state.curSymbol] = numShares;
        
        if(!makeInvestment(roomId,userId,questionNum,changeArray)) {
            alert('Not a valid transaction - please try again.');
        }
    }

    sell = (event) => {
        const {roomId, userId, questionNum} = this.state;
        var changeArray = new Array(this.state.numSymbols).fill(0);
      
        var numShares = null;

        !event.target.value ? numShares = 0 : numShares = (-1 * event.target.value);
        changeArray[this.state.curSymbol] = numShares;

        if(!makeInvestment(roomId,userId,questionNum,changeArray)) {
            alert('Not a valid transaction - please try again.');
        } 
    }

    render() {
        const {questionNum,chartUrls,net_worth,money_left,curShares,
          prices,curBuyArray,nickname,roomId,symbolSelect, curSymbol} = this.state;

        // conditionally render the symbol info - only render the symbol's
        // info that is selected from the dropdown
        return (
            <div>
                <p>Hi there, {nickname}!</p>
                <p>You are in Room {roomId}.</p>

                <p>Your net worth is ${net_worth}.</p>
                <p>Your account balance is currently ${money_left}.</p>

                <form onSubmit={this.submitHandler}>
                    <Select onChange={this.symbolSelectHandler} options={symbolSelect} />
                    <br/><br/>
                    
                    {curSymbol != null && 
                        <div>
                            <p>Selected symbol: Symbol {curSymbol}</p>
                            <p>You hold {curShares[curSymbol]} shares.</p>
                            <p>The price is currently ${prices[curSymbol]}.</p>
                            <img src={chartUrls[curSymbol]} />

                            <label>Buy:</label>
                            <input type='number' onChange={this.buy} />

                            <button type='button'>HOLD</button>

                            <label>Sell:</label>
                            <input type='number' onChange={this.sell} />
                        </div>
                    }
                </form>

            </div>
        )
    }
};

export {Quiz};
