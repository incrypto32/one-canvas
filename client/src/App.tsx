import "./styles/App.css";

import React, { Component } from "react";
import { ColorProvider } from "./context/ColorContext";
import { Main } from "./components/Main";

export class App extends Component {
  render() {
    return (
      <ColorProvider>
        <Main />
      </ColorProvider>
    );
  }
}

export default App;
