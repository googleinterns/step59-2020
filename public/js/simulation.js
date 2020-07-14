'use strict';

var db = firebase.firestore();
var roomID = null;
const STARTING_MONEY = 10000;
var userNumber;

const SYMBOL = 'GOOG';
const GOOG_TS = [100, 200, 150];
var currentPrice = -1;

async function init() {
  console.log("before: " + userNumber);
  authenticate();
  const uid = firebase.auth().currentUser.uid;
  console.log("userid: " + userNumber);
  
  // ensure the room is set up before accessing any info
  // by having functions execute sequentially
  await setUpFirestoreForRoom();
  await updateDisplayInfo();

  //document.getElementById('shares-form').style.visibility = "hidden";
}

async function updateDisplayInfo() {
  currentPrice = await getPriceFromFirestore();

  // get number of shares and money remaining
  const userGameInfoRef = await db.collection('rooms').doc(roomID)
    .collection(`user${userNumber}`).doc('game-info').get();
  const userGameInfoDoc = userGameInfoRef.data();

  const numShares = userGameInfoDoc.investments.length;
  const moneyLeft = userGameInfoDoc.money_left;

  const priceInfo = "The current price of " + SYMBOL + " is $" + currentPrice;
  const sharesInfo = "You currently hold " + numShares + " shares.";
  const moneyInfo = "You have $" + moneyLeft + " available to spend.";

  document.getElementById('price').innerHTML = priceInfo;
  document.getElementById('usr-current-shares').innerHTML = sharesInfo;
  document.getElementById('usr-available-money').innerHTML = moneyInfo;
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

// make number of shares visible when user selects "buy" option
function buy() {
  //document.getElementById('shares-form').style.visibility = "visible";
}

function makeInvestment() {
  //const userNumShares = document.getElementById('num-shares').value;
  //console.log(userNumShares);

  const invObj = new Investment(SYMBOL, price, 5);
  const inv = invObj.to_dict();
  const userRef = db.collection('rooms').doc(roomID).collection(`user${userNumber}`);
  const gameInfoRef = userRef.doc('game-info');

  // add investment and update money_left
  gameInfoRef.update({
    investments: firebase.firestore.FieldValue.arrayUnion(inv),
    money_left: firebase.firestore.FieldValue.increment(-500)
  });
}

async function getPriceFromFirestore() {
  const roomDoc = await db.collection('rooms').doc(roomID).get();
  const roomData = roomDoc.data();
  return roomData.GOOG[roomData.day_index];
}

function authenticate() {
  var provider = new firebase.auth.GoogleAuthProvider();

  // display pop-up for user to sign in to Google account
  firebase.auth().signInWithPopup(provider).then(function(result) {
  // This gives you a Google Access Token. You can use it to access the Google API.
  var token = result.credential.accessToken;

  // The signed-in user info.
  var user = result.user;

  }).catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // The email of the user's account used.
  var email = error.email;
  // The firebase.auth.AuthCredential type that was used.
  var credential = error.credential;
  // ...

  /* NOTE: SIGN OUT THE USER ONCE SHE HAS FINISHED THE GAME 
  firebase.auth().signOut().then(function() {
    // Sign-out successful.
    }).catch(function(error) {
    // An error happened.
    }); */
  });
}