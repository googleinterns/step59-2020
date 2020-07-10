'use strict';

var db = firebase.firestore();
var userID = null;
const STARTING_MONEY = 10000;

function init() {
  document.getElementById('shares').style.visibility = "hidden";
  setUpFirestoreForUser();
}

function onSymbolEntry() {
  const userSymbol = document.getElementById('usr-symbol').value;
  updateSymbolInDatabase(userSymbol);
}

async function updateSymbolInDatabase(userSymbol) {
  const simRef = db.collection('users').doc(userID).collection('simulation');
  const portfolioRef = simRef.doc('portfolio');

  const portfolioRes = await portfolioRef.update({symbol: userSymbol});
}

async function setUpFirestoreForUser() {
  const portfolio_data = {
    gains: 0,
    money_left: STARTING_MONEY,
    investments: [],
    losses: 0,
    personal_value: STARTING_MONEY,
    symbol: null
  }

  const stats_data = {
    current_price: null,
    day_index: 0,
    time_series: null
  }

  const userDocRef = db.collection('users').doc();
  userID = userDocRef.id;
  const simRef = userDocRef.collection('simulation');

  const portfolioRes = await simRef.doc('portfolio').set(portfolio_data);
  const statsRes = await simRef.doc('stats').set(stats_data);
}