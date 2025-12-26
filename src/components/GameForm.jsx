import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Form,
  Button,
  Card,
  Row,
  Col,
  Alert,
  CloseButton,
} from "react-bootstrap";
import { createGame } from "../api/games.js";

const EMPTY_PLAYER = {
  playerId: "",
  name: "",
  ones: 0,
  twos:  0,
  threes: 0,
  fours: 0,
  fives: 0,
  sixes: 0,
  threeOfAKind: 0,
  fourOfAKind: 0,
  fullHouse: 0,
  smallStraight: 0,
  largeStraight: 0,
  yahtzee:  0,
  yahtzeeBonus: 0,
  chance: 0,
};

// Field definitions with labels and max values for validation
const TOP_FIELDS = [
  { name: "ones", label: "Ones", max: 5 },
  { name: "twos", label: "Twos", max: 10 },
  { name: "threes", label: "Threes", max: 15 },
  { name:  "fours", label: "Fours", max: 20 },
  { name: "fives", label: "Fives", max:  25 },
  { name: "sixes", label:  "Sixes", max: 30 },
];

const BOTTOM_FIELDS = [
  { name: "threeOfAKind", label: "Three of a Kind", max: 30 },
  { name: "fourOfAKind", label: "Four of a Kind", max: 30 },
  { name: "fullHouse", label:  "Full House", max: 25 },
  { name:  "smallStraight", label: "Small Straight", max:  30 },
  { name: "largeStraight", label:  "Large Straight", max: 40 },
  { name: "yahtzee", label: "Yahtzee", max: 50 },
  { name: "yahtzeeBonus", label:  "Yahtzee Bonus", max:  300 },
  { name: "chance", label: "Chance", max: 30 },
];

const createEmptyPlayer = () => ({
  ... EMPTY_PLAYER,
  playerId: crypto.randomUUID(),
});

const computeTotals = (player) => {
  const topSubtotal =
    player.ones +
    player.twos +
    player.threes +
    player.fours +
    player. fives +
    player.sixes;
  const topBonus = topSubtotal >= 63 ?  35 : 0;
  const topTotal = topSubtotal + topBonus;

  const bottomTotal =
    player.threeOfAKind +
    player.fourOfAKind +
    player.fullHouse +
    player.smallStraight +
    player. largeStraight +
    player.yahtzee +
    player.yahtzeeBonus +
    player.chance;

  const grandTotal = topTotal + bottomTotal;

  return { topSubtotal, topBonus, topTotal, bottomTotal, grandTotal };
};

const GameForm = () => {
  const navigate = useNavigate();
  const [datePlayed, setDatePlayed] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [players, setPlayers] = useState([createEmptyPlayer()]);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleDateChange = (e) => {
    setDatePlayed(e.target.value);
  };

  const handlePlayerChange = (index, field, value) => {
    const updated = [...players];
    updated[index] = {
      ...updated[index],
      [field]: field === "name" ? value : Number(value) || 0,
    };
    setPlayers(updated);
  };

  const addPlayer = () => {
    setPlayers([...players, createEmptyPlayer()]);
  };

  const removePlayer = (index) => {
    if (players.length > 1) {
      setPlayers(players. filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    // Validate player names
    for (let i = 0; i < players.length; i++) {
      if (!players[i]. name. trim()) {
        setError(`Player ${i + 1} needs a name`);
        setSubmitting(false);
        return;
      }
    }

    try {
      const gameData = {
        datePlayed,
        players:  players.map((p) => ({
          playerId: p.playerId,
          name: p.name. trim(),
          ones: p.ones,
          twos: p.twos,
          threes: p.threes,
          fours: p.fours,
          fives: p.fives,
          sixes: p.sixes,
          threeOfAKind:  p.threeOfAKind,
          fourOfAKind: p.fourOfAKind,
          fullHouse: p.fullHouse,
          smallStraight: p.smallStraight,
          largeStraight: p. largeStraight,
          yahtzee: p.yahtzee,
          yahtzeeBonus:  p.yahtzeeBonus,
          chance: p.chance,
        })),
      };

      await createGame(gameData);
      navigate("/");
    } catch (err) {
      console.error("Error creating game:", err);
      setError(err.response?.data?.error || "Failed to create game");
    } finally {
      setSubmitting(false);
    }
  };

  const handleFocus = (e) => e.target.select();

  return (
    <Container>
      <h2 className="mb-4">New Game</h2>

      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-4" controlId="datePlayed">
          <Form.Label>Date Played</Form.Label>
          <Form.Control
            type="date"
            value={datePlayed}
            onChange={handleDateChange}
            required
          />
        </Form.Group>

        {players.map((player, index) => {
          const totals = computeTotals(player);

          return (
            <Card key={player.playerId} className="mb-4">
              <Card.Header className="d-flex justify-content-between align-items-center">
                <span>Player {index + 1}</span>
                {players.length > 1 && (
                  <CloseButton onClick={() => removePlayer(index)} />
                )}
              </Card.Header>
              <Card.Body>
                <Form. Group className="mb-3" controlId={`name-${index}`}>
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={player.name}
                    onChange={(e) =>
                      handlePlayerChange(index, "name", e.target.value)
                    }
                    placeholder="Enter player name"
                    required
                  />
                </Form.Group>

                <h6 className="mt-3 mb-2 text-muted">Upper Section</h6>
                <Row>
                  {TOP_FIELDS. map((field) => (
                    <Col xs={6} md={4} lg={2} key={field.name}>
                      <Form.Group className="mb-2">
                        <Form.Label className="small">{field.label}</Form.Label>
                        <Form. Control
                          type="number"
                          min={0}
                          max={field.max}
                          value={player[field. name]}
                          onChange={(e) =>
                            handlePlayerChange(index, field.name, e.target. value)
                          }
                          onFocus={handleFocus}
                          size="sm"
                        />
                      </Form.Group>
                    </Col>
                  ))}
                </Row>

                <Row className="mt-2 mb-3">
                  <Col xs={4}>
                    <small className="text-muted">
                      Subtotal:  <strong>{totals. topSubtotal}</strong>
                    </small>
                  </Col>
                  <Col xs={4}>
                    <small className="text-muted">
                      Bonus: <strong>{totals.topBonus}</strong>
                      {totals.topSubtotal < 63 && (
                        <span className="text-danger">
                          {" "}
                          ({63 - totals. topSubtotal} away)
                        </span>
                      )}
                    </small>
                  </Col>
                  <Col xs={4}>
                    <small className="text-muted">
                      Upper Total: <strong>{totals.topTotal}</strong>
                    </small>
                  </Col>
                </Row>

                <h6 className="mt-3 mb-2 text-muted">Lower Section</h6>
                <Row>
                  {BOTTOM_FIELDS.map((field) => (
                    <Col xs={6} md={4} lg={3} key={field. name}>
                      <Form.Group className="mb-2">
                        <Form.Label className="small">{field.label}</Form.Label>
                        <Form.Control
                          type="number"
                          min={0}
                          max={field.max}
                          value={player[field.name]}
                          onChange={(e) =>
                            handlePlayerChange(index, field. name, e.target.value)
                          }
                          onFocus={handleFocus}
                          size="sm"
                        />
                      </Form. Group>
                    </Col>
                  ))}
                </Row>

                <Row className="mt-2">
                  <Col xs={6}>
                    <small className="text-muted">
                      Lower Total: <strong>{totals.bottomTotal}</strong>
                    </small>
                  </Col>
                  <Col xs={6}>
                    <small className="text-muted">
                      Grand Total: <strong>{totals.grandTotal}</strong>
                    </small>
                  </Col>
                </Row>
              </Card. Body>
            </Card>
          );
        })}

        <div className="d-flex gap-2 mb-4">
          <Button variant="outline-secondary" type="button" onClick={addPlayer}>
            + Add Player
          </Button>
        </div>

        <div className="d-grid gap-2">
          <Button variant="primary" type="submit" disabled={submitting}>
            {submitting ? "Saving..." : "Save Game"}
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default GameForm;