import axios from "axios";
import React, { createContext, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import { Route, Routes } from "react-router-dom";
import AddTree from "./AddTree";
import Analysis from "./Analysis";
import Header from "./Header";
import Home from "./Home";
import Reports from "./Reports";

export const Context = createContext();

function App() {
  const [show, setShow] = useState(true);
  const [textInput, setTextInput] = useState("");
  const [level, setLevel] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastContent, setToastContent] = useState({});

  const [accountData, setAccountData] = useState(null);
  const [latData, setLatData] = useState(null);
  const [longData, setLongData] = useState(null);
  const [surveyData, setSurveyData] = useState(null);
  const [surveysData, setSurveysData] = useState([]);
  const [connectedData, setConnectedData] = useState(false);

  useEffect(() => {
    const uploadLocalReports = async () => {
      if (connectedData) {
        const reports = JSON.parse(localStorage.getItem("reports")) || [];
        const localReports = reports.filter(
          (report) => report.status === "created"
        );
        console.log("🚀 ~ useEffect ~ localReports:", localReports);
        for (const localReport of localReports) {
          const response = await axios.post(
            "http://localhost:8080/upload",
            localReport
          );
          const responseId = response.data.id;
          console.log("🚀 ~ useEffect ~ responseId:", responseId);
          setToastContent({
            header: "Success!",
            body: `Report ${responseId} uploaded.`,
            bg: "success",
          });
          setShowToast(true);
          const index = reports.findIndex((report) => report.id === responseId);
          if (reports[index]) {
            reports[index].status = response.data.status;
            localStorage.setItem("reports", JSON.stringify(reports));
          }
        }
      }
    };
    uploadLocalReports();
  }, [connectedData]);

  useEffect(() => {
    if (accountData) {
      localStorage.setItem("accountData", JSON.stringify(accountData));
      setShow(false);
    }
  }, [accountData]);

  useEffect(() => {
    setAccountData(JSON.parse(localStorage.getItem("accountData")) || null);
    const getSurveys = async () => {
      const surveysResponse = await axios.get("http://localhost:8080/surveys")
      setSurveysData(surveysResponse.data)
    }
    try {
      if (connectedData) {
        getSurveys();
      } else {
        const localReports = JSON.parse(localStorage.getItem("reports")) || []
        const surveys = localReports.map((report) => report.survey).filter((survey) => survey && survey.length > 0)
        const uniqueSurveys = [...new Set(surveys)]
        setSurveysData(uniqueSurveys)
      }
    } catch (ex) {

    }

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
        surveysData: [surveysData, setSurveysData],
        connectedData: [connectedData, setConnectedData],
      }}
    >
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/add" element={<AddTree />}></Route>
          <Route path="/reports" element={<Reports />}></Route>
          <Route path="/analysis" element={<Analysis />}></Route>
        </Routes>

        <ToastContainer
          className="p-3"
          position={"bottom-center"}
          style={{ zIndex: 1 }}
        >
          <Toast
            onClose={() => setShowToast(false)}
            show={showToast}
            delay={3000}
            bg={toastContent.bg}
            autohide
          >
            <Toast.Header closeButton={false}>
              <img
                src="holder.js/20x20?text=%20"
                className="rounded me-2"
                alt=""
              />
              <strong className="me-auto">{toastContent.header}</strong>
            </Toast.Header>
            <Toast.Body>{toastContent.body}</Toast.Body>
          </Toast>
        </ToastContainer>

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
