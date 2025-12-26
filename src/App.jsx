import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { Container, Navbar, Nav } from "react-bootstrap";

import GameList from "./components/GameList.jsx";
import GameForm from "./components/GameForm.jsx";
import GameDetail from "./components/GameDetail. jsx";
import Analytics from "./components/Analytics.jsx";

const Navigation = () => (
  <Navbar bg="dark" variant="dark" expand="md" className="mb-4">
    <Container>
      <Navbar.Brand as={Link} to="/">
        OSL Yahtzee
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar. Collapse id="basic-navbar-nav">
        <Nav className="ms-auto">
          <Nav.Link as={Link} to="/">
            Games
          </Nav. Link>
          <Nav.Link as={Link} to="/game/new">
            New Game
          </Nav.Link>
          <Nav.Link as={Link} to="/analytics">
            Analytics
          </Nav. Link>
        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar>
);

const App = () => (
  <Router>
    <Navigation />
    <Routes>
      <Route path="/" element={<GameList />} />
      <Route path="/game/new" element={<GameForm />} />
      <Route path="/game/:id" element={<GameDetail />} />
      <Route path="/analytics" element={<Analytics />} />
    </Routes>
  </Router>
);

export default App;