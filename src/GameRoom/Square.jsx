import React, { useState } from "react";
import Piece from "./Piece";
import { useDrop } from "react-dnd";

const LIGHT = " #f0f0b4";
const DARK = "#6f8f4f";
const LAST_MOVE = "#d3e84a";
const LAST_MOVE_LIGHT = "#dbdb8f";
const LAST_MOVE_DARK = "#96a152";

const Square = (props) => {
    const className = (props.color === 'b')? "square-dark" : "square-light";
    const squareColor = (props.color === 'b')? DARK : LIGHT;
    const lastMoveSquareColor = (props.color === 'b')? LAST_MOVE_DARK : LAST_MOVE_LIGHT;

    const [{ isOver }, drop] = useDrop({
        accept: "piece",
        drop: (item) => {
            const [from] = item.id.split('_');
            const move = { from: from, to: props.position };
            props.move(move);
        },
        collect: (monitor) => {
            return { isOver: !!monitor.isOver() };
        }
    });

    const piece = (props.piece)? <Piece piece={props.piece} position={props.position} /> : <div>&nbsp;</div>;
    const lastMoveFrom = props.history.length > 0 && props.history[props.history.length - 1].from;
    const lastMoveTo = props.history.length > 0 && props.history[props.history.length - 1].to;
    
    return (
        <div 
            className={className} 
            ref={drop} 
            style={{ 
                backgroundColor: (lastMoveFrom === props.position || lastMoveTo === props.position)? lastMoveSquareColor : squareColor, 
                opacity: isOver? 0.75 : 1, 
                // border: isOver? "1px solid white" : "none" 
            }}
        >
            {piece}
        </div>
    );
};

export default Square;