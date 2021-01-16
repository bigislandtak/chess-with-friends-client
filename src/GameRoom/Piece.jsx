import React from "react";
import { useDrag } from "react-dnd";

const Piece = (props) => {
    const [{ isDragging }, drag] = useDrag({
        item: { 
            type: "piece", 
            id: `${props.position}_${props.piece.type}_${props.piece.color}` 
        },
        collect: (monitor) => {
            return { isDragging: !!monitor.isDragging() };
        }
    });

    // const [{ isOver }, drop] = useDrop({
    //     accept: "piece",
    //     collect: (monitor) => {
    //         return { isOver: !!monitor.isOver() };
    //     }
    // });
    
    const piece = `${process.env.PUBLIC_URL}/assets/${props.piece.type}_${props.piece.color}.png`;  
    const whiteToBlackCol = {
        "a": "h",
        "b": "g",
        "c": "f",
        "d": "e",
        "e": "d",
        "f": "c",
        "g": "b",
        "h": "a",
    };

    const whiteToBlackRow = {
        "1": "8",
        "2": "7",
        "3": "6",
        "4": "5",
        "5": "4",
        "6": "3",
        "7": "2",
        "8": "1",
    };

    const col = (props.playerColor === 'w')? props.position.charAt(0) : whiteToBlackCol[props.position.charAt(0)];
    const row = (props.playerColor === 'w')? props.position.charAt(1) : whiteToBlackRow[props.position.charAt(1)];
    const pieceClassName = `piece ${col} _${row}`;

    return (
        <>
            <div 
                className="piece-container"
                style={{
                    boxShadow: isDragging? "inset 0px 0px 25px 5px #BDE3AC, 0px 0px 25px 5px #BDE3AC" : "none",
                }}
            >
                <img 
                    className={pieceClassName} 
                    // ref={drop}
                    src={piece} 
                    alt={props.piece.type} 
                    ref={drag} 
                    style={{ 
                        maxHeight: isDragging? "0%" : "200%",
                    }}
                />
            </div>
        </>
    );
};

export default Piece;