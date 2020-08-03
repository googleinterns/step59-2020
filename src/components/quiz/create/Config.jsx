import React from 'react';
import { firestore} from '../../../firebase.js';
import {setUpRoom,getIndustries,getSectors,getMarketCaps,initSymbols} from '../../firebase-access.jsx';
import AsyncSelect from 'react-select/async';
import Select from 'react-select';
import NumericInput from 'react-numeric-input';
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";

//TODO Add UI
import Instructions from "../Instructions";
import {Text} from 'react-native';
import * as styles from '../../styles/CreateStyle.jsx';
import Button from "@material-ui/core/Button";

class Config extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            numSymbols: 1,
            numRounds: 1,
            displayInstructions: false,
        };
        this.createRoom = this.createRoom.bind(this);
    }

    handleChange = (name, value) => {
        let state = this.state;
        state[name] = value;
        this.setState({state});
    }

    createRoom = () => {
      const Industry = null;
      const Sector = null;
      const MarketCaps = null;
      const {numSymbols,numRounds} = this.state;

      initSymbols(Industry,Sector,MarketCaps,numSymbols).then((symbolsL) => {
            console.log("SymbolsL is" + symbolsL);
            let roomID = setUpRoom(symbolsL,numRounds,'');
            this.props.updatePageType('created',roomID);
      });
    }

    toggleInstructions() {
        this.setState({
            displayInstructions: !this.state.displayInstructions
        })
    }

    render() {
        const {numSymbols,numRounds,displayInstructions} = this.state;
        return (
            <div>
                <body style={styles.body}>

                    {displayInstructions &&
                    <Instructions
                        info='create'
                        closeInstructions={this.toggleInstructions.bind(this)}
                    />

                    }

                    <div style={styles.box}>
                        <Text style={styles.h1}> Create Game Room </Text>
                    </div>
                    
                    <Button style={styles.buttonStyle} onClick={this.toggleInstructions.bind(this)}>
                        Instructions
                    </Button>
         
                    <br/><br/><br/>
                    <label> Set number of symbols </label>
                    <NumericInput style={styles.numericinput} type='number' name="numSymbols" step={1} value={this.state.numSymbols} min={1} max={7}
                       onChange={this.handleChange.bind(this,'numSymbols')}/>
                    <br/><br/>

                    <label> Set number of rounds </label>
                    <NumericInput type='number' name="numRounds" step={1} value={this.state.numRounds} min={1} max={7}
                       onChange={this.handleChange.bind(this,'numRounds')}/>

                    <br/><br/><br/>
                    <Button style={styles.buttonStyle} onClick={() => this.createRoom()}> 
                        Create room
                    </Button>
                </body>
            </div>
        );
    }
}

export default Config;
