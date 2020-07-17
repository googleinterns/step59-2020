'use strict';

//import Investment from './investment';
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const STARTING_MONEY = 10000;
export const DATES = ["2007-04-10 00:00:00", "2007-04-10 00:00:00", "2007-04-10 00:00:00"];

export const setUpRoom = (db, symbol, userID) => {
  const roomRef = db.collection('Rooms').doc();
  const roomID = roomRef.id;

  // TODO: send POST request to get time series data for GOOG
  // for prototype, hard-code 3 points in time
  roomRef.set({
    day_index: 0,
    dates: DATES
  });

  const usersRef = roomRef.collection('users');
  roomRef.collection('AAPL');
  const userRef = usersRef.doc(userID);

  const gameInfo = {
    investments: [],
    personal_value: STARTING_MONEY,
    money_left: STARTING_MONEY,
    gains: 0,
    losses: 0,
    //roomID: roomID
  }

  fetch(userRef.set(gameInfo));
  /*
  const symbolRef = roomRef.collection(symbol);
  const ts = symbolRef.doc('time_series');
  const ti = symbolRef.doc('technical_indicators'); */

  return roomID;
}

export const getUserShares = async (db, roomID, userID) => {
  const userRef = db.collection('Rooms').doc(roomID)
    .collection('users').doc(userID);

  const userDoc = await userRef.get();
  const userData = userDoc.data();
  return userData.investments;
}

export const getUserBalance = async (db, roomID, userID) => {
  const userRef = db.collection('Rooms').doc(roomID)
    .collection('users').doc(userID);

  const userDoc = await userRef.get();
  const userData = userDoc.data();
  return userData.money_left;
}
export const getChartUrl = async(db,roomId,symbol,periodLen,endDate) =>{
  var formData = new FormData();
  formData.append('symbol',symbol);
  formData.append('periodLen',periodLen)
  formData.append('RoomId',roomId)
  formData.append('end-date',endDate)

  fetch('http://localhost:8080/get-stock-image', {
      method: 'POST',
      body: formData
    })
  .then(res => res.json())
  .then((data) => {
    return data['Stockpublic_image_url']
  }).catch(function() {
    console.log("error");
  });
}
export const getTechnicalUrl = async(db,roomId,symbol,periodLen,endDate) =>{
  var formData = new FormData();
  formData.append('symbol',symbol);
  formData.append('periodLen',periodLen)
  formData.append('RoomId',roomId)
  formData.append('end-date',endDate)
  fetch('http://localhost:8080/get-stock-image', {
      method: 'POST',
      body: formData
    })
  .then(res => res.json())
  .then((data) => {
    return [data['RSIpublic_image_url'],data['MACDpublic_image_url'],data['ADXpublic_image_url']]
  }).catch(function() {
    console.log("error");
  });
}

/*
// TODO: request the time series via HTTP POST request
export const requestTimeSeries = (symbol) => {
  
  const date = DATES[0]
} */

export const getDate = async (db, roomID) => {
  const roomDoc = await db.collection('Rooms').doc(roomID).get();
  const roomData = roomDoc.data();
  return roomData.dates[roomData.day_index];
}

// TODO: update this once time_series data comes in
// to actually get the price and not just the date
export const getCurrentPrice = async (db,symbol,roomID,endDates) => {
  var formData = new FormData();
  formData.append('symbol',symbol);
  formData.append('RoomId',roomID);
  formData.append('end-date',endDates);
  fetch('http://localhost:8080/get-prices', {
      method: 'POST',
      body: formData
    })
  .then(res => res.json())
  .then((data) => {
  console.log(roomID + "RoomID")
  const Price = db.collection('Rooms').doc(roomID).collection(symbol).doc('Prices');
  const priceData = Price.data();
  db.collection('Rooms').doc(roomID).get().then((data) =>{
    const roomData = data.data();
    return priceData.prices[roomData.day_index];
  }
  );
  })
}

export const advanceDay = async (db, roomID) => {
  const roomRef = await db.collection('Rooms').doc(roomID);
  roomRef.update({
    day_index: firebase.firestore.FieldValue.increment(1)
  });
}

export const makeInvestment = (db, roomID, userID, symbol, price, num_shares) => {
  
  const invJSON = {
    "symbol": symbol,
    "share_price": price,
    "num_shares": num_shares,
    //"total_purchase_price": price * num_shares
  }

  console.log(JSON.stringify(invJSON));

  //const invObj = new Investment(symbol, price, num_shares);
  //const invJSON = invObj.to_dict();
  
  const userRef = db.collection('Rooms').doc(roomID)
    .collection('users').doc(userID);

  const moneySpent = (price * num_shares) * -1;

  // add investment and update money_left
  userRef.update({
    investments: firebase.firestore.FieldValue.arrayUnion(invJSON),
    money_left: firebase.firestore.FieldValue.increment(moneySpent)
  });
}