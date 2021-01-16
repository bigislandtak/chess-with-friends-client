import React from "react";
import Square from "./Square";

const Board = (props) => {
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

    const squares = props.board.map((piece, squareIdx) =>
        <div key={squareIdx} className="square-container">
            <Square 
                piece={piece} 
                color={getSquareColor(squareIdx)} 
                position={getSquarePosition(squareIdx)}
                playerColor={props.playerColor}
                move={props.move}
                history={props.history}
                getMoves={props.getMoves}
            />
        </div>
    );

    return (
        <div className="board">
            {squares}
        </div>
    );
};

export default Board;