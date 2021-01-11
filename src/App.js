import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import "./index.css";
import Home from "./Home/Home";
import GameRoom from "./GameRoom/GameRoom";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/:roomId" component={GameRoom} />
      </Switch>
    </Router>
  );
}

export default App;
