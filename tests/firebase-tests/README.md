# Running the Tests

The unit tests in this folder test the functions in `firebase-access.jsx`, which are all of the reads/writes to Firestore.
These tests utilize the Mocha unit testing framework, the Chai assertion library, and the Sinon JS mocking library.

## Installation

`cd` into the `step59-2020` folder, then run
```
npm install
```
to install all dependencies (which can be found in `package.json`).

## Usage

To switch the database from production to local (emulator), navigate to line 34 of `src/firebase.js`, and change the
`useLocalhost` variable to `true`.

Then, to run the tests, run the following command from the `step59-2020` folder:
```
firebase emulators:exec --only firestore "npm run test-firestore"
```

## Notes
- If the script does not run, ensure that the `.babelrc` file exists in the `step59-2020` directory.
- If a permission error displays after running the script, check the `firestore.rules` file. To allow all read/write operations to occur without authentication, edit line 6 to contain the following: 
```
allow read, write;
```
