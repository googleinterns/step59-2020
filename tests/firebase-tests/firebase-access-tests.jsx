import {db} from "../../src/firebase.js"
import * as fireaccess from '../../src/components/firebase-access.jsx';

import "@babel/polyfill";
import 'regenerator-runtime/runtime';
import { assert } from 'chai';
import sinon from 'sinon';

const ROOMS = 'Rooms';
const ROOMID = 'mockroom';
const USERS = 'users';
const USERID = 'mockuser';
const SYMBOLS = ['mockstock'];
const NUMSYMBOLS = 1;
const ROUNDS = 2;
const STARTINGMONEY = 100;
var DAYINDEX = 0;
const NICKNAME = 'mockname';
const INVESTMENTS = 'investments';
const DATES = ['mock0', 'mock1'];

const SYMBOL_PRICES = [5, 10];

var roomRef = null;
var symbolRef = null;
var userRef = null;

/* load in mock data */
const setUpMockRoom = () => {

  // mock room info
  roomRef = db.collection(ROOMS).doc(ROOMID);

  const PASSWORD = '';
  const ROOMINFO = {
    dates: DATES,
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

const addMockSymbolData = () => {
  const pricesRef = symbolRef.doc('Prices');
  pricesRef.set({prices: SYMBOL_PRICES});
}

const addMockUser = () => {
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
  }).timeout(0);
});


addMockUser();

const verifyHelper = async (changeArray) => {
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
  }).timeout(0);

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
  }).timeout(0);

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
  }).timeout(0);
});

describe("test advanceDay", () => {
  
  it("check net_worth is correctly updated", async () => {
      await fireaccess.advanceDay(ROOMID);

      // need to use listener since net worth is updated synchronously
      var unsubscribe = db.collection(ROOMS).doc(ROOMID).collection(USERS)
        .doc(USERID).onSnapshot((userDoc) => {
          const userData = userDoc.data();
          const expectedWorth = 110;

          assert.equal(expectedWorth, userData.net_worth);
        });

      unsubscribe();
  }).timeout(0);

  it("check day_index is updated", async () => {
    var dbRoomDoc = await db.collection(ROOMS).doc(ROOMID).get();
    var dbRoomData = dbRoomDoc.data();
    const dbDayIndex = dbRoomData.day_index;

    DAYINDEX++;

    assert.equal(DAYINDEX, dbDayIndex);
  }).timeout(0);
});

var USER2ID;

describe("test add user", () => {
  it("check correct variables are set", async () => {
    USER2ID = await fireaccess.addUser(ROOMID, 'mock-2');

    // verify info
    const uDoc = await db.collection(ROOMS).doc(ROOMID).collection(USERS)
      .doc(USER2ID).get();

    assert.exists(uDoc, "addUser did not add to db");
    const uData = uDoc.data();

    // check game level info
    assert.equal('mock-2', uData.nickname);
    assert.equal(STARTINGMONEY, uData.net_worth);
    assert.deepEqual([0], uData.curShares);

    const investCol = await db.collection(ROOMS).doc(ROOMID).collection(USERS)
      .doc(USER2ID).collection(INVESTMENTS).get();

    assert.exists(investCol, "addUser did not make an investment collection");
  }).timeout(0);
});

describe("test getLeaders", () => {
  it("confirm order is correct", async () => {
    const leaders = await fireaccess.getLeaders(ROOMID);

    // USERID should be first, then mock-2
    const u1Doc = await db.collection(ROOMS).doc(ROOMID).collection(USERS)
      .doc(USERID).get();
    const u1Data = u1Doc.data();
    assert.exists(u1Data, "USERID data is undefined");

    const u2Doc = await db.collection(ROOMS).doc(ROOMID).collection(USERS)
      .doc(USER2ID).get();
    const u2Data = u2Doc.data();
    assert.exists(u2Data, "USER2ID data is undefined");

    assert.deepEqual(leaders[0], u1Data);
    assert.deepEqual(leaders[1], u2Data);
  })
})

/* ********* Tests involving HTTP requests ********* */

// stub initialize quiz, populate db with mock data
// initialize quiz should set the prices and image urls in db

const PERIODLEN = 1;
const ENDDATE = DATES[1];
const PRICES = 'Prices';
const IMAGES = 'images';

/* make the stub write mock data to database */
const createQuizStub = (initializeQuizStub) => {
  const MOCKURL = 'mock-url';

  initializeQuizStub.callsFake(async () => {

    const symbolIndex = 0;
    symbolRef = db.collection(ROOMS).doc(ROOMID).collection(symbolIndex.toString());

    // set prices data
    symbolRef.doc(PRICES).set({
      prices: SYMBOL_PRICES
    });

    const URLS = {
      ADXpublic_image_url: {
        mock0: MOCKURL,
        mock1: MOCKURL
      },
      MACDpublic_image_url: {
        mock0: MOCKURL,
        mock1: MOCKURL
      },
      RSIpublic_image_url: {
        mock0: MOCKURL,
        mock1: MOCKURL
      },
      Stockpublic_image_url: {
        mock0: MOCKURL,
        mock1: MOCKURL
      }
    };

    // set image urls
    symbolRef.doc(IMAGES).set(URLS);
  });
}

const DATESDICT = {
  "dates": DATES,
  "period": PERIODLEN,
};

const createDatesStub = (initDatesStub) => {
  initDatesStub.callsFake(async () => {
    return DATESDICT;
  })
}

describe("test setUpRoom", () => {
  let initializeQuizStub;
  let initDatesStub;

  beforeEach(() => {
    initializeQuizStub = sinon.stub(fireaccess, "initializeQuiz");
    createQuizStub(initializeQuizStub);

    initDatesStub = sinon.stub(fireaccess, "initDates");
    createDatesStub(initDatesStub);
  });

  afterEach(() => {
    initializeQuizStub.restore();
    initDatesStub.restore();
  });

  // test methods are stubbed properly
  it("test initializeQuiz", async () => {
    const res = await fireaccess.initializeQuiz(SYMBOLS, ROOMID, PERIODLEN, ENDDATE);
    assert.notExists(res, "initQuiz returned something when it shouldn't have.");
  }).timeout(0);

  it("test initDates", async () => {
    const res = await fireaccess.initDates(SYMBOLS, ROUNDS);
    assert.deepEqual(res, DATESDICT);
  }).timeout(0);

  it("test getChartUrls", async () => {
    const symbolIndex = 0;
    const urls = await fireaccess.getChartUrls(ROOMID, symbolIndex.toString(), DAYINDEX);
    assert.exists(urls, "getChartUrls didn't return anything");
    assert.equal(4, urls.length);

    // confirm all of them contain 'mock-url' as url
    urls.forEach((curURL) => {
      assert.deepEqual('mock-url', curURL);
    });
  }).timeout(0);
});
