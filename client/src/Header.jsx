import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Offcanvas from "react-bootstrap/Offcanvas";
import ConnectionIcon from "./ConnectionIcon";
import LocationIcon from "./LocationIcon";
import SurveyDropdown from "./SurveyDropdown";
import { Link } from "react-router-dom";

const expand = "md";
const brand = "Rainforest Ranger ⛺";

const Header = () => {
  return (
    <Navbar
      expand={expand}
      // className="bg-body-tertiary mb-3"
      bg="success"
      variant="dark"
    >
      <Container fluid>
        <Navbar.Brand>
          {" "}
          <Link style={{ textDecoration: "none", color: "white" }} to="/">
            {brand}
          </Link>
        </Navbar.Brand>
        <div class={`d-${expand}-none`}>
          <ConnectionIcon className="justify-content-center"></ConnectionIcon>
        </div>
        <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
        <Navbar.Offcanvas
          id={`offcanvasNavbar-expand-${expand}`}
          aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
          placement="end"
          style={{ backgroundColor: "#198754" }}
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
              {brand}
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="justify-content-start flex-grow-1 pe-3">
              {/* <Nav.Link href="#action1">Home</Nav.Link> */}
              <Nav.Link>
                <Link
                  style={{ textDecoration: "none", color: "white" }}
                  to="/add"
                >
                  Add Tree
                </Link>
              </Nav.Link>
              <Nav.Link>
                <Link
                  style={{ textDecoration: "none", color: "white" }}
                  to="/reports"
                >
                  Reports
                </Link>
              </Nav.Link>
              <Nav.Link>
                <LocationIcon></LocationIcon>
              </Nav.Link>
              <SurveyDropdown></SurveyDropdown>
              {/* <NavDropdown
                title="Dropdown"
                id={`offcanvasNavbarDropdown-expand-${expand}`}
              >
                <NavDropdown.Item href="#action3">Action</NavDropdown.Item>
                <NavDropdown.Item href="#action4">
                  Another action
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action5">
                  Something else here
                </NavDropdown.Item>
              </NavDropdown> */}
            </Nav>
            <div class={`d-none d-${expand}-block`}>
              <ConnectionIcon className="justify-content-end"></ConnectionIcon>
            </div>

            {/* <Form className="d-flex">
              <Form.Control
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
              />
              <Button variant="outline-success">Search</Button>
            </Form> */}
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
};

export default Header;
