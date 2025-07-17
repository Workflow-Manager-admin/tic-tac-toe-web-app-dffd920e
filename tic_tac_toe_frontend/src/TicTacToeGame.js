import React, { useState } from "react";
import "./TicTacToeGame.css";

// Square component
function Square({ value, onClick, highlight }) {
  return (
    <button
      className={`ttt-square${highlight ? " highlight" : ""}`}
      onClick={onClick}
      aria-label={value ? `Cell with ${value}` : "Empty cell"}
    >
      {value}
    </button>
  );
}

// Board component
function Board({ squares, onCellClick, highlights }) {
  return (
    <div className="ttt-board">
      {squares.map((row, rowIdx) =>
        row.map((cell, colIdx) => (
          <Square
            key={3 * rowIdx + colIdx}
            value={cell}
            onClick={() => onCellClick(rowIdx, colIdx)}
            highlight={highlights && highlights.some(([r, c]) => r === rowIdx && c === colIdx)}
          />
        )),
      )}
    </div>
  );
}

// Simple AI to choose next move
function findAIMove(board) {
  // 1. Win if possible
  for (let i = 0; i < 3; i++)
    for (let j = 0; j < 3; j++)
      if (!board[i][j]) {
        const clone = board.map((row) => row.slice());
        clone[i][j] = "O";
        if (calculateWinner(clone))
          return [i, j];
      }
  // 2. Block opponent
  for (let i = 0; i < 3; i++)
    for (let j = 0; j < 3; j++)
      if (!board[i][j]) {
        const clone = board.map((row) => row.slice());
        clone[i][j] = "X";
        if (calculateWinner(clone))
          return [i, j];
      }
  // 3. Take center
  if (!board[1][1]) return [1, 1];
  // 4. Take any corner
  const corners = [[0,0],[0,2],[2,0],[2,2]];
  for (let [i, j] of corners)
    if (!board[i][j])
      return [i, j];
  // 5. Pick first available
  for (let i = 0; i < 3; i++)
    for (let j = 0; j < 3; j++)
      if (!board[i][j]) return [i, j];
  return null;
}

// Calculate winner and winning line
function calculateWinner(board) {
  const lines = [
    // rows
    [[0,0],[0,1],[0,2]], [[1,0],[1,1],[1,2]], [[2,0],[2,1],[2,2]],
    // cols
    [[0,0],[1,0],[2,0]], [[0,1],[1,1],[2,1]], [[0,2],[1,2],[2,2]],
    // diagonals
    [[0,0],[1,1],[2,2]], [[0,2],[1,1],[2,0]],
  ];
  for (let line of lines) {
    const [[a1,b1],[a2,b2],[a3,b3]] = line;
    if (
      board[a1][b1] &&
      board[a1][b1] === board[a2][b2] &&
      board[a1][b1] === board[a3][b3]
    )
      return { winner: board[a1][b1], line };
  }
  return null;
}

// Main Game component
// PUBLIC_INTERFACE
export default function TicTacToeGame() {
  const [mode, setMode] = useState("pvp"); // pvp or ai
  const [board, setBoard] = useState(Array(3).fill(null).map(() => Array(3).fill(null)));
  const [xIsNext, setXIsNext] = useState(true);
  const [winnerLine, setWinnerLine] = useState(null);

  // For tracking moves to allow draw detection
  const moveCount = board.flat().filter(Boolean).length;

  // AI move after player
  React.useEffect(() => {
    if (mode === "ai" && !xIsNext && !winnerLine) {
      const [aiI, aiJ] = findAIMove(board) || [];
      if (aiI !== undefined && aiJ !== undefined) {
        setTimeout(() => {
          const nextBoard = board.map((row) => row.slice());
          nextBoard[aiI][aiJ] = "O";
          const result = calculateWinner(nextBoard);
          setBoard(nextBoard);
          if (result) setWinnerLine(result.line);
          setXIsNext(true);
        }, 500);
      }
    }
    // eslint-disable-next-line
  }, [xIsNext, mode, winnerLine, board]);

  // Handle cell click
  function handleCellClick(i, j) {
    if (board[i][j] || winnerLine || (mode === "ai" && !xIsNext)) return;
    const newBoard = board.map((row) => row.slice());
    newBoard[i][j] = xIsNext ? "X" : "O";
    const result = calculateWinner(newBoard);

    setBoard(newBoard);
    if (result) setWinnerLine(result.line);
    setXIsNext(!xIsNext);
  }

  // Handle reset
  function handleRestart() {
    setBoard(Array(3).fill(null).map(() => Array(3).fill(null)));
    setXIsNext(true);
    setWinnerLine(null);
  }

  // Status message
  let status = "";
  if (winnerLine) {
    status = board[winnerLine[0][0]][winnerLine[0][1]] === "X"
      ? "X wins!"
      : "O wins!";
  } else if (moveCount === 9) {
    status = "Draw!";
  } else {
    status =
      mode === "pvp"
        ? `Next: ${xIsNext ? "X" : "O"}`
        : xIsNext
          ? "Your move (X)"
          : "AI's move (O)";
  }

  return (
    <div className="ttt-main-container">
      <div className="ttt-settings" role="group" aria-label="Game mode selector">
        <button
          className={`ttt-mode-btn${mode === "pvp" ? " active" : ""}`}
          onClick={() => setMode("pvp")}
        >
          Player vs Player
        </button>
        <button
          className={`ttt-mode-btn${mode === "ai" ? " active" : ""}`}
          onClick={() => setMode("ai")}
        >
          Player vs Computer
        </button>
      </div>
      <div className="ttt-status" role="status">{status}</div>
      <Board squares={board} onCellClick={handleCellClick} highlights={winnerLine} />
      <div className="ttt-controls">
        <button className="ttt-restart-btn" onClick={handleRestart}>Restart</button>
      </div>
    </div>
  );
}
