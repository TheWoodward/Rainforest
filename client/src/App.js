import React, { useEffect, useState } from "react";
import axios from "axios";
import logo from "./logo.svg";
import "./App.css";

function App() {
  const [connected, setConnected] = useState(false);

  const checkConnection = () => {
    axios
      .get("http://localhost:8080/", {})
      .then((res) => {
        console.log(res.status);
        if (res.status === 200) {
          setConnected(true);
        } else {
          setConnected(false);
        }
      })
      .catch((err) => {
        setConnected(false);
        console.error(err);
      });
  };

  useEffect(() => {
    checkConnection();
    var intervalId = window.setInterval(function () {
      checkConnection();
    }, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <button onClick={() => alert("hello world")}>Hello</button>
        <p>
          Are we connected?
          <br></br>
          {connected ? "yes" : "no"}
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
