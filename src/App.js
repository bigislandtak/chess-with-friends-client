import React from "react";
import { HashRouter, BrowserRouter as Router, Switch, Route } from "react-router-dom";

import "./index.css";
import Home from "./Home/Home";
import GameRoom from "./GameRoom/GameRoom";

function App() {
  return (
    <HashRouter basename={process.env.PUBLIC_URL}>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/:roomId" component={GameRoom} />
      </Switch>
    </HashRouter>
  );
}

export default App;