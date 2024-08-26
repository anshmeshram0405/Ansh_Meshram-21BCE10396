const socket = io();
let playerId;

document.addEventListener("DOMContentLoaded", () => {
  playerId = prompt("Enter your player ID (A or B):");
  socket.emit("joinGame", playerId);

  socket.on("gameJoined", (gameState) => {
    renderBoard(gameState);
    updateStatus(`Waiting for another player...`);
  });

  socket.on("startGame", (gameState) => {
    renderBoard(gameState);
    updateStatus(`Game started! Player ${gameState.turn}'s turn.`);
  });

  socket.on("gameStateUpdate", (gameState) => {
    renderBoard(gameState);
    updateStatus(`Player ${gameState.turn}'s turn.`);
  });

  socket.on("invalidMove", (data) => {
    alert(data.message);
  });

  socket.on("gameOver", (data) => {
    alert(`Game Over! Player ${data.winner} wins!`);
    updateStatus(`Game Over! Player ${data.winner} wins!`);
  });
});

function renderBoard(gameState) {
  const gameBoard = document.getElementById("game-board");
  gameBoard.innerHTML = "";

  gameState.board.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      const cellElement = document.createElement("div");
      cellElement.className = "cell";
      cellElement.textContent = cell ? `${cell}` : "";
      if (cellElement.textContent.includes("A")) {
        cellElement.style.color = "red";
      } else if (cellElement.textContent.includes("B")) {
        cellElement.style.color = "green";
      }
      if (cell && cell[0] === playerId) {
        cellElement.addEventListener("click", () =>
          selectCharacter(rowIndex, colIndex, gameState)
        );
      }
      gameBoard.appendChild(cellElement);
    });
  });
}

function selectCharacter(row, col, gameState) {
  const direction = prompt(
    "Enter your move direction (L, R, F, B, FL, FR, BL, BR):"
  );
  console.log("direction mil gayiiii outsideee");

  if (direction) {
    console.log("direction mil gayiiii");
    const character = gameState.board[row][col];
    const move = `${character}:${direction}`;
    socket.emit("makeMove", move);
  }
}

//Update the move history 
socket.on("moveHistory", (history) => {
  updateMoveHistory(history);
});

//updateMoveHistory is called when moveHistory is triggered
function updateMoveHistory(history) {
  const moveHistoryElement = document.getElementById("moveHistory");
  moveHistoryElement.innerHTML = "";
  history.forEach((move) => {
    const moveElement = document.createElement("li");
    moveElement.textContent = move;
    moveHistoryElement.appendChild(moveElement);
  });
}

//game Status updation
function updateStatus(message) {
  document.getElementById("status").textContent = message;
}
