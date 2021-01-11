import React, { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import "./GameRoom.css";
import useGame from "./useGame";
import Board from "./Board";

export const GameRoomContext = React.createContext();

const GameRoom = (props) => {
  console.log("GameRoom rendered")

  const { roomId } = props.match.params;
  const [board, sendMove, playerColor, history] = useGame(roomId);
  const playerViewBoard = (playerColor === 'w')? board.flat() : board.flat().reverse();

  console.log(`Player color: ${playerColor}`)

  // May need to make context a state of GameRoom or useRef it.
  // For more info, look up "Caveats" in react doc
  const context = {
    board: board,
    move: sendMove,
    playerColor: ""
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="game-room-container">
        <div className="board-container">
          <GameRoomContext.Provider value={context}>
            <Board board={playerViewBoard} playerColor={playerColor} move={sendMove} history={history} />
          </GameRoomContext.Provider>
        </div>
      </div>
    </DndProvider>
  );
};

export default GameRoom;