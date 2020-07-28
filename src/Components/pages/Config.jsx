import React from 'react';
import { firestore} from '../../firebase.js';
import {setUpRoom,getIndustries,getSectors,getMarketCaps,initSymbols} from '../firebase-access.jsx'
import AsyncSelect from 'react-select/async';
import Select from 'react-select'

const ROUNDS = [
    { value: 1, label: '1 Round' },
    { value: 2, label: '2 Rounds' },
    { value: 3, label: '3 Rounds' },
    { value: 4, label: '4 Rounds' },
    { value: 5, label: '5 Rounds' },
    { value: 6, label: '6 Rounds' },
    { value: 7, label: '7 Rounds' },
  ]

class Config extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          Industry:null,
          MarketCap:null,
          Sector:null,
          Rounds:null
        };
        this.submitHandler = this.submitHandler.bind(this);
        this.getIndustryList = this.getIndustryList.bind(this);
        this.getSectorList = this.getSectorList.bind(this);
        this.getMarketCapList = this.getMarketCapList.bind(this);
      }
  
      getIndustryList = async () => {
          let IndList =await getIndustries(firestore);
          return IndList;
      }
      getSectorList = async () => {
          let SectorList =await getSectors(firestore);
          return SectorList;
      }
      getMarketCapList = async () => {
          let CapList =await getMarketCaps(firestore);
          return CapList;
      }
      handleIndustryChange = selectedOption => {
          this.setState({ Industry: selectedOption.value });
      };
  
      handleSectorChange = selectedOption => {
          this.setState({ Sector: selectedOption.value });
      };
  
      handleMarketCapChange = selectedOption => {
          this.setState({ MarketCap: selectedOption.value });
      };
      handleRoundChange = selectedOption  => {
          this.setState({ Rounds: selectedOption.value });
      }
      
      submitHandler = async (event) => {
          event.preventDefault(); // prevent page refresh

          const data = new FormData(event.target);
          const Industry = this.state.Industry;
          const Sector = this.state.Sector;
          const MarketCaps = this.state.MarketCap;
          const Rounds = this.state.Rounds;

          let num = parseInt(data.get("NumSymbols"), 10);
          const NumOfSymbols  = num ? num : 1;
          let Symbols = []

          try {
            Symbols = await initSymbols(firestore,Industry,Sector,MarketCaps,NumOfSymbols);
          } catch(error) {
            console.log("Error is "  + error)
          }
          if(Symbols.length) {
              let roomID =await setUpRoom(firestore,Symbols,Rounds,'');
              this.props.updatePageType('created',roomID);
          }
          else {
              alert("No Symbols match your query");
          }
      }
  
      render() {
        return (
          <form onSubmit={this.submitHandler}>
              
          <label>(Required)Enter number of Symbols:</label>
          <input name="NumSymbols" type="number"/>
          
          <br/>
          <label>(Required)Select Number of Rounds:</label>
          <Select onChange ={this.handleRoundChange} options={ROUNDS}  />
          <br/>

          <label>Select Industries:</label>
          <AsyncSelect onChange={this.handleIndustryChange} cacheOptions defaultOptions loadOptions={this.getIndustryList} />
  
          <label>Select Sectors:</label>
          <AsyncSelect onChange={this.handleSectorChange} cacheOptions defaultOptions loadOptions={this.getSectorList} />
  
          <label>Select Market Cap types:</label>
          <AsyncSelect onChange={this.handleMarketCapChange} cacheOptions defaultOptions loadOptions={this.getMarketCapList} />
  
          <input name = "Submit" type="submit" value="Submit" />
          </form>
        );
      }
}

export default Config;
