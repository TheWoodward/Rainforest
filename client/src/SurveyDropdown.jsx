import React, { useContext, useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Context } from "./App";

const SurveyDropdown = () => {
  const { surveyData } = useContext(Context);
  const [survey, setSurvey] = surveyData;

  const [surveys, setSurveys] = useState([]);
  const [show, setShow] = useState(false);
  const [textInput, setTextInput] = useState("");

  const handleClose = () => {
    setTextInput("");
    setShow(false);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSurveys([...surveys, textInput]);
    setSurvey(textInput);
    handleClose();
  };

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Survey Name</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSave}>
            <Form.Group className="mb-3" controlId="notes">
              {/* <Form.Label>Survey Name</Form.Label> */}
              <Form.Control
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
              />
            </Form.Group>
            <Button variant="success" type="submit">
              Add
            </Button>
          </Form>
        </Modal.Body>
        {/* <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer> */}
      </Modal>

      <Dropdown>
        <Dropdown.Toggle variant="outline-light" id="dropdown-basic">
          {`Current Survey: ${survey ? survey : "None"}`}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {surveys.map((survey) => (
            <Dropdown.Item onClick={() => setSurvey(survey)}>
              {survey}
            </Dropdown.Item>
          ))}
          <Dropdown.Divider />
          <Dropdown.Item onClick={() => setShow(true)}>
            Create New Survey
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
};

export default SurveyDropdown;
