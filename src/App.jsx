import Player from "./components/Player";
import { useState } from "react";
import GameBoard from "./components/GameBoard";
import Logs from "./components/Logs";
import { WINNING_COMBINATIONS } from "./winning-combinations";
import GameOver from "./components/GameOver";

const initialGameBoard = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

function driveActivePlayer(gameTurn) {
  let currentPlayer = "x";
  if (gameTurn.length > 0 && gameTurn[0].player === "x") {
    currentPlayer = "0";
  }
  return currentPlayer;
}

function App() {
  const [gameTurn, setGameTurn] = useState([]);
  const [players, setPlayers] = useState({
    x: "player 1",
    0: "player 2",
  });

  const activePlayer = driveActivePlayer(gameTurn);
  let gameBoard = [...initialGameBoard.map((array) => [...array])];

  for (const turn of gameTurn) {
    const { square, player } = turn;
    const { row, col } = square;
    gameBoard[row][col] = player;
  }

  let winner;
  for (const combination of WINNING_COMBINATIONS) {
    const firstSquare = gameBoard[combination[0].row][combination[0].col];
    const secondSquare = gameBoard[combination[1].row][combination[1].col];
    const thirdSquare = gameBoard[combination[2].row][combination[2].col];
    if (
      firstSquare &&
      firstSquare === secondSquare &&
      firstSquare === thirdSquare
    ) {
      winner = players[firstSquare];
    }
  }

  const hasDraw = gameTurn.length === 9 && !winner;

  function handleSelectedSquare(rowIndex, colIndex) {
    setGameTurn((prevTurn) => {
      const currentPlayer = driveActivePlayer(prevTurn);
      const updatedTurn = [
        {
          square: {
            row: rowIndex,
            col: colIndex,
          },
          player: currentPlayer,
        },
        ...prevTurn,
      ];
      return updatedTurn;
    });
  }

  function handleRestart() {
    setGameTurn([]);
  }

  function handlePlayerNameChanged(symbol, newName) {
    setPlayers((prevPlayer) => {
      return {
        ...prevPlayer,
        [symbol]: newName,
      };
    });
  }

  return (
    <main>
      <div id="game-container">
        <ol id="players" className="highlight-player">
          <Player
            initialName="player 1"
            symbol="x"
            isActive={activePlayer === "x"}
            onChangeName={handlePlayerNameChanged}
          />
          <Player
            initialName="player 2"
            symbol="0"
            isActive={activePlayer === "0"}
            onChangeName={handlePlayerNameChanged}
          />
        </ol>
        {(winner || hasDraw) && (
          <GameOver winner={winner} onRestart={handleRestart} />
        )}
        <GameBoard onSelectedSquare={handleSelectedSquare} board={gameBoard} />
      </div>
      <Logs turns={gameTurn} />
    </main>
  );
}

export default App;
