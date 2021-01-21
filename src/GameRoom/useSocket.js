import { useState, useEffect, useRef } from "react";
import socketIOClient from "socket.io-client";
const chess = require('chess.js');

const SERVER_URL = "https://chess-with-friends-server.herokuapp.com/";

const useSocket = (roomId) => {
    const gameRef = useRef();
    const socketRef = useRef();
    const [color, setColor] = useState('');
    const [opponentIsSeated, setOpponentIsSeated] = useState(false);
    const [undoPending, setUndoPending] = useState(false);
    const [newGamePending, setNewGamePending] = useState(false);
    const [chessStates, setChessStates] = useState({
        board: [],
        history: [],
        isGameOver: false
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
            setOpponentIsSeated(true);
        });

        socketRef.current.on("syncBoard", pgn => {
            gameRef.current.load_pgn(pgn);
            setChessStates({
                board: gameRef.current.board(),
                history: gameRef.current.history({ verbose: true }),
                isGameOver: gameRef.current.game_over()
            });
            setOpponentIsSeated(true);
        });

        socketRef.current.on("opponentDisconnected", () => {
            setOpponentIsSeated(false);
        });
        
        // Listen for incoming moves
        socketRef.current.on("newMove", (move, senderId) => {
            if (socketRef.current.id !== senderId) {
                const valid = gameRef.current.move(move);
                const history = gameRef.current.history({ verbose: true });        
                const sound = (history[history.length - 1].flags === 'c')? new Audio(`${process.env.PUBLIC_URL}/sounds/capture.mp3`) : new Audio(`${process.env.PUBLIC_URL}/sounds/move.mp3`);
                if (valid)
                    sound.play();
                setChessStates({
                    board: gameRef.current.board(),
                    history: history,
                    isGameOver: gameRef.current.game_over()
                });
            }
        });

        socketRef.current.on("undoRequest", (senderId) => {
            if (senderId !== socketRef.current.id)
                setUndoPending(true);
        });

        socketRef.current.on("undoRejection", () => {
            setUndoPending(false);
        });

        socketRef.current.on("undoMove", () => {
            gameRef.current.undo();
            setChessStates({
                board: gameRef.current.board(),
                history: gameRef.current.history({ verbose: true }),
                isGameOver: gameRef.current.game_over()
            });
        });

        socketRef.current.on("newGameRequest", (senderId) => {
            if (senderId !== socketRef.current.id)
                setNewGamePending(true);
        });

        socketRef.current.on("newGameRejection", () => {
            setNewGamePending(false);
        });
        
        socketRef.current.on("resetGame", () => {
            gameRef.current.reset();
            setChessStates({
                board: gameRef.current.board(),
                history: gameRef.current.history({ verbose: true }),
                isGameOver: false
            });
        });

        socketRef.current.on("resignGame", () => {
            const moves = gameRef.current.moves();
            const move = moves[Math.floor(Math.random() * moves.length)];
            gameRef.current.move(move);
            gameRef.current.undo();
            setChessStates({
                board: gameRef.current.board(),
                history: gameRef.current.history({ verbose: true }),
                isGameOver: true
            });
        });

        socketRef.current.on("newMessage", message => {
            const incomingMessage = {
                ...message,
                ownedByCurrentUser: message.senderId === socketRef.current.id
            }
            setMessages(messages => [incomingMessage, ...messages]);
        });

        // Frees socket reference when connection is closed
        return () => socketRef.current.disconnect();
    }, [roomId]);

    const sendMove = (move) => {
        const validColor = gameRef.current.turn() === color;
        if (color === gameRef.current.turn()) {
            const valid = gameRef.current.move(move);
            const history = gameRef.current.history({ verbose: true });        
            const sound = (history[history.length - 1].flags === 'c')? new Audio(`${process.env.PUBLIC_URL}/sounds/capture.mp3`) : new Audio(`${process.env.PUBLIC_URL}/sounds/move.mp3`);
            if (valid)
                sound.play();
            setChessStates({
                board: gameRef.current.board(),
                history: gameRef.current.history({ verbose: true }),
                isGameOver: gameRef.current.game_over()
            });
            socketRef.current.emit("newMove", move, socketRef.current.id);
        }

        return validColor;
    };

    const requestUndo = () => {
        socketRef.current.emit("undoRequest", socketRef.current.id);
    };

    const rejectUndo = () => {
        socketRef.current.emit("undoRejection");
    };

    const undoMove = () => {
        socketRef.current.emit("undoMove");
    };

    const requestNewGame = () => {
        socketRef.current.emit("newGameRequest", socketRef.current.id);
    };

    const rejectNewGame = () => {
        socketRef.current.emit("newGameRejection");
    };

    const resetGame = () => {
        socketRef.current.emit("resetGame");
    };

    const resignGame = () => {
        socketRef.current.emit("resignGame");
    };

    const getMoves = () => {
        return gameRef.current.moves({ verbose: true });
    };

    const getResult = () => {
        let result;
        if (gameRef.current.in_checkmate()) {
            result = (chessStates.history[chessStates.history.length - 1].color === 'b')? "Black won the game by checkmate." : "White won the game by checkmate.";
        } else if (gameRef.current.insufficient_material()) {
            result = "The game was a draw due to insufficient material."; 
        } else if (gameRef.current.in_draw()) {
            result = "The game was a draw due to the 50 move rule."; 
        } else {
            result = (gameRef.current.turn() === 'b')? 'Black has resigned. White wins.' : "White has resigned. Black wins.";
        }
        return result;
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
            isGameOver: chessStates.isGameOver,
            sendMove: sendMove,
            undoPending: undoPending,
            requestUndo: requestUndo,
            rejectUndo: rejectUndo,
            undoMove: undoMove,
            resignGame: resignGame,
            newGamePending: newGamePending,
            requestNewGame: requestNewGame,
            rejectNewGame: rejectNewGame,
            resetGame: resetGame,
            getMoves: getMoves,
            getResult: getResult,
            opponentIsSeated: opponentIsSeated
        },
        chat: {
            messages: messages,
            sendMessage: sendMessage
        }
    };
};

export default useSocket;