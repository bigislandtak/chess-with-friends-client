import { useState, useEffect, useRef } from "react";
import socketIOClient from "socket.io-client";
const chess = require('chess.js');

const SERVER_URL = "http://localhost:8080";

const useSocket = (roomId) => {
    const gameRef = useRef();
    // const colorRef = useRef();
    const socketRef = useRef();
    const [color, setColor] = useState('');
    const [chessStates, setChessStates] = useState({
        board: [],
        history: []
    });
    const [messages, setMessages] = useState([]);
    
    useEffect(() => {
        // Creates a new chess game
        gameRef.current = chess();

        // Creates a websocket connection
        socketRef.current = socketIOClient(SERVER_URL, {
            query: { roomId }
        });

        // Set board to initial state
        setChessStates({
            board: gameRef.current.board(),
            history: gameRef.current.history({ verbose: true })
        });

        socketRef.current.on("colorAssignment", color => {
            setColor(color);
        });

        socketRef.current.on("pgnRequest", fromId => {
            socketRef.current.emit("pgnResponse", gameRef.current.pgn(), fromId);
        });

        socketRef.current.on("syncBoard", pgn => {
            gameRef.current.load_pgn(pgn);
            setChessStates({
                board: gameRef.current.board(),
                history: gameRef.current.history({ verbose: true })
            });
        });
        
        // Listen for incoming moves
        socketRef.current.on("newMove", move => {
            gameRef.current.move(move);
            setChessStates({
                board: gameRef.current.board(),
                history: gameRef.current.history({ verbose: true }),
            });
        });

        socketRef.current.on("newMessage", message => {
            const incomingMessage = {
                ...message,
                ownedByCurrentUser: message.senderId === socketRef.current.id
            }
            setMessages(messages => [...messages, incomingMessage]);
        });

        // Frees socket reference when connection is closed
        return () => socketRef.current.disconnect();
    }, [roomId]);

    const sendMove = (move) => {
        const moves = gameRef.current.moves({ verbose: true });
        let valid = false;
        for (let i = 0; i < moves.length; i++)
            if (move.from in moves[i] && move.to in moves[i])
                valid = true;

        if (color === gameRef.current.turn())
            socketRef.current.emit("newMove", move);

        return valid;
    };

    const getMoves = () => {
        return gameRef.current.moves({ verbose: true });
    };

    const sendMessage = (message) => {
        socketRef.current.emit("newMessage", { 
            body: message, 
            senderId: socketRef.current.id 
        });
    };

    return {
        chess: {
            playerColor: color, 
            board: chessStates.board, 
            history: chessStates.history,
            sendMove: sendMove, 
            getMoves: getMoves 
        },
        chat: {
            messages: messages,
            sendMessage: sendMessage
        }
    };
};

export default useSocket;