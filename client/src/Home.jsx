import { useContext } from "react";
import Button from "react-bootstrap/esm/Button";
import Card from "react-bootstrap/esm/Card";
import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import { Link } from "react-router-dom";
import { Context } from "./App";

const Home = () => {
  const { accountContext } = useContext(Context);
  const [account] = accountContext;

  return <Container style={{ paddingTop: 50 }}>
    <h1>
      {!account ? "Welcome to Rainforest Ranger!" : `Welcome ${account.level} ${account.user}!`}

    </h1>
    {account?.level === 'Ranger' && <Row>
      <Col>
        <Card>
          <Card.Img
            variant="top"
            src="https://images.pexels.com/photos/957024/forest-trees-perspective-bright-957024.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          />
          <Card.Body>
            <Card.Title>Add Trees</Card.Title>
            <Card.Text>
              Start adding tree reports!
            </Card.Text>
            <Link
              to="/add"
            >
              <Button
                variant="success"
              >
                Add Trees
              </Button>
            </Link>
          </Card.Body>
        </Card>
      </Col>
      <Col>
        <Card>
          <Card.Img
            variant="top"
            src="https://images.pexels.com/photos/957024/forest-trees-perspective-bright-957024.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          />
          <Card.Body>
            <Card.Title>My Reports</Card.Title>
            <Card.Text>
              View your tree reports!
            </Card.Text>
            <Link
              to="/reports"
            >
              <Button
                variant="success"
              >
                My Reports
              </Button>
            </Link>
          </Card.Body>
        </Card>
      </Col>
    </Row>}
    {account?.level === 'Analyst' && <Row>
      {/* <Col>
        <Card>
          <Card.Img
            variant="top"
            src="https://images.pexels.com/photos/957024/forest-trees-perspective-bright-957024.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          />
          <Card.Body>
            <Card.Title>Add Trees</Card.Title>
            <Card.Text>
              Start adding tree reports!
            </Card.Text>
            <Link
              to="/add"
            >
              <Button
                variant="success"
              >
                Add Trees
              </Button>
            </Link>
          </Card.Body>
        </Card>
      </Col> */}
      <Col>
        <Card>
          <Card.Img
            variant="top"
            src="https://images.pexels.com/photos/957024/forest-trees-perspective-bright-957024.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          />
          <Card.Body>
            <Card.Title>Analysis</Card.Title>
            <Card.Text>
              View and analyse Ranger tree reports!
            </Card.Text>
            <Link
              to="/analysis"
            >
              <Button
                variant="success"
              >
                Analysis
              </Button>
            </Link>
          </Card.Body>
        </Card>
      </Col>
    </Row>}
  </Container>;
}

export default Home;
