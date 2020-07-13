'use strict';

var db = firebase.firestore();
var roomID = null;
const STARTING_MONEY = 10000;
var userNumber = 0;

const SYMBOL = 'GOOG';
const GOOG_TS = [100, 200, 150];

function init() {
  setUpFirestoreForRoom();
}

async function setUpFirestoreForRoom() {
  const roomRef = db.collection('rooms').doc();  // makes rooms (collection) --> roomID (document)
  roomID = roomRef.id;

  // TODO: send POST request to get time series data for GOOG
  // for prototype, hard-code 3 points in JSON format
  roomRef.set({
    day_index: 0,
    GOOG: GOOG_TS
  });

  const userRef = roomRef.collection(`user${userNumber}`);

  const gameInfo = {
    investments: [],
    personal_value: STARTING_MONEY,
    money_left: STARTING_MONEY,
    gains: 0,
    losses: 0,
  }

  const gameInfoRes = await userRef.doc('game-info').set(gameInfo);
}

function buy() {

  getPriceFromFirestore().then(price => {

    const invObj = new Investment(SYMBOL, price, 5);
    const inv = invObj.to_dict();
    const userRef = db.collection('rooms').doc(roomID).collection(`user${userNumber}`);
    const gameInfoRef = userRef.doc('game-info');

    // add investment and update money_left
    gameInfoRef.update({
      investments: firebase.firestore.FieldValue.arrayUnion(inv),
      money_left: firebase.firestore.FieldValue.increment(-500)
    });
  })
}

async function getPriceFromFirestore() {
  const roomDoc = await db.collection('rooms').doc(roomID).get();
  const roomData = roomDoc.data();
  return roomData.GOOG[roomData.day_index];
}

