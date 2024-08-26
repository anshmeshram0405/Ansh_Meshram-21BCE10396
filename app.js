const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const port = process.env.PORT || 3000;
let moveHistory = [];
let players = {};
let gameState = {
  board: Array(5)
    .fill()
    .map(() => Array(5).fill(null)),
  turn: "A",
  characters: {
    A: ["A-P1", "A-H1", "A-H2", "A-P2", "A-P3"],
    B: ["B-P1", "B-H1", "B-H2", "B-P2", "B-P3"],
  },
};

app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  console.log("A user connected: ", socket.id);

  socket.on("joinGame", (playerId) => {
    if (Object.keys(players).length < 2) {
      players[socket.id] = playerId;
      socket.emit("gameJoined", gameState);

      if (Object.keys(players).length === 2) {
        setupInitialPositions();
        io.emit("startGame", gameState);
      }
    }
  });

  socket.on("makeMove", (move) => {
    console.log("mov made d d ");
    if (players[socket.id] !== gameState.turn) return;
    const [character, direction] = move.split(":");
    const isValid = processMove(players[socket.id], move);

    if (isValid) {
      // ${moveResult.captured ? `(Captured ${moveResult.captured})` : ''}
      moveHistory.push(`${character}: ${direction}`);
      gameState.turn = gameState.turn === "A" ? "B" : "A"; // Switch turn
      io.emit("gameStateUpdate", gameState);
      io.emit("moveHistory", moveHistory);
      const winner = checkWinner();
      if (winner) {
        io.emit("gameOver", { winner });
        resetGame();
      }
    } else {
      socket.emit("invalidMove", { message: "Invalid move!" });
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected: ", socket.id);
    delete players[socket.id];
  });
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

function setupInitialPositions() {
  gameState.board[0] = gameState.characters.A;
  gameState.board[4] = gameState.characters.B;
}

// Process player moves
function processMove(player, move) {
  const [character, direction] = move.split(":");
  const playerChars = gameState.characters[player];
  const goti = character.substr(2, 2);
  let row, col;

  if (
    (goti === "P1" || goti === "P2" || goti === "P3") &&
    (direction === "FL" ||
      direction === "FR" ||
      direction === "BL" ||
      direction === "BR")
  ) {
    return false;
  }

  if (
    goti === "H2" &&
    (direction === "F" ||
      direction === "B" ||
      direction === "L" ||
      direction === "R")
  ) {
    return false;
  }
  // Find character position on the board
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      if (gameState.board[i][j] === character) {
        row = i;
        col = j;
        break;
      }
    }
  }

  if (row === undefined || col === undefined) return false;

  let newRow = row;
  let newCol = col;

  switch (direction) {
    case "L":
      newCol -= 1;
      break;
    case "R":
      newCol += 1;
      break;
    case "F":
      newRow += player === "A" ? 1 : -1;
      break;
    case "B":
      newRow += player === "A" ? -1 : 1;
      break;
    case "FL":
      newRow += player === "A" ? 1 : -1;
      newCol -= 1;
      break;
    case "FR":
      newRow += player === "A" ? 1 : -1;
      newCol += 1;
      break;
    case "BL":
      newRow += player === "A" ? -1 : 1;
      newCol -= 1;
      break;
    case "BR":
      newRow += player === "A" ? -1 : 1;
      newCol += 1;
      break;
    default:
      return false;
  }

  if (newRow < 0 || newRow > 4 || newCol < 0 || newCol > 4) return false;

  const target = gameState.board[newRow][newCol];
  if (target && target[0] === player) return false;

  gameState.board[row][col] = null;
  gameState.board[newRow][newCol] = character;

  return true;
}

function checkWinner() {
  const aAlive = gameState.board.flat().some((char) => char && char[0] === "A");
  const bAlive = gameState.board.flat().some((char) => char && char[0] === "B");

  if (!aAlive) return "B";
  if (!bAlive) return "A";

  return null;
}

function resetGame() {
  gameState = {
    board: Array(5)
      .fill()
      .map(() => Array(5).fill(null)),
    turn: "A",
    characters: {
      A: ["A-P1", "A-H1", "A-H2", "A-P2", "A-P3"],
      B: ["B-P1", "B-H1", "B-H2", "B-P2", "B-P3"],
    },
  };
  setupInitialPositions();
}
