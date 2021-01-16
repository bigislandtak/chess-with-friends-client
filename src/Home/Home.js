import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { FormControl, InputGroup, Button } from "react-bootstrap";

import "./Home.css";

const Home = () => {
    const [roomName, setRoomName] = React.useState("");

    let input = null;
    useEffect(() => {
      input.focus();
    });
  
    const handleRoomNameChange = (event) => {
      setRoomName(event.target.value);
    };
  
    return (
      <div className="home-container">
        <div className="login-panel">
          <div className="logo-container">
            <div className="logo">Chess with friends</div>
          </div>
          <div className="room-name-form-container">
            <InputGroup className="room-name-form">
              <FormControl
                className="text-input-field"
                placeholder="Enter room name"
                value={roomName}
                autoFocus={true}
                ref={(button) => { input = button }}
                onChange={handleRoomNameChange}
              />
              <InputGroup.Append>
                <Link to={`/${roomName}`}>
                  <Button 
                    variant="outline-secondary"
                  >
                    Join
                  </Button>
                </Link>
              </InputGroup.Append>
            </InputGroup>
          </div>
        </div>
      </div>
    );
  };
  
  export default Home;