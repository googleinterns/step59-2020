import firebase from "firebase/app";
import fetch from './fetchWithTimeOut'
import "firebase/auth";
import "firebase/firestore";
import {db, fval} from "../firebase";

export const addUser = async (roomID, nickname) => {

    //TODO add user authentication

    const numDays = (await getDates(roomID)).length;
    const numSymbols = (await getSymbols(roomID)).length;
    const roomRef = await getRoomRef(roomID);
    const userRef = roomRef.collection('users').doc();
    const userID = userRef.id;
    const empArray = Array.from(Array(numSymbols), () => 0);
    const startingMoney = await getStartingMoney(roomID);

    const gameInfo = {
        userId: userID,
        nickname: nickname,
        net_worth: startingMoney,
        money_left: startingMoney,
        curShares: empArray,
    }

    userRef.set(gameInfo);
    for(var i_day = 0; i_day < numDays; i_day++) {
        userRef.collection('investments').doc(i_day.toString()).set({
            change: empArray,
        });
    }
    return userID;
}

export const advanceDay = async (roomID) => {
    var roomRef = getRoomRef(roomID);
    await roomRef.update({
        day_index: fval.increment(1),
    });
    await roomRef.collection('users').get().then(function(querySnapshot) {
        querySnapshot.forEach(function(user) {
            updateNetWorth(roomID,user.data().userId);
        });
    });

    var roomData = await getRoomData(roomID);
    if (roomData.dates.length - 1 <= roomData.day_index) {
        roomRef.update({
            phase: 'ended',
        })
    }
}

function atLeastTwo(a,b,c) {
    return a ? (b || c) : (b && c);
}

export const changeCash = async (roomID, userID, dayIndex, changeArray, prices) => {
    const userRef = getUserRef(roomID, userID);
    const userData = await getUserData(roomID, userID);
    var totalMoney = userData.money_left;
    prices.map(function(num,idx) {totalMoney -= num * changeArray[idx];});
    userRef.update({money_left: totalMoney});
}

export const changeShares = async (roomID, userID, dayIndex, changeArray) => {
    const userRef = getUserRef(roomID, userID);
    const investRef = userRef.collection('investments').doc(dayIndex.toString());
    const userData = await getUserData(roomID, userID);
    // Update curShares array
    var curArray = userData.curShares;
    var sum = curArray.map(function(num, idx) {return num + changeArray[idx];});
    userRef.update({curShares: sum});

    //TODO: current have a separate call for investment. Consider accessing it through userData to save time
    investRef.get().then(function(investDoc) {
        if (investDoc.exists) {
            var investData = investDoc.data();
            var curArray = investData.change;
            var sum = curArray.map(function(num, idx) {
                return num + changeArray[idx];
            });
            investRef.update({
                change: sum,
            });
        }
    });
}

export const initDates = async (symbols, Rounds) => {
    let Stocks = await db.collection("Ticker-Info").doc("Stock").collection("Stocks")
        .where("Symbol","in", symbols).get();
    let IPOyearMax = 0;
    let today = new Date();
    let year = today.getFullYear();
    Stocks.forEach(function(Stock){
        if (IPOyearMax < Stock.data().IPOyear){
            IPOyearMax = Stock.data().IPOyear;
        }
    });

    // No more than 7 rounds(Periods are measured in months)
    let min_window_size = 3;
    let yearDiff = year - (IPOyearMax + 1);
    let maximum_period = Math.floor(((yearDiff * 12)  - min_window_size) / Rounds);
    let random_period =  Math.floor((Math.random()  * (maximum_period - min_window_size)) + min_window_size);
    let startDate = new Date(IPOyearMax + 1, 1, 1);
    let endDate =  new Date(IPOyearMax + 1, 1 + random_period, 1);
    let rand_startDate =  randomDate(startDate,endDate);
    let dates = [];
    let curr_date = rand_startDate;
    for(var i = 0; i < Rounds; i++) {
        dates.push(curr_date.toISOString().substring(0, 10));
        curr_date = new Date(curr_date.setMonth(curr_date.getMonth() + random_period));
    }
    const datesD = {
        "dates" : dates,
        "period": random_period
    }
    return datesD;
}

export const initializeQuiz = async (symbols, roomId, periodLen, endDates) => {
  var formData = new FormData();
  formData.append('symbol',JSON.stringify(symbols));
  formData.append('RoomId',roomId);
  formData.append('end-date',JSON.stringify(endDates));
  var token =  localStorage.getItem('Token');
  try{
      let response = await fetch("http://localhost:8080/get_prices", {
        method: 'POST',
        body: formData,
        //Comment this line back in when you want to deploy , and get rid of localhost
        // headers: {
        //   Authorization: ("Bearer " + token)
        // },
      },100000)
      console.log(response);
  }
  catch(err) {
      console.log("Error is " +  err)
  }
  formData.append('periodLen',periodLen)
  try{
      let response  = await fetch('http://localhost:8080/get_stock_image', {
          method: 'POST',
          body: formData,
          //Comment this line back in when you want to deploy , and get rid of localhost
          // headers: {
          //   Authorization:("Bearer " + token)
          // }
      },100000)
      console.log(await response.json());
  }
  catch(error){
      console.log("Error is " +  error)
  }
}
export const initSymbols = async(Industry,Sector,MarketCap,NumOfSymbols) =>{
  let symbols = [];
  if(atLeastTwo(Industry,Sector,MarketCap)){
      //In the case where a person wants to query using multiple features it may return a larger request,
      //so we send it to the backend
      let formData = new FormData();
      if(Industry)
          formData.append('Industry',Industry);
      if(Sector)
          formData.append('Sector',Sector);
      if(MarketCap)
          formData.append('MarketCap',MarketCap);
      formData.append('NumOfSymbols',NumOfSymbols);
      var token =  localStorage.getItem('Token');
      try{
          let response = await fetch('https://localhost:8080/get_symbols ', {
              method: 'POST',
              body: formData,
              //Comment this line back in when you want to deploy , and get rid of localhost
              // headers: {
              //   Authorization: (' Bearer ' + token)
              // }
          },100000)
          let symbolJson = await response.json();
          if (symbolJson.hasOwnProperty("Error")){
              console.log("No Symbols for your query")
              return symbols;
          }
          symbols = symbolJson['symbols'];
      }
      catch(error){
          console.log("Error with Query: " + error);
      }

  }
  // All of the rest of the values use a search by Xpos to make the query as small as possible(O(numOfSymbols))
  else if(Industry !== null){

      let IndustryInfo =  await db.collection("Ticker-Info").doc("Industry").get();
      let numOfIndustries= IndustryInfo.data().Industry[Industry];
      let cutoff = Math.floor((Math.random()  * (numOfIndustries - NumOfSymbols))+NumOfSymbols);
      let Industries = await db.collection("Ticker-Info").doc("Stock").collection("Stocks")
          .where("Industry","==",Industry)
          .where("IndustryPos","<=", cutoff)
          .orderBy("IndustryPos").limit(NumOfSymbols).get();
      Industries.forEach(function(doc){
          symbols.push(doc.data().Symbol);
      })
  }
  else if(MarketCap !== null){
      let MarketCapInfo = await db.collection("Ticker-Info").doc("Market-Cap").get();
      let numStocks= MarketCapInfo.data().MarketCap[MarketCap];
      let cutoff = Math.floor((Math.random()  * (numStocks - NumOfSymbols))+NumOfSymbols);
      let Stocks = await db.collection("Ticker-Info").doc("Stock").collection("Stocks")
          .where("MarketCapSize","==",MarketCap)
          .where("MarketCapPos","<=", cutoff)
          .orderBy("MarketCapPos").limit(NumOfSymbols).get();
      Stocks.forEach(function(doc){
          symbols.push(doc.data().Symbol);
      })
  }
  else if(Sector !== null){

      let SectorInfo =  await db.collection("Ticker-Info").doc("Sector").get();
      let numOfSectors= SectorInfo.data().Sector[Sector];
      let cutoff = Math.floor((Math.random()  * (numOfSectors - NumOfSymbols))+NumOfSymbols);
      let Sectors = await db.collection("Ticker-Info").doc("Stock").collection("Stocks")
          .where("Sector","==",Sector)
          .where("SectorPos","<=", cutoff)
          .orderBy("SectorPos").limit(NumOfSymbols).get();
      Sectors.forEach(function(doc){
          symbols.push(doc.data().Symbol);
      })

  }
  else{

      let StockInfo =  await db.collection("Ticker-Info").doc("Stock").get();
      let numOfStocks = StockInfo.data().NumOfStocks - 1;
      console.log("NumOfSymbols is " + NumOfSymbols + "NumOfStocks is " + numOfStocks);
      let cutoff = Math.floor((Math.random()  * (numOfStocks - NumOfSymbols))+NumOfSymbols);
      console.log("cutoff is" + cutoff);
      let Stocks = await db.collection("Ticker-Info").doc("Stock").collection("Stocks")
          .where("RandomPos",">=", cutoff)
          .orderBy("RandomPos").limit(NumOfSymbols).get()
      Stocks.forEach(function(Stock){
          symbols.push(Stock.data().Symbol);
      })

  }
  return symbols;
}

export const makeInvestment = async (roomID, userID, dayIndex, changeArray) => {
    const prices = await getPrices(roomID, dayIndex);

    if (!(await verifyOk(roomID, userID, dayIndex, changeArray, prices))) return false;

    changeCash(roomID, userID, dayIndex, changeArray, prices);
    changeShares(roomID, userID, dayIndex, changeArray);

    return true;
}

function randomDate(start, end) {
    var date = new Date(+start + Math.random() * (end - start));
    return date;
}

// export const setUpRoom = (numOfSymbols,rounds,password,startingMoney = 10000) => {
//
//     const roomRef = db.collection('Rooms').doc();
//     roomRef.set({
//         day_index: 0,
//         phase: 'no-host',
//         password: password,
//         starting_money: startingMoney,
//     });
//     const roomID = roomRef.id;
//     initSymbols(db,null,null,null,numOfSymbols).then((symbolsL) => {
//         initDates(symbolsL,rounds).then((datesD)=> {
//             roomRef.update({
//                 symbols: symbolsL,
//                 dates: datesD["dates"],
//             });
//             initializeQuiz(symbolsL,roomID,datesD["period"],datesD["dates"]);
//         });
//     });
//     return roomID;
// }

export const setUpRoom = (symbolsL,Rounds,password,startingMoney = 10000) => {
  const roomRef = db.collection('Rooms').doc();
  roomRef.set({
      day_index: 0,
      phase: 'no-host',
      password: password,
      starting_money: startingMoney,
  });
  const roomID = roomRef.id;
  initDates(symbolsL,Rounds).then((datesD)=> {
      roomRef.update({
          symbols: symbolsL,
          dates: datesD["dates"],
      });
      initializeQuiz(symbolsL,roomID,datesD["period"],datesD["dates"]);
  });
  return roomID;
}

//TODO: this method can be called many times, which leads to latency due to a lot of awaits. See if can pass userData from other methods
export const updateNetWorth = async (roomID, userID) => {
    const numDays = await getNumDays(roomID);
    const dayIndex = await getDayIndex(roomID);
    const prices = await getPrices(roomID, dayIndex >= numDays ? numDays - 1 : dayIndex);
    const userData = await getUserData(roomID, userID);
    const userRef = getUserRef(roomID, userID);

    const curShares = userData.curShares;
    var netWorth = userData.money_left;
    curShares.map((numShares,idx) => {netWorth += numShares * prices[idx];});
    if (userData.net_worth == netWorth) return;
    await userRef.update({net_worth: netWorth});
}

export const verifyOk = async (roomID, userID, dayIndex, changeArray, prices) => {
    var consistentInvestment = true;
    const userRef = getUserRef(roomID, userID);
    const userData = await getUserData(roomID, userID);

    var curArray = userData.curShares;
    var sum = curArray.map(function(num,idx) {return num + changeArray[idx];});
    consistentInvestment = consistentInvestment && sum.every((e) => e >= 0);

    // Check cash ok
    var totalMoney = userData.money_left;
    var moneySpentArr = prices.map(function(price,idx) {totalMoney -= price * changeArray[idx];});
    consistentInvestment = consistentInvestment && totalMoney >= 0;

    return consistentInvestment;
}

export const getCash = async (roomID, userID) => {
    const userData = await getUserData(roomID,userID);
    return userData.money_left;
}

export const getCharts = async (roomID, dayIndex) => {
    const numSymbols = await getNumSymbols(roomID);
    var charts = {};
    for(var i = 0; i < numSymbols; i++) {
        charts[i] = await getChartUrls(roomID, await getSymbolNameFromIndex(roomID, i), dayIndex);
    }
    return charts;
}

export const getChartUrls = async (roomID, symbol, dayIndex) => {
    const endDate = await getDateFromIndex(roomID, dayIndex);
    let images = await db.collection('Rooms').doc(roomID).collection(symbol).doc('images').get();
    let imagesData = images.data();
    return [imagesData["Stockpublic_image_url"][endDate],imagesData["ADXpublic_image_url"][endDate],
        imagesData["MACDpublic_image_url"][endDate],imagesData['RSIpublic_image_url'][endDate]];
}

export const getDateFromIndex = async (roomID, dayIndex) => {
    const roomData = await getRoomData(roomID);
    return roomData.dates[dayIndex];
}

export const getDates = async (roomID) => {
    const roomData = await getRoomData(roomID);
    return roomData.dates;
}

export const getLeaders = async (roomID) => {
    var roomRef = getRoomRef(roomID);
    var leaders = await roomRef.collection('users').orderBy('net_worth','desc').limit(3).get();
    var leadersArray = []
    leaders.forEach((doc) => {
        leadersArray = leadersArray.concat(doc.data());
    })
    return leadersArray;
}

export const getDayIndex = async (roomID) => {
    const roomData = await getRoomData(roomID);
    return roomData.day_index;
}

export const getNetWorth = async (roomID, userID) => {
    const userData = await getUserData(roomID, userID);
    return userData.net_worth;
}

export const getNumDays = async (roomID) => {
    const roomData = await getRoomData(roomID);
    return roomData.dates.length;
}

export const getNumSymbols = async (roomID) => {
    const roomData = await getRoomData(roomID);
    return roomData.symbols.length;
}

// returns current price for all symbols being tracked
export const getPrices = async (roomID, dayIndex) => {
    const roomData = await getRoomData(roomID);
    const symbolNamesArray = roomData.symbols;

    var prices = [];

    // save all current prices in an array
    for (var index = 0; index < symbolNamesArray.length; index++) {
        const currentName = symbolNamesArray[index];
        const symbolPricesDoc = await db.collection('Rooms').doc(roomID).collection(currentName).doc('Prices').get();
        const symbolPricesData = symbolPricesDoc.data();
        const currentPrice = symbolPricesData.prices[dayIndex];
        prices.push(currentPrice);
    }

    return prices;
}

export const getRoomData = async (roomID) => {
    const roomRef = getRoomRef(roomID);
    const roomDoc = await roomRef.get();
    return roomDoc.data();
}

export const getRoomRef = (roomID) => {
    return db.collection('Rooms').doc(roomID);
}

export const getShares = async (roomID, userID) => {
    const userData = await getUserData(roomID,userID);
    return userData.currentShares;
}

export const getStartingMoney = async (roomID) => {
    const roomData = await getRoomData(roomID);
    return roomData.starting_money;
}

// retrieves symbol name given the symbol's index
export const getSymbolNameFromIndex = async (roomID, symbolIndex) => {
    const roomDoc = await db.collection('Rooms').doc(roomID).get();
    const symbols = roomDoc.data().symbols;
    return symbols[symbolIndex];
}

export const getSymbols = async (roomID) => {
    const roomData = await getRoomData(roomID);
    return roomData.symbols;
}

export const getUserData = async (roomID, userID) => {
    const userRef = getUserRef(roomID, userID);
    const userDoc = await userRef.get();
    return userDoc.data();
}

export const getUserRef = (roomID, userID) => {
    return db.collection('Rooms').doc(roomID).collection('users').doc(userID);
}

/* configuration methods */
/* commenting out for now. TODO @john: add back in once Config works properly. */
/*
function compDoc(a, b){
  if (a.value < b.value) {
    return -1;
  }
  if (a.value > b.value) {
    return 1;
  }
  return 0;
}

export const getIndustries = async (db) => {
  let Industries = await db.collection("Ticker-Info").doc("Industry").get();
  let IndustryData =  Industries.data().Industry;
  let IndustryList = [];
  for(const Industry in IndustryData) {
    IndustryList.push({value: Industry, label: Industry});
  }
  IndustryList.push({value: null, label: "None"});
  IndustryList.sort(compDoc);
  return IndustryList;
}

export const getSectors = async (db) => {
  let Sectors = await db.collection("Ticker-Info").doc("Sector").get();
  let SectorData =  Sectors.data().Sector;
  let SectorList = [];
  for(const Sector in SectorData) {
    SectorList.push({value: Sector, label: Sector});
  }
  SectorList.push({value: null, label:"None"});
  SectorList.sort(compDoc);
  return SectorList;
}

export const getMarketCaps = async (db) => {
  let MarketCaps = await db.collection("Ticker-Info").doc("Market-Cap").get();
  let MarketCapData =  MarketCaps.data().MarketCap;
  let MarketCapList = [];
  for(const Stock in MarketCapData) {
    MarketCapList.push({value: Stock, label: Stock});
  }
  MarketCapList.push({value: null, label:"None"});
  MarketCapList.sort(compDoc);
  return MarketCapList;
} */
