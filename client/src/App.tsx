import "./styles/App.css";

import React, { Component } from "react";
import OneCanvas from "./components/canvas/Canvas";

export class App extends Component {
  render() {
    return (
      <div className="box-border h-screen mx-auto flex justify-center items-center">
        <OneCanvas name="One Canvas" />
      </div>
    );
  }
}

export default App;
