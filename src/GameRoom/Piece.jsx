import React, { useState } from "react";
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

    const [isSelected, setIsSelected] = useState(false);
    
    const piece = `${process.env.PUBLIC_URL}/assets/old_design/${props.piece.type}_${props.piece.color}.png`;  
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
                id={`piece-container-${props.position}`}
                style={{
                    boxShadow: (isDragging || props.pickedPiece === props.position)? `inset 0px 0px 50px 50px ${props.activeSquareColor}` : "none",
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