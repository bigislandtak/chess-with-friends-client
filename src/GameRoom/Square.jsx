import React from "react";
import Piece from "./Piece";
import { useDrop } from "react-dnd";

const LIGHT = " #EEEED2";
const DARK = "#769656";
const ACTIVE_LIGHT = "#F6F669";
const ACTIVE_DARK = "#BACA2B";
const HOVER_LIGHT = "#F9F9EF";
const HOVER_DARK = "#CFDAC4";

const Square = (props) => {
    const className = (props.color === 'b')? "square-dark" : "square-light";
    const squareColor = (props.color === 'b')? DARK : LIGHT;
    const activeSquareColor = (props.color === 'b')? ACTIVE_DARK : ACTIVE_LIGHT;
    const hoverSquareColor = (props.color === 'b')? HOVER_DARK : HOVER_LIGHT;

    const [{ isOver }, drop] = useDrop({
        accept: "piece",
        drop: (item) => {
            const [from] = item.id.split('_');
            const move = { from: from, to: props.position };
            props.onClick("none");
            const pieceContainer = document.getElementById(`piece-container-${from}`);
            pieceContainer.style.boxShadow = "none";
            props.move(move);
        },
        collect: (monitor) => {
            return { isOver: !!monitor.isOver() };
        }
    });
    
    const lastMoveFrom = props.history.length > 0 && props.history[props.history.length - 1].from;
    const lastMoveTo = props.history.length > 0 && props.history[props.history.length - 1].to;
    const piece = (props.piece)? 
        <Piece 
            piece={props.piece} 
            playerColor={props.playerColor} 
            position={props.position} 
            squareColor={squareColor} 
            activeSquareColor={activeSquareColor} 
            // onClick={() => props.onClick(props.position)}
            pickedPiece={props.pickedPiece}
        /> : 
        <div>&nbsp;</div>;

    return (
        <div 
            className={className} 
            ref={drop} 
            onClick={() => props.onClick(props.position)}
            style={{ 
                // opacity: isOver? 0.5 : 1,
                border: isOver? `5px solid ${hoverSquareColor}` : "none",
                backgroundColor: (lastMoveFrom === props.position || lastMoveTo === props.position)? activeSquareColor : squareColor
            }}
        >
            {piece}
        </div>
    );
};

export default Square;