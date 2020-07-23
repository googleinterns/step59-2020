import React, { Component } from 'react';
 
/*
inherited from Play:
  - chart URLs
  - roomID
  - symbols array
  - prices array
 
what Quiz does:
  - retrieves and displays user information
  - gets graph URLs from parent and displays
  - HTML form to gather all input data
  - submitHandlers for: 
    - buy (+ # of shares)
    - sell (+ # of shares)
  - create changeArray to record investment in firestore
*/
 
// TODO: get this data from firestore
const NUM_SYMBOLS = 3;
const BALANCE = 1000;
 
const BUY = "BUY";
const SELL = "SELL";
const HOLD = "HOLD";
 
class Quiz extends Component {
 
    // TODO: render charts on page
    constructor(props) {
        super(props);
        this.state = {
          userBalance: BALANCE,  // call getUserCash
          formInput: []
        };
    }
 
    // TODO: use firestore methods
    getPrice = (symbolIndex) => {return 10;}
    getShares = (symbolIndex) => {return 1;}
    getBalance = () => {return BALANCE;}
 
    getAvailableSymbols = () => {
        let content = [];
        for (let i = 0; i < NUM_SYMBOLS; i++) {
            content.push(<li key={i}>Symbol{i}</li>);
        }
        return content;
    }
 
    addRowToFormData = () => {
        const dataJSON = {
            BUY: null,
            HOLD: null,
            SELL: null
        };
        this.state.formInput.push(dataJSON);
    }
 
    getSymbolData = () => {
        let rows = [];
 
        // get current price and user shares held for each of the symbols
        // also present the BUY/HOLD/SELL options
        for (let i = 0; i < NUM_SYMBOLS; i++) {
            const currentPrice = this.getPrice(i);
            const numShares = this.getShares(i);
 
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
            this.addRowToFormData();
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
                throw "An error occurred when parsing the form input.";
            }
        }
 
        // TODO: call makeInvestment (firestore access) with changeArray
    }
 
    validate = (event) => {
        // TODO: call verifyOK (firestore access method) to verify
        // user input onChange
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
                <p>Current Balance is {this.getBalance()}</p>
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
