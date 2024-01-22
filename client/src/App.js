import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import logo from "./logo.svg";
import Header from "./Header";
import { Route, Routes } from "react-router-dom";
import AddTree from "./AddTree";
import Reports from "./Reports";
import Home from "./Home";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

export const Context = createContext();

// import "./App.css";

function App() {
  const [show, setShow] = useState(true);
  const [textInput, setTextInput] = useState("");
  const [level, setLevel] = useState(null);
  const [accountData, setAccountData] = useState(null);
  const [latData, setLatData] = useState(null);
  const [longData, setLongData] = useState(null);
  const [surveyData, setSurveyData] = useState(null);

  useEffect(() => {
    if (accountData) {
      localStorage.setItem("accountData", JSON.stringify(accountData));
      setShow(false);
    }
  }, [accountData]);

  useEffect(() => {
    setAccountData(JSON.parse(localStorage.getItem("accountData")) || null);
  }, []);

  const handleClose = () => {
    setShow(false);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!level || !textInput || textInput.length < 1) {
      return;
    }
    setAccountData({ user: textInput, level: level });
    handleClose();
  };

  return (
    <Context.Provider
      value={{
        accountData: [accountData, setAccountData],
        latData: [latData, setLatData],
        longData: [longData, setLongData],
        surveyData: [surveyData, setSurveyData],
      }}
    >
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/add" element={<AddTree />}></Route>
          <Route path="/reports" element={<Reports />}></Route>
        </Routes>

        <Modal show={show}>
          <Modal.Header>
            <Modal.Title>Welcome to Rainforest Ranger!</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSave}>
              <Form.Group className="mb-3" controlId="user">
                <Form.Label>Please enter your name:</Form.Label>
                <Form.Control
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="account">
                <Form.Label>Account Type</Form.Label>
                <br></br>
                {["Ranger", "Analyst"].map((accountType) => (
                  <Form.Check id={accountType} inline>
                    <Form.Check.Input
                      type="radio"
                      name="account"
                      onChange={(e) => setLevel(e.target.id)}
                    />
                    <Form.Check.Label>{accountType}</Form.Check.Label>
                  </Form.Check>
                ))}
              </Form.Group>
              <Button variant="success" type="submit">
                Login
              </Button>
            </Form>
          </Modal.Body>
        </Modal>

        <header className="App-header">
          {/* <button onClick={handleLocationClick}>Location</button>
        {lat}
        {long}
        {lat && (
          <div className="google-map-code">
            <iframe
              src={`https://maps.google.com/maps?q=${lat},${long}&hl=es;z=14&output=embed`}
            ></iframe>
          </div>
        )} */}
        </header>
      </div>
    </Context.Provider>
  );
}

export default App;
