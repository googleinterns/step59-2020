# Running the Tests

The unit tests in this folder test the functions in `firebase-access.jsx`, which are all of the reads/writes to Firestore.
These tests utilize the Mocha unit testing framework and the Chai assertion library.

## Installation

`cd` into the `step59-2020` folder, then run
```
npm install
```
to install all dependencies (which can be found in `package.json`).

## Usage
To run the tests, run the following command:
```
firebase emulators:exec --only firestore "npm run test-firestore"
```

## TODOs

Currently, the local instance of Firestore must be manually added via
```
db.settings({
  host: "localhost:8080",
  ssl: false
});
```
in the `firebase.js` file. In the future, I will add a flag so that the local emulator instance is used only for testing.

## Notes
- If the script does not run, ensure that the `.babelrc` file exists in the `step59-2020` directory.