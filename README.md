# Tactical Thrones

Tactical Thrones is a turn-based, chess-like strategy game built using Express and Socket.io. The game features three unique types of pieces: Pawns, Hero 1, and Hero 2. Players take turns moving their pieces according to specific rules, with the goal of outmaneuvering their opponent and capturing all of their pieces.


![ss - Tactical thrones](https://github.com/user-attachments/assets/4c8d0045-5590-4ae2-a9d6-b9f2f9ec166c)

## Project Setup
To get started with Tactical Thrones, follow the steps below:

### 1. Download the Zip file or clone the repo
Unzip the file, then run the following command:
```
cd Ansh_Meshram-21BCE10396-main
```

Then follow the steps given below to setup the application:

#### 2. Install Libraries & framework
First, install the Express framework & socket.io to handle server-side routing :
```
npm install express
npm install socket.io
```

### 2. To run the application
Run the command:
```
node app.js
```

## Project Features

- *Three Unique Piece Types*: Tactical Thrones features three different kinds of pieces:
  - *Pawns*:
      - Move horizontally or vertically, one step at a time.
      - Move commands: L (Left), R (Right), F (Forward), B (Backward)
  
  - *Hero 1*:
      - Moves in any of the eight possible directions (horizontally, vertically, or diagonally), one step at a time.
      - Move commands: L (Left), R (Right), F (Forward), B (Backward), FL (Forward-Left), FR (Forward-Right), BL (Backward-Left), BR (Backward-Right)

  - *Hero 2*:
      - Moves diagonally, one step at a time.
      - Move commands: FL (Forward-Left), FR (Forward-Right), BL (Backward-Left), BR (Backward-Right)

- *Strategic Gameplay*: The game continues as long as both players have pieces on the board. The first player to capture all of their opponent's pieces wins. If a player runs out of pieces, the other player is declared the winner and the game ends.

- *Move History*: A detailed move history section tracks all moves made by both players throughout the game, providing a complete log of the match.

Here is the Demo Video:

[![Watch the video](https://github.com/user-attachments/assets/7645af8e-0cd3-4e86-909f-849ddd5c0f34)](https://github.com/user-attachments/assets/7ef11173-ddeb-485d-857d-72f892878509)
