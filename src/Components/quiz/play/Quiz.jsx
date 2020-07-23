import React, { Component } from 'react';

import {firestore} from '../../../firebase';
import {getUserID} from '../../../firebase';

//import {getPrices} from '../../firebase-access';
import {getCurrentShares} from '../../firebase-access';
import {getUserBalance} from '../../firebase-access';
//import {getDayIndex} from '../../firebase-access';
import {verifyOk} from '../../firebase-access';
import {makeInvestment} from '../../firebase-access';

 
/*
inherited from Play:
  - chart URLs
  - roomID
  - symbols array
  - prices array
  - dayIndex
 
what Quiz does:
  - retrieves and displays user information
  - gets graph URLs from parent and displays
  - HTML form to gather all input data
  - submitHandlers for: 
    - buy (+ # of shares)
    - sell (+ # of shares)
  - create changeArray to record investment in firestore
*/
 
// TODO: get this data from parent
const NUM_SYMBOLS = 1;
const DAY_INDEX = 0;
const ROOMID = '8k6e0MCCC5lZbMXpD5hM';
const USERID = 'XDTyJ8KOv31UhM3QXIoN';
 
const BUY = "BUY";
const SELL = "SELL";
const HOLD = "HOLD";
 
class Quiz extends Component {
 
    // TODO: render charts on page
    constructor(props) {
        super(props);
        this.state = {
          userID: getUserID(),
          userBalance: null,  // call getUserCash
          userShares: [],
          formInput: []
        };

        this.init();
    }

    // initializes values retrieved from database
    init = async () => {

        this.setState({
            userBalance: await getUserBalance(firestore, ROOMID, this.state.userID),
            userShares: await getCurrentShares(ROOMID, this.state.userID)
        });
    }
 
    // TODO: get from parent
    getPrice = (symbolIndex) => {return 30;}
 
    getAvailableSymbols = () => {
        let content = [];
        for (let i = 0; i < NUM_SYMBOLS; i++) {
            content.push(<li key={i}>Symbol{i}</li>);
        }
        return content;
    }
 
    addRowToFormData = (index) => {
        const dataJSON = {
            BUY: null,
            HOLD: null,
            SELL: null
        };
        this.state.formInput[index] = dataJSON;
    }
 
    getSymbolData = () => {
        let rows = [];
 
        // get current price and user shares held for each of the symbols
        // also present the BUY/HOLD/SELL options
        for (let i = 0; i < NUM_SYMBOLS; i++) {
            const currentPrice = this.getPrice(i);
            const numShares = this.state.userShares[i];

            const toRender = (
                <div key={i}>
                    <p>Symbol{i}:</p>
                    <p>Current price is: {currentPrice}.</p>
                    <p>You currently hold {numShares} share(s).</p>
 
                    <button type="button">BUY</button>
                    <input type="number" placeholder="10" onChange={(event) => this.updateFormState(event, i, BUY)}/>
 
                    <button type="button" onClick={(event) => this.updateFormState(event, i, HOLD)}>HOLD</button>
 
                    <button type="button">SELL</button>
                    <input type="number" placeholder="10" onChange={(event) => this.updateFormState(event, i, SELL)}/>
                    <br/>
                </div>
            );
            rows.push(toRender);
            this.addRowToFormData(i);
        }
 
        return rows;
    }
 
    // update state variable to reflect number of shares
    updateFormState = (event, index, state) => {
        var newState = {
            BUY: null,
            HOLD: null,
            SELL: null
        };
 
        // handle different states
        if (state === BUY) {
            var numShares = event.target.value;
 
            // value is deleted
            if (!numShares) {
                this.state.formInput[index][BUY] = null;
                return;
            }
 
            newState[BUY] = Number(numShares);
        }
        else if (state === HOLD) {
            newState[HOLD] = 1;  // indicate that user wants to Hold this investment with boolean flag
        }
        else if (state === SELL) {
            var numShares = event.target.value;
 
            // deletion
            if (!numShares) {
                this.state.formInput[index][SELL] = null;
                return;
            }
 
            newState[SELL] = Number(numShares);
        }
        else {
            throw "An unexpected error occurred when trying to process the state";
        }
 
        this.state.formInput[index] = newState;
    }
 
    // parse form submission results and convert into a changeArray (for firestore)
    parseResults = () => {
        var changeArray = [];
        for (let i = 0; i < this.state.formInput.length; i++) {
            const currentRow = this.state.formInput[i];
 
            if (currentRow[BUY]) {
                changeArray.push(currentRow[BUY]);
            }
            else if (currentRow[HOLD]) {
                changeArray.push(0);  // invest 0 in symbol
            }
            else if (currentRow[SELL]) {
                changeArray.push((currentRow[SELL] * -1));
            }
            else {
                alert("Please enter an action for each symbol");
                break;
            }
        }
        
        this.validate(changeArray);
        makeInvestment(ROOMID, this.state.userID, DAY_INDEX, changeArray);
        alert('investment recorded');
    }
 
    validate = async (changeArray) => {
        // TODO: use parent component's access to price to verify onSubmit
        
        //const res = await verifyOk(ROOMID, this.state.userID, DAY_INDEX, changeArray, /*put price here*/);
        //if (!res) {
        //    alert('You attempted to make an invalid trade. Please reenter.');
        //}
    }
 
 
    submitHandler = (event) => {
        event.preventDefault();  // prevent page refresh
        this.parseResults();
    }
 
    render() {
 
        return (
            <div>
 
                <p>Available symbols are:</p>
                <ul>{this.getAvailableSymbols()}</ul>
                <p>Current Balance is {this.state.userBalance}</p>
                <br/>
 
                <form onSubmit={this.submitHandler}>
                    {this.getSymbolData()}
                    <br/><br/>
                    <input type="submit"/>
                </form>
            
            </div>
        );
    }
};
 
export default Quiz;
