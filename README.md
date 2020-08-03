# Stock Market Simulation Game

For our capstone project as a part of our STEP Internship at Google, we created a Stock Market Simulation Game web application.

## Game

This is a multiplayer game. One user, the 'Host,' will create a room and share the room ID with friends. Once friends have joined
the room, the host can start the game.

The players will then progress through rounds of the game, where at each round they can choose to buy, sell, or hold their mock
investments. The host has the ability to proceed to the next round. If players do not make any trades before the host proceeds to
the next round, it is assumed that they chose to hold all of their investments.

At the end of the game, all users are presented with a leaderboard, ordered by players' net worth at the end of the game.

## Implementation

- The `stock-backend` folder contains all files relating to retrieving stock market data.
  - The backend is written in Python. Functions include getting stock prices, calculating technical indicators, and graphing technical indicators.
  - These functions are all hosted on Google Cloud Platform's Cloud Functions.
- The `src` folder contains all files relating to the frontend. This includes the pages of the game and interactions with the database.
  - The frontend is written in Javascript + React framework. Functions include room creation, game-play, and reading from/writing to the database.
  - The frontend is hosted on Firebase.

## Testing

Unit tests can be found in the `tests` folder.
