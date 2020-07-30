import {db} from "../../src/firebase.js"
import * as fireaccess from '../../src/components/firebase-access.jsx';

import "@babel/polyfill";
import 'regenerator-runtime/runtime';
import { assert } from 'chai'; 

const ROOMS = 'Rooms';
const ROOMID = 'mockroom';
const USERS = 'users';
const USERID = 'mockuser';
const SYMBOLS = ['mockstock'];
const NUMSYMBOLS = 1;
const ROUNDS = 2;
const STARTINGMONEY = 100;
const DAYINDEX = 0;
const NICKNAME = 'mockname';
const INVESTMENTS = 'investments';

const SYMBOL_PRICES = [5, 10];

var roomRef = null;
var symbolRef = null;
var userRef = null;

/* load in mock data */
export const setUpMockRoom = () => {

  // mock room info
  roomRef = db.collection(ROOMS).doc(ROOMID);

  const PASSWORD = '';
  const ROOMINFO = {
    dates: ['mock0', 'mock1'],
    day_index: DAYINDEX,
    password: PASSWORD,
    phase: null,
    starting_money: STARTINGMONEY,
    symbols: SYMBOLS
  };
  roomRef.set(ROOMINFO);

  // mock symbol info
  symbolRef = roomRef.collection(SYMBOLS[0]);
  userRef = roomRef.collection(USERS).doc(USERID);
}

export const addMockSymbolData = () => {
  const pricesRef = symbolRef.doc('Prices');
  pricesRef.set({prices: SYMBOL_PRICES});
}

export const addMockUser = () => {
  const emptyShares = Array.from(Array(NUMSYMBOLS), () => 0);
  const gameInfo = {
    userId: USERID,
    nickname: NICKNAME,
    net_worth: STARTINGMONEY,
    money_left: STARTINGMONEY,
    curShares: emptyShares
  };

  userRef.set(gameInfo);
  
  for (var roundIndex = 0; roundIndex < ROUNDS; roundIndex++) {
    userRef.collection(INVESTMENTS).doc(roundIndex.toString()).set({
      change: emptyShares
    });
  }
}

/*************** UNIT TESTS ***************/

setUpMockRoom();
addMockSymbolData();
var dbRoundPrices = null;

describe("test getPrices", () => {
  it("check prices is accurate", async () => {
    dbRoundPrices = await fireaccess.getPrices(ROOMID, DAYINDEX);
    assert.isArray(dbRoundPrices, "prices is not an array");
    assert.deepEqual([5], dbRoundPrices);
  }).timeout(5000);
});


addMockUser();

export const verifyHelper = async (changeArray) => {
  return await fireaccess.verifyOk(ROOMID, USERID, DAYINDEX,
    changeArray, dbRoundPrices);
}

describe("test makeInvestment methods", () => {

  // represents buying two shares of symbol0
  const CHANGEARRAY = [2];  

  it('check changeCash', async () => {
    await fireaccess.changeCash(ROOMID, USERID, DAYINDEX, CHANGEARRAY, dbRoundPrices);

    // user started with $100 and bought two shares @ $5 each, so
    // money left should have been updated to $90.
    const dbUserDoc = await db.collection(ROOMS).doc(ROOMID)
      .collection(USERS).doc(USERID).get();
    const dbUserData = dbUserDoc.data();

    assert.exists(dbUserData, "userData is undefined!");

    const dbMoney = dbUserData.money_left;
    assert.equal(90, dbMoney);
  }).timeout(5000);

  it("check changeShares", async () => {
    await fireaccess.changeShares(ROOMID, USERID, DAYINDEX, CHANGEARRAY);

    // expected: current shares are updated in portfolio
    const dbUserDoc = await db.collection(ROOMS).doc(ROOMID)
      .collection(USERS).doc(USERID).get();
    const dbUserData = dbUserDoc.data();

    const dbShares = dbUserData.curShares;
    assert.deepEqual(CHANGEARRAY, dbShares);    

    // also expected: records that user bought 2 shares of symbol0 in investments collection
    const dbInvestmentsRoundDoc = await db.collection(ROOMS).doc(ROOMID).collection(USERS)
      .doc(USERID).collection(INVESTMENTS).doc(DAYINDEX.toString()).get();
    const dbInvestmentsRoundData = dbInvestmentsRoundDoc.data();

    const roundInvestmentsArray = dbInvestmentsRoundData.change;
    assert.deepEqual(CHANGEARRAY, roundInvestmentsArray);
  }).timeout(5000);

  it("check verifyOk", async () => {

    assert.isTrue(await verifyHelper([2]), 
      "verifyOk failed - thought an OK trade was bad");
    assert.isTrue(await verifyHelper([0]), 
      "verifyOk failed - thought an OK trade was bad");
    assert.isTrue(await verifyHelper([5]), 
      "verifyOk failed - thought an OK trade was bad");

    assert.isFalse(await verifyHelper([400]), 
      "verifyOk failed - thought an OK trade was bad");
    assert.isFalse(await verifyHelper([10000]), 
      "verifyOk failed - thought an OK trade was bad");
    assert.isFalse(await verifyHelper([-10]), 
      "verifyOk failed - thought an OK trade was bad");  // no shares to sell
  }).timeout(5000);
});

describe("test advanceDay", () => {
  
  it("check value is increased by one", async () => {
    fireaccess.advanceDay(ROOMID);

    const dbRoomDoc = await db.collection(ROOMS).doc(ROOMID).get();
    const dbRoomData = dbRoomDoc.data();
    const dbDayIndex = dbRoomData.day_index;

    assert.equal((DAYINDEX+1), dbDayIndex);
  }).timeout(5000);
});