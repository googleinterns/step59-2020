import React, { Component } from 'react';
import Select from 'react-select';
import NumericInput from 'react-numeric-input';
import * as styles from '../../styles/QuizStyle.jsx';
import {makeInvestment} from '../../firebase-access';
import Instructions from "../Instructions";
import Button from "@material-ui/core/Button";
import {NavLink} from 'react-router-dom';

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
            curSymbol: null,  // symbol that's info is displayed (selected symbol)
            curAmount: 0,
            displayInstructions: false,
            displayTA: false,
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

    handleChange = (name, value) => {
        let state = this.state;
        state[name] = value;
        this.setState({state});
    }

    // update the symbol being traded
    symbolSelectHandler = (selectedSymbol) => {
        this.setState({
            curSymbol: selectedSymbol.value,
            curAmount: 0,
        });
    }

    submitHandler = (event) => {
        event.preventDefault();
    }

    async requestOrder(multiplier) {
        const {roomId, userId, questionNum, curAmount, curSymbol} = this.state;
        var changeArray = new Array(this.state.numSymbols).fill(0);
        changeArray[curSymbol] = curAmount * multiplier;

        if ((await makeInvestment(roomId,userId,questionNum,changeArray)) == false) {
            alert('well something went wrong ( ͡° ͜ʖ ͡°).\nPlease check that you are buying what you can afford and selling what you already have.');
        }

        else {
            alert('Investment recorded!');
        }
    }

    toggleInstructions() {
        this.setState({
            displayInstructions: !this.state.displayInstructions
        })
    }

    toggleTA() {
        this.setState({
            displayTA: !this.state.displayTA
        })
    }

    render() {
        const {questionNum,chartUrls,net_worth,money_left,curShares,
            prices,curBuyArray,nickname,roomId,symbolSelect,curSymbol,displayInstructions,displayTA} = this.state;

        // conditionally render the symbol info - only render the symbol's
        // info that is selected from the dropdown
        return (

            <body style={styles.body}>
                {displayInstructions &&
                <Instructions
                    info='play'
                    closeInstructions={this.toggleInstructions.bind(this)}
                    style={{textAlign:'center'}}
                />
                }

                {displayTA &&
                <Instructions
                    info='ta'
                    closeInstructions={this.toggleTA.bind(this)}
                />
                }

                <div>
                    <Button style={styles.buttonStyle} onClick={this.toggleInstructions.bind(this)}>
                        Instructions
                    </Button>
                </div>

                <div>
                    <div style={styles.box}>
                    <p>Hi there, {nickname}!</p>
                    <p>You are in Room {roomId}.</p>
                    <p>Your net worth is ${net_worth.toFixed(2)} and you have ${money_left.toFixed(2)} in cash.</p>
                    <p>Round: {questionNum}</p>
                    </div>
                    <Select style={styles.dropdown} onChange={this.symbolSelectHandler} options={symbolSelect}/>
                    <br/><br/>

                    {curSymbol != null &&
                        <div>
                            <div style={styles.box}>
                                <p>Selected symbol: Symbol {curSymbol}</p>
                                <p>You hold {curShares[curSymbol]} shares.</p>
                                <p>The price is currently ${prices[curSymbol].toFixed(2)}.</p>
                            </div>

                            <div>
                                <div style={styles.box}>
                                    <h3> Buy/Sell shares </h3>
                                    <NumericInput type='number' name="curAmount" step={1} value={this.state.curAmount} min={0} onChange={this.handleChange.bind(this,'curAmount')}/>
                                    <button style={styles.buttonStyle} value={"buy"} onClick={()=>this.requestOrder(1)}> Buy </button>
                                    <button style={styles.buttonStyle} value={"sell"} onClick={()=>this.requestOrder(-1)}> Sell </button>
                                </div>
                            </div>

                            <div style={styles.imgGrid}>
                                <img style={styles.img} src={chartUrls[curSymbol][0]}/>
                                <img style={styles.img} src={chartUrls[curSymbol][1]}/>
                                <img style={styles.img} src={chartUrls[curSymbol][2]}/>
                                <img style={styles.img} src={chartUrls[curSymbol][3]}/>
                            </div>
                            <Button style={styles.buttonStyle} onClick={this.toggleTA.bind(this)}>
                                What is this?
                            </Button>

                        </div>
                    }

                </div>
            </body>
        )
    }
};

export {Quiz};