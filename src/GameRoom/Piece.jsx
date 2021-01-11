import React from "react";
import { useDrag, DragPreviewImage } from "react-dnd";

const Piece = (props) => {
    const [{ isDragging }, drag, preview] = useDrag({
        item: { 
            type: "piece", 
            id: `${props.position}_${props.piece.type}_${props.piece.color}` 
        },
        collect: (monitor) => {
            return { isDragging: !!monitor.isDragging() };
        }
    });
    
    const piece = `assets/${props.piece.type}_${props.piece.color}.png`;   

    return (
        <>
            <DragPreviewImage connect={preview} src={piece} className="preview"/>
            <div 
                className="piece-container"
                ref={drag} 
                style={{ 
                    opacity: isDragging? 0 : 1
                }}
            >
                <img src={piece} alt={props.piece.type} className="piece" />
            </div>
        </>
    );
};

export default Piece;