import { useContext } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Navbar from "react-bootstrap/Navbar";
import Offcanvas from "react-bootstrap/Offcanvas";
import { Link } from "react-router-dom";
import { Context } from "./App";
import ConnectionIcon from "./ConnectionIcon";
import LocationIcon from "./LocationIcon";
import SurveyDropdown from "./SurveyDropdown";

const expand = "md";
const brand = "Rainforest Ranger ⛺";

const Header = () => {
  const { accountData } = useContext(Context);
  const [account] = accountData;

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
              {account?.level === 'Ranger' && <><Nav.Link>
                <Link
                  style={{ textDecoration: "none", color: "white" }}
                  to="/add"
                >
                  Add Trees
                </Link>
              </Nav.Link>
                <Nav.Link>
                  <Link
                    style={{ textDecoration: "none", color: "white" }}
                    to="/reports"
                  >
                    {(account?.user ? account.user + "'s" : "My") + " Reports"}
                  </Link>
                </Nav.Link></>}
              {account?.level === 'Analyst' && <Nav.Link>
                <Link
                  style={{ textDecoration: "none", color: "white" }}
                  to="/analysis"
                >
                  Analysis
                </Link>
              </Nav.Link>}

              {account?.level === 'Ranger' && <><Nav.Link>
                <LocationIcon></LocationIcon>
              </Nav.Link>
                <SurveyDropdown></SurveyDropdown></>}
            </Nav>
            <div class={`d-none d-${expand}-block`}>
              <ConnectionIcon className="justify-content-end"></ConnectionIcon>
            </div>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
};

export default Header;
