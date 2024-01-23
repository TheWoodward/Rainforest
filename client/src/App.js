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
import { uploadLocalReports } from "./uploadHelpers";

export const Context = createContext();

function App() {
  //Contexts
  const [accountContext, setAccountContext] = useState(null);
  const [latContext, setLatContext] = useState(null);
  const [longContext, setLongContext] = useState(null);
  const [surveyContext, setSurveyContext] = useState(null);
  const [surveysContext, setSurveysContext] = useState([]);
  const [connectedContext, setConnectedContext] = useState(false);

  //State
  const [showModal, setShowModal] = useState(true);
  const [usernameValue, setUsernameValue] = useState("");
  const [level, setLevel] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastContent, setToastContent] = useState({});

  useEffect(() => {
    if (connectedContext) {
      const onSuccess = (id) => {
        setToastContent({
          header: "Success!",
          body: `Report ${id} uploaded.`,
          bg: "success",
        });
        setShowToast(true);
      };
      uploadLocalReports(onSuccess);
    }
  }, [connectedContext]);

  useEffect(() => {
    if (accountContext) {
      localStorage.setItem("accountContext", JSON.stringify(accountContext));
      setShowModal(false);
    }
  }, [accountContext]);

  useEffect(() => {
    setAccountContext(
      JSON.parse(localStorage.getItem("accountContext")) || null
    );
    const getSurveys = async () => {
      const surveysResponse = await axios.get("http://localhost:8080/surveys");
      setSurveysContext(surveysResponse.data);
    };
    try {
      if (connectedContext) {
        getSurveys();
      } else {
        const localReports = JSON.parse(localStorage.getItem("reports")) || [];
        const surveys = localReports
          .map((report) => report.survey)
          .filter((survey) => survey && survey.length > 0);
        const uniqueSurveys = [...new Set(surveys)];
        setSurveysContext(uniqueSurveys);
      }
    } catch (ex) {}
  }, [connectedContext]);

  const handleClose = () => {
    setShowModal(false);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!level || !usernameValue || usernameValue.length < 1) {
      return;
    }
    setAccountContext({ user: usernameValue, level: level });
    handleClose();
  };

  return (
    <Context.Provider
      value={{
        accountContext: [accountContext, setAccountContext],
        latContext: [latContext, setLatContext],
        longContext: [longContext, setLongContext],
        surveyContext: [surveyContext, setSurveyContext],
        surveysContext: [surveysContext, setSurveysContext],
        connectedContext: [connectedContext, setConnectedContext],
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

        <Modal show={showModal}>
          <Modal.Header>
            <Modal.Title>Welcome to Rainforest Ranger!</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSave}>
              <Form.Group className="mb-3" controlId="user">
                <Form.Label>Please enter your name:</Form.Label>
                <Form.Control
                  value={usernameValue}
                  onChange={(e) => setUsernameValue(e.target.value)}
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
      </div>
    </Context.Provider>
  );
}

export default App;
