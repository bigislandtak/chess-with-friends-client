import React, { useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { ListGroup, Form, InputGroup, Button } from "react-bootstrap";

import "./GameRoom.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import useSocket from "./useSocket";
import Board from "./Board";

const GameRoom = (props) => {
  console.log("GameRoom rendered")

  const { roomId } = props.match.params;
  const { chess, chat } = useSocket(roomId);
  const playerViewBoard = (chess.playerColor === 'w')? chess.board.flat() : chess.board.flat().reverse();
  const [newMessage, setNewMessage] = React.useState("");

  let input = null;
  useEffect(() => {
    input.focus();
  });

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

  return (
      <DndProvider backend={HTML5Backend}>
        <div className="game-room-container">
          <div className="board-container">
            <Board board={playerViewBoard} playerColor={chess.playerColor} move={chess.sendMove} getMoves={chess.getMoves} history={chess.history} />
          </div>
          <div className="control-chat-container">
            <div className="control-container">
              control
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
                      autofocus="true"
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
      </DndProvider>
  );
};

export default GameRoom;