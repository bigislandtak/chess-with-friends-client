import React from "react";
import Piece from "./Piece";
import { useDrop } from "react-dnd";

const LIGHT = " #f0f0b4";
const DARK = "#6f8f4f";
const LAST_MOVE_LIGHT = "#dbdb8f";
const LAST_MOVE_DARK = "#96a152";

const Square = (props) => {
    const className = (props.color === 'b')? "square-dark" : "square-light";
    const squareColor = (props.color === 'b')? DARK : LIGHT;
    const activeSquareColor = (props.color === 'b')? LAST_MOVE_DARK : LAST_MOVE_LIGHT;

    const [{ isOver }, drop] = useDrop({
        accept: "piece",
        drop: (item) => {
            const [from] = item.id.split('_');
            const move = { from: from, to: props.position };
            const moves = props.getMoves();
            let sound, validMove;
            for (let i = 0; i < moves.length; i++) {
                if (move.from === moves[i].from && move.to === moves[i].to) {
                    sound = (moves[i].flags === 'c')? new Audio(`${process.env.PUBLIC_URL}/sounds/capture.mp3`) : new Audio(`${process.env.PUBLIC_URL}/sounds/move.mp3`);
                    validMove = true;
                }
            }
            if (validMove && props.move(move))
                sound.play();
        },
        collect: (monitor) => {
            return { isOver: !!monitor.isOver() };
        }
    });
    
    const lastMoveFrom = props.history.length > 0 && props.history[props.history.length - 1].from;
    const lastMoveTo = props.history.length > 0 && props.history[props.history.length - 1].to;
    let boxShadow = (squareColor === DARK)? "inset 10px -10px 50px 5px #435630" : "inset 10px -10px 50px 5px #999972";
    if (lastMoveFrom === props.position) {
        boxShadow = "inset 0px 0px 10px 5px #FFF797, 0px 0px 25px 5px #FFF797";
    } else if (lastMoveTo === props.position) {
        boxShadow = "inset 0px 0px 20px 10px #FFF797, 0px 0px 25px 10px #FFF797";
    }

    const piece = (props.piece)? <Piece piece={props.piece} playerColor={props.playerColor} position={props.position} squareColor={squareColor} activeSquareColor={activeSquareColor} /> : <div>&nbsp;</div>;

    return (
        <div 
            className={className} 
            ref={drop} 
            style={{ 
                boxShadow: isOver? "inset 0px 0px 20px 10px #FFFFFF, 0px 0px 25px 0px #FFFFFF" : boxShadow,
            }}
        >
            {piece}
            {/* <div 
                className="square-overlay"
                ref={drop}
                style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    zIndex: 1,
                    opacity: 0,
                    pointerEvents: "none"
                }}
            /> */}
        </div>
    );
};

export default Square;