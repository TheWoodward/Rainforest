import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import Container from "react-bootstrap/esm/Container";
import Button from "react-bootstrap/esm/Button";
import { useState, useEffect, useRef } from "react";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";

const treeSpecies = [
  { name: "Deciduous", image: "🌳" },
  { name: "Evergreen", image: "🌲" },
  { name: "Palm", image: "🌴" },
];

const treeDiseases = [
  { name: "None (Healthy)", image: "🌳" },
  { name: "Fungi", image: "🍄" },
  { name: "Nutrient Deficiency", image: "🤒" },
  { name: "Dead", image: "💀" },
];

const AddTree = () => {
  const [show, setShow] = useState(false);

  const [selectedFile, setSelectedFile] = useState("");
  const [preview, setPreview] = useState();
  const [modalContent, setModalContent] = useState({});
  const [reports, setReports] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastContent, setToastContent] = useState({});

  const [treeName, setTreeName] = useState(null);
  console.log("🚀 ~ AddTree ~ treeName:", treeName);
  const [treeDisease, setTreeDisease] = useState(null);
  console.log("🚀 ~ AddTree ~ treeDisease:", treeDisease);
  const [datetime, setDatetime] = useState(new Date());
  console.log("🚀 ~ AddTree ~ datetime:", datetime);
  const [notes, setNotes] = useState("");
  console.log("🚀 ~ AddTree ~ notes:", notes);

  useEffect(() => {
    if (reports) {
      localStorage.setItem("reports", JSON.stringify(reports));
      console.log("reports", reports);
    }
  }, [reports]);

  useEffect(() => {
    setReports(JSON.parse(localStorage.getItem("reports")) || []);
  }, []);

  const inputFile = useRef(null);

  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }

    const objectURL = window.URL.createObjectURL(selectedFile);
    setPreview(objectURL);

    return () => window.URL.revokeObjectURL(objectURL);
  }, [selectedFile]);

  useEffect(() => {
    if (!treeName) {
      return;
    }

    setShow(true);
  }, [treeName]);

  const convertToBase64 = async (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      console.log("called: ", reader);
      console.log(reader.result);
      //call api
      const tree = await axios.post("http://localhost:8080/identify", {
        tree: reader.result,
      });
      setTreeName(tree.data.species);
      setTreeDisease(tree.data.disease || "None (Healthy)");
    };
  };

  const selectFile = (event) => {
    setSelectedFile(event.target.files[0]);
    convertToBase64(event.target.files[0]);
  };

  const handleClose = () => setShow(false);
  const handleManual = () => {
    setDatetime(new Date());
    setModalContent({ type: "Manual Record" });
    setShow(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    console.log(e);
    const reportId = Math.random().toString(16).slice(2);
    const newReport = {
      id: reportId,
      species: treeName,
      disease: treeDisease,
      datetime,
      notes,
      status: "created",
    };

    setShow(false);

    try {
      const response = await axios.post(
        "http://localhost:8080/upload",
        newReport
      );
      const responseId = response.data.id;
      console.log("🚀 ~ handleSave ~ responseId:", responseId);
      if (!responseId) {
        setReports([...reports, newReport]);
        setToastContent({
          header: "Error!",
          body: `Report ${reportId} not uploaded.`,
          bg: "danger",
        });
        setShowToast(true);
        return;
      }
      const newReports = reports;
      const index = newReports.findIndex((report) => report.id === responseId);
      if (newReports[index]) {
        newReports[index].status = response.data.status;
        setReports(newReports);
      } else {
        newReport.status = response.data.status;
        setReports([...reports, newReport]);
      }
      setToastContent({
        header: "Success!",
        body: `Report ${reportId} uploaded.`,
        bg: "success",
      });
      setShowToast(true);
    } catch (ex) {
      setReports([...reports, newReport]);
      setToastContent({
        header: "Error!",
        body: `Report ${reportId} not uploaded.`,
        bg: "danger",
      });
      setShowToast(true);
      return;
    }
  };

  const handleAutomatic = () => {
    setDatetime(new Date());
    inputFile.current.click();
    setTreeName(null);
    setTreeDisease(null);
    setModalContent({ type: "Automatic Record" });
  };

  //   Individual Trees
  // Age
  // Condition
  // Location
  // Illegal felling?
  // Growth?
  // Other notes
  // Photos?
  // Date/time

  const getModalBody = (type) => {
    if (type === "Manual Record") {
      return (
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="datetime">
              <Form.Label>Date & Time</Form.Label>
              <br></br>
              <Form.Text>
                {datetime.toLocaleDateString() +
                  " " +
                  datetime.toLocaleTimeString()}
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3" controlId="species">
              <Form.Label>Species</Form.Label>
              <br></br>

              {treeSpecies.map((species) => (
                <Form.Check id={species.name} inline>
                  <Form.Check.Input
                    type="radio"
                    name="species"
                    onChange={(e) => setTreeName(e.target.id)}
                  />
                  <Form.Check.Label>
                    {species.image}
                    <br></br>
                    {species.name}
                    <br></br>0 recorded
                    {/* <Card.Img
                      variant="top"
                      src={
                        preview ||
                        "https://images.pexels.com/photos/957024/forest-trees-perspective-bright-957024.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                      }
                    /> */}
                  </Form.Check.Label>
                </Form.Check>
              ))}
            </Form.Group>
            <Form.Group className="mb-3" controlId="diseases">
              <Form.Label>Diseases</Form.Label>
              <br></br>
              {treeDiseases.map((diseases) => (
                <Form.Check id={diseases.name} inline>
                  <Form.Check.Input
                    type="radio"
                    name="diseases"
                    onChange={(e) => setTreeDisease(e.target.id)}
                  />
                  <Form.Check.Label>
                    {diseases.image}
                    <br></br>
                    {diseases.name}
                  </Form.Check.Label>
                </Form.Check>
              ))}
            </Form.Group>

            <Form.Group className="mb-3" controlId="notes">
              <Form.Label>Other Notes</Form.Label>
              <Form.Control
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
      );
    }
    return (
      <Modal.Body>
        <Form onSubmit={handleSave}>
          <Form.Group className="mb-3" controlId="datetime">
            <Form.Label>Date & Time</Form.Label>
            <br></br>
            <Form.Text>
              {datetime.toLocaleDateString() +
                " " +
                datetime.toLocaleTimeString()}
            </Form.Text>
          </Form.Group>
          <Form.Group className="mb-3" controlId="species">
            <Form.Label>Species</Form.Label>
            <br></br>
            <Card.Img variant="top" src={preview} />
            <Form.Text>{`Detected Species: ${treeName}`}</Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" controlId="diseases">
            <Form.Label>Diseases</Form.Label>
            <br></br>
            <Form.Text>{`Detected Diseases: ${
              !treeDisease ? "None (Healthy)" : treeDisease
            }`}</Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" controlId="notes">
            <Form.Label>Other Notes</Form.Label>
            <Form.Control
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </Form.Group>
          <Button variant="success" type="submit">
            Upload
          </Button>
        </Form>
      </Modal.Body>
    );
  };

  return (
    <>
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

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{modalContent.type}</Modal.Title>
        </Modal.Header>
        {getModalBody(modalContent.type)}
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      <Container style={{ paddingTop: 50 }}>
        <Row>
          <Col>
            {/* <Button size="lg" variant="success" onClick={handleManual}>
              🌳
            </Button> */}
            <Card>
              <Card.Img
                variant="top"
                style={{ height: 300, objectFit: "cover" }}
                src="https://images.pexels.com/photos/957024/forest-trees-perspective-bright-957024.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              />
              <Card.Body>
                <Card.Title>Automatic Record</Card.Title>
                <Card.Text>
                  Quickly and easily record a tree with automatic detection.
                </Card.Text>
                <Button variant="success" onClick={handleAutomatic}>
                  Add Record
                </Button>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card>
              <Card.Img
                variant="top"
                style={{ height: 300, objectFit: "cover" }}
                src="https://images.pexels.com/photos/129743/pexels-photo-129743.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              />
              <Card.Body>
                <Card.Title>Manual Record</Card.Title>
                <Card.Text>
                  Quickly and easily record a tree with automatic detection.
                </Card.Text>
                <Button variant="success" onClick={handleManual}>
                  Add Record
                </Button>
              </Card.Body>
            </Card>
          </Col>
          {/* <Col>
            <Button size="lg" variant="success">
              🌲
            </Button>
          </Col>
          <Col>
            <Button size="lg" variant="success">
              🌴
            </Button>
          </Col> */}
        </Row>
      </Container>
      <input
        // style={input}
        type="file"
        accept=".jpg,.jpeg, .png|image/*"
        id="image"
        name="Upload image"
        onChange={selectFile}
        text="test"
        ref={inputFile}
        style={{ display: "none" }}
      />
      <br></br>
      {/* <img src={preview}></img>
      {preview}
      <br></br>
      {treeName}
      <br></br>
      {!treeDisease ? "Healthy" : "Unhealthy - " + treeDisease} */}
    </>
  );
};

export default AddTree;
