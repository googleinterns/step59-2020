import React from 'react';
import { firestore} from '../../../firebase.js';
import {setUpRoom,getIndustries,getSectors,getMarketCaps,initSymbols} from '../../firebase-access.jsx';
import AsyncSelect from 'react-select/async';
import Select from 'react-select';
import NumericInput from 'react-numeric-input';
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";

//TODO Add UI
class Config extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            numSymbols: 1,
            numRounds: 1,
        };
        this.createRoom = this.createRoom.bind(this);
    }

    handleChange = (name, value) => {
        let state = this.state;
        state[name] = value;
        this.setState({state});
    }

    createRoom = () => {
        console.log("create room called");
        const {numSymbols,numRounds} = this.state;
        var roomID = setUpRoom(numSymbols,numRounds,'');
        this.props.updatePageType('created',roomID);
        console.log(this.props.roomId);
    }

    render() {
        const {numSymbols,numRounds} = this.state;
        return (
            <div>
                <p> Set number of symbols </p>
                <NumericInput type='number' name="numSymbols" step={1} value={this.state.numSymbols} min={1} max={7}
                       onChange={this.handleChange.bind(this,'numSymbols')}/>
                <p> Set number of rounds </p>
                <NumericInput type='number' name="numRounds" step={1} value={this.state.numRounds} min={1} max={7}
                       onChange={this.handleChange.bind(this,'numRounds')}/>
                <button onClick={() => this.createRoom()}> Create room </button>
            </div>
        );
    }
}

export default Config;
