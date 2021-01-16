import React, { useEffect, useState, useRef } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { ListGroup, Form, InputGroup, Button, Modal } from "react-bootstrap";

import "./GameRoom.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import useSocket from "./useSocket";
import Board from "./Board";

const GameRoom = (props) => {
  const { roomId } = props.match.params;
  const { chess, chat } = useSocket(roomId);
  const playerViewBoard = (chess.playerColor === 'w')? chess.board.flat() : chess.board.flat().reverse();
  const [newMessage, setNewMessage] = React.useState("");
  const [showConfirmResign, setShowConfirmResign] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [showPromotion, setShowPromotion] = useState(false);
  const [showUndoRequest, setShowUndoRequest] = useState(false);
  const [showNewGameRequest, setShowNewGameRequest] = useState(false);
  
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);
  const updateWidthAndHeight = () => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  };

  useEffect(() => {
    window.addEventListener("resize", updateWidthAndHeight);
    return () => window.removeEventListener("resize", updateWidthAndHeight);
});

  let input = null;
  useEffect(() => {
    input.focus();
  });

  const result = useRef("");
  useEffect(() => {
    if (chess.isGameOver) {
      result.current = chess.getResult();
      handleShowGameOver();
    }
  }, [chess.isGameOver]);

  useEffect(() => {
    if (chess.undoPending)
      handleShowUndoRequest();
  }, [chess.undoPending]);

  useEffect(() => {
    if (chess.newGamePending)
      handleShowNewGameRequest();
  }, [chess.newGamePending]);

  const handleNewMessageChange = (event) => {
    setNewMessage(event.target.value);
  };

  const handleSendMessage = () => {
    chat.sendMessage(newMessage);
    setNewMessage("");
  };

  const handleKeyPress = (target) => {
    if (target.charCode === 13)
      handleSendMessage();
  };

  const handleShowUndoRequest = () => {
    setShowUndoRequest(true);
  };

  const handleCloseUndoRequest = () => {
    setShowUndoRequest(false);
    chess.rejectUndo();
  };

  const handleUndo = () => {
    handleCloseUndoRequest();
    chess.undoMove();
  };

  const handleShowNewGameRequest = () => {
    setShowNewGameRequest(true);
  };

  const handleCloseNewGameRequest = () => {
    setShowNewGameRequest(false);
    chess.rejectNewGame();
  };

  const handleResetGame = () => {
    handleCloseNewGameRequest();
    chess.resetGame();
  };

  const handleShowConfirmResign = () => {
    setShowConfirmResign(true);
  };

  const handleCloseConfirmResign = () => {
    setShowConfirmResign(false);
  };

  const handleResign = () => {
    handleCloseConfirmResign();
    chess.resignGame();
  };

  const handleShowGameOver = () => {
    setShowGameOver(true);
  };

  const handleCloseGameOver = () => {
    setShowGameOver(false);
  };

  const handleShowPromotion = () => {
    setShowPromotion(true);
  };

  const handleClosePromotion = () => {
    setShowPromotion(false);
  };

  const handleQueenSelection = () => {
    
    handleClosePromotion();
  };

  const handleKnightSelection = () => {

    handleClosePromotion();
  };

  const handleRookSelection = () => {

    handleClosePromotion();
  };

  const handleBishopSelection = () => {

    handleClosePromotion();
  };

  const handleCopyLink = () => {
    // const str = document.getElementById("link").innerText;
    const el = document.createElement('textarea');
    el.value = window.location.href;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  }

  let mainPanelWidth = width * 0.9;
  if (mainPanelWidth / 1.4 > height)
    mainPanelWidth = height * 1.4;

  return (
      <DndProvider backend={HTML5Backend}>
        <div className="game-room-container">
          <div 
            className="main-panel" 
            style={{ 
              width: `${mainPanelWidth}px`, 
              height: `${mainPanelWidth / 1.4}px` 
            }}
          >
            <div className="board-container">
              <Board board={playerViewBoard} 
                playerColor={chess.playerColor} 
                move={chess.sendMove} 
                getMoves={chess.getMoves} 
                history={chess.history} 
              />
              <Modal 
                className="modal"
                backdrop="static"
                show={showUndoRequest} 
                centered 
              >
                <Modal.Body 
                  style={{
                    display: "flex",
                    justifyContent: "center"
                  }}
                >
                  Your opponent has requested to undo the previous move.
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleCloseUndoRequest}>
                    Decline
                  </Button>
                  <Button variant="primary" onClick={handleUndo}>
                    Accept
                  </Button>
                </Modal.Footer>
              </Modal>
              <Modal 
                className="modal"
                backdrop="static"
                show={showNewGameRequest} 
                centered 
              >
                <Modal.Body 
                  style={{
                    display: "flex",
                    justifyContent: "center"
                  }}
                >
                  Your opponent has requested to start a new game.
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleCloseNewGameRequest}>
                    Decline
                  </Button>
                  <Button variant="primary" onClick={handleResetGame}>
                    Accept
                  </Button>
                </Modal.Footer>
              </Modal>
              <Modal 
                className="modal"
                backdrop="static"
                show={showConfirmResign} 
                centered 
              >
                <Modal.Body 
                  style={{
                    display: "flex",
                    justifyContent: "center"
                  }}
                >
                  Are you sure you want to resign?
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleCloseConfirmResign}>
                    Cancel
                  </Button>
                  <Button variant="primary" onClick={handleResign}>
                    Resign
                  </Button>
                </Modal.Footer>
              </Modal>
              <Modal 
                className="modal"
                show={showGameOver} 
                onHide={handleCloseGameOver}
                centered 
              >
                <Modal.Body 
                  style={{
                    display: "flex",
                    justifyContent: "center"
                  }}
                >
                  {result.current}
                </Modal.Body>
              </Modal>
              <Modal 
                className="modal"
                show={showPromotion} 
                onHide={handleClosePromotion} 
                backdrop="static"
                centered 
              >
                <Modal.Body>
                  <div className="promotion-container">
                    <div className="promotion-from-container">
                      <div className="promotion-pawn-image-container">
                        <img src={`${process.env.PUBLIC_URL}/assets/p_${chess.playerColor}.png`} alt="" className="promotion-pawn-image" />
                      </div>
                    </div>
                    <div className="promotion-arrow-container">
                      <div className="promotion-arrow-image-container">
                        <img src={`${process.env.PUBLIC_URL}/assets/arrow.png`} alt="" className="promotion-arrow-image" />
                      </div>
                    </div>
                    <div className="promotion-to-container">
                      <div className="promotion-selections-container">
                        <div className="promotion-selection-container">
                          <button className="promotion-selection-button" onClick={handleQueenSelection}>
                            <img src={`${process.env.PUBLIC_URL}/assets/q_${chess.playerColor}.png`} alt="" className="promotion-selection-image" />
                          </button>
                        </div>
                        <div className="promotion-selection-container">
                          <button className="promotion-selection-button" onClick={handleKnightSelection}>
                            <img src={`${process.env.PUBLIC_URL}/assets/n_${chess.playerColor}.png`} alt="" className="promotion-selection-image" />
                          </button>
                        </div>
                        <div className="promotion-selection-container">
                          <button className="promotion-selection-button" onClick={handleRookSelection}>
                            <img src={`${process.env.PUBLIC_URL}/assets/r_${chess.playerColor}.png`} alt="" className="promotion-selection-image" />
                          </button>
                        </div>
                        <div className="promotion-selection-container">
                          <button className="promotion-selection-button" onClick={handleBishopSelection}>
                            <img src={`${process.env.PUBLIC_URL}/assets/b_${chess.playerColor}.png`} alt="" className="promotion-selection-image" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Modal.Body>
              </Modal>
            </div>
            <div className="side-panel">
              <div className="player-info-container">
                <div className="seats-icon-container">
                  <img src={`${process.env.PUBLIC_URL}/assets/${chess.opponentIsSeated? "seat_full" : "seat_open"}.png`} alt="" className="seats-icon" />
                </div>
                <div className="invite-link-container">
                  <InputGroup id="link" className="invite-link">
                    <Form.Control   
                      placeholder={window.location.href}
                    />
                    <InputGroup.Append>
                      <Button variant="outline-secondary" onClick={handleCopyLink}>Copy</Button>
                    </InputGroup.Append>
                  </InputGroup>
                </div>
              </div>
              <div className="control-container">
                <div className="buttons-container">
                  <div className="undo-button-container">
                    <input type="image" src={`${process.env.PUBLIC_URL}/buttons/undo.png`} alt="" onClick={chess.requestUndo} className="undo-button" />
                  </div>
                  <div className="resign-button-container">
                    <input type="image" src={`${process.env.PUBLIC_URL}/buttons/resign.png`} alt="" onClick={handleShowConfirmResign} className="resign-button" />
                  </div>
                  <div className="new-game-button-container">
                    <input type="image" src={`${process.env.PUBLIC_URL}/buttons/new_game.png`} alt="" onClick={chess.requestNewGame} className="new-game-button" />
                  </div>
                </div>
              </div>
              <div className="chat-container">
                <div className="chat">
                  <div className="message-list-container">
                    <ListGroup className="message-list">
                      {chat.messages.map((message, i) => (
                        <ListGroup.Item key={i} className={message.ownedByCurrentUser ? "my-message-item" : "received-message-item"}>
                          {message.body}
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </div>
                  <div className="message-form-container">
                    <InputGroup className="message-form">
                      <Form.Control
                        type="text"
                        value={newMessage}
                        onChange={handleNewMessageChange}
                        placeholder="Write message..."
                        className="message-input-field"
                        autoFocus={true}
                        ref={(button) => { input = button }}
                        onKeyPress={handleKeyPress}
                      />
                      <InputGroup.Append>
                        <Button variant="secondary" onClick={handleSendMessage} className="send-message-button">Send</Button>
                      </InputGroup.Append>
                    </InputGroup>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DndProvider>
  );
};

export default GameRoom;