import { useState, useEffect, useRef } from "react";
import socketIOClient from "socket.io-client";
const chess = require('chess.js');

const SERVER_URL = "http://localhost:8080";

const useGame = (roomId) => {
    const gameRef = useRef();
    // const colorRef = useRef();
    const socketRef = useRef();
    const [color, setColor] = useState('');
    const [states, setStates] = useState({
        board: [],
        history: []
    });
    
    useEffect(() => {
        // Creates a new chess game
        gameRef.current = chess();

        // Creates a websocket connection
        socketRef.current = socketIOClient(SERVER_URL, {
            query: { roomId }
        });

        // Set board to initial state
        setStates({
            board: gameRef.current.board(),
            history: gameRef.current.history({ verbose: true })
        });

        socketRef.current.on("colorAssignment", color => {
            console.log("Inside colorAssignment")
            setColor(color);
        });

        socketRef.current.on("pgnRequest", fromId => {
            socketRef.current.emit("pgnResponse", gameRef.current.pgn(), fromId);
        });

        socketRef.current.on("syncBoard", pgn => {
            console.log("syncBoard")
            gameRef.current.load_pgn(pgn);
            setStates({
                board: gameRef.current.board(),
                history: gameRef.current.history({ verbose: true })
            });
        });
        
        // Listen for incoming moves
        socketRef.current.on("newMove", move => {
            gameRef.current.move(move);
            setStates({
                board: gameRef.current.board(),
                history: gameRef.current.history({ verbose: true }),
                inCheckmate: gameRef.current.in_checkmate(),
                inDraw: gameRef.current.in_draw(),
                inStalemate: gameRef.current.in_stalemate()
            });
            if (states.inCheck) {
                socketRef.current.emit("youCheckmatedMeBro");
            } else if (states.inDraw) {
                socketRef.current.emit("itsADrawBro");
            } else if (states.inStalemate) {
                socketRef.current.emit("youStalematedMeBro")
            }
        });

        // Frees socket reference when connection is closed
        return () => socketRef.current.disconnect();
    }, [roomId]);

    const sendMove = (move) => {
        // Return true if move is legal
        // Implement chess logic functions in separate file
        // console.log("sendMove() was called");
        if (color === gameRef.current.turn())
            socketRef.current.emit("newMove", move);
    };
    console.log(`color: ${color}`)
    return [states.board, sendMove, color, states.history];
};

export default useGame;