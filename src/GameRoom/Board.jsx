import React, { useState, useContext } from "react";
import { GameRoomContext } from "./GameRoom";
import Square from "./Square";

const Board = (props) => {
    console.log("Board rendered")

    const context = useContext(GameRoomContext);

    const getCoordinates = (squareIdx) => {
        const x = (props.playerColor === 'w')? squareIdx % 8 : Math.abs(squareIdx % 8 - 7);
        const y = (props.playerColor === 'w')? Math.abs(Math.floor(squareIdx / 8) - 7) : Math.floor(squareIdx / 8);
        return [x, y];
    };

    const getSquarePosition = (squareIdx) => {
        const cols = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        const [x, y] = getCoordinates(squareIdx);
        return `${cols[x]}${y + 1}`;
    };
    
    const getSquareColor = (squareIdx) => {
        const [x, y] = getCoordinates(squareIdx);
        const color = ((x + y) % 2 === 0)? 'b' : 'w';
        return color;
    };
    
    const pieces = props.board.map((piece, squareIdx) =>
        <div key={squareIdx} className="square-container">
            <Square 
                piece={piece} 
                color={getSquareColor(squareIdx)} 
                position={getSquarePosition(squareIdx)}
                move={props.move}
                history={props.history}
                // squareIdx={squareIdx} 
                // onClickPiece={handleClickPiece(squareIdx)}
                // onClickSquare={handleClickSquare}
                // style={{
                //     border: states.borders[squareIdx]
                // }}
            />
        </div>
    );

    return (
        <div className="board">
            {pieces}
        </div>
    );
};

export default Board;