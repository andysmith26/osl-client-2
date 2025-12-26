import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Table, Alert, Spinner, Button, Badge } from "react-bootstrap";
import { getGameById } from "../api/games.js";

const GameDetail = () => {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const data = await getGameById(id);
        setGame(data);
      } catch (err) {
        console. error("Error fetching game:", err);
        if (err.response?.status === 404) {
          setError("Game not found");
        } else {
          setError("Failed to load game");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchGame();
  }, [id]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year:  "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert variant="danger">{error}</Alert>
        <Button as={Link} to="/" variant="outline-primary">
          ← Back to Games
        </Button>
      </Container>
    );
  }

  // Find winner(s)
  const maxScore = Math.max(...game. players.map((p) => p.grandTotal));
  const winnerIds = game.players
    .filter((p) => p.grandTotal === maxScore)
    .map((p) => p.playerId);

  return (
    <Container>
      <Button as={Link} to="/" variant="outline-secondary" className="mb-3">
        ← Back to Games
      </Button>

      <h2 className="mb-1">{formatDate(game.datePlayed)}</h2>
      <p className="text-muted mb-4">
        {game.players.length} player{game.players.length !== 1 ?  "s" : ""}
      </p>

      <Table bordered responsive size="sm">
        <thead className="table-light">
          <tr>
            <th>Category</th>
            {game.players.map((player) => (
              <th key={player.playerId} className="text-center">
                {player.name}
                {winnerIds.includes(player.playerId) && (
                  <Badge bg="success" className="ms-2">
                    Winner
                  </Badge>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* Upper Section */}
          <tr className="table-secondary">
            <td colSpan={game.players.length + 1}>
              <strong>Upper Section</strong>
            </td>
          </tr>
          <tr>
            <td>Ones</td>
            {game.players.map((p) => (
              <td key={p.playerId} className="text-center">
                {p. ones}
              </td>
            ))}
          </tr>
          <tr>
            <td>Twos</td>
            {game.players.map((p) => (
              <td key={p.playerId} className="text-center">
                {p.twos}
              </td>
            ))}
          </tr>
          <tr>
            <td>Threes</td>
            {game. players.map((p) => (
              <td key={p.playerId} className="text-center">
                {p. threes}
              </td>
            ))}
          </tr>
          <tr>
            <td>Fours</td>
            {game.players. map((p) => (
              <td key={p.playerId} className="text-center">
                {p.fours}
              </td>
            ))}
          </tr>
          <tr>
            <td>Fives</td>
            {game.players.map((p) => (
              <td key={p.playerId} className="text-center">
                {p.fives}
              </td>
            ))}
          </tr>
          <tr>
            <td>Sixes</td>
            {game.players.map((p) => (
              <td key={p. playerId} className="text-center">
                {p.sixes}
              </td>
            ))}
          </tr>
          <tr className="table-info">
            <td>Upper Subtotal</td>
            {game.players.map((p) => (
              <td key={p.playerId} className="text-center">
                {p.topSubtotal}
              </td>
            ))}
          </tr>
          <tr className="table-info">
            <td>Bonus (≥63)</td>
            {game. players.map((p) => (
              <td key={p.playerId} className="text-center">
                {p. topBonus}
              </td>
            ))}
          </tr>
          <tr className="table-info">
            <td>
              <strong>Upper Total</strong>
            </td>
            {game.players.map((p) => (
              <td key={p. playerId} className="text-center">
                <strong>{p.topTotal}</strong>
              </td>
            ))}
          </tr>

          {/* Lower Section */}
          <tr className="table-secondary">
            <td colSpan={game.players.length + 1}>
              <strong>Lower Section</strong>
            </td>
          </tr>
          <tr>
            <td>Three of a Kind</td>
            {game. players.map((p) => (
              <td key={p.playerId} className="text-center">
                {p. threeOfAKind}
              </td>
            ))}
          </tr>
          <tr>
            <td>Four of a Kind</td>
            {game.players. map((p) => (
              <td key={p.playerId} className="text-center">
                {p.fourOfAKind}
              </td>
            ))}
          </tr>
          <tr>
            <td>Full House</td>
            {game.players. map((p) => (
              <td key={p.playerId} className="text-center">
                {p.fullHouse}
              </td>
            ))}
          </tr>
          <tr>
            <td>Small Straight</td>
            {game.players.map((p) => (
              <td key={p.playerId} className="text-center">
                {p.smallStraight}
              </td>
            ))}
          </tr>
          <tr>
            <td>Large Straight</td>
            {game.players.map((p) => (
              <td key={p.playerId} className="text-center">
                {p.largeStraight}
              </td>
            ))}
          </tr>
          <tr>
            <td>Yahtzee</td>
            {game.players. map((p) => (
              <td key={p.playerId} className="text-center">
                {p.yahtzee}
              </td>
            ))}
          </tr>
          <tr>
            <td>Yahtzee Bonus</td>
            {game. players.map((p) => (
              <td key={p.playerId} className="text-center">
                {p. yahtzeeBonus}
              </td>
            ))}
          </tr>
          <tr>
            <td>Chance</td>
            {game. players.map((p) => (
              <td key={p.playerId} className="text-center">
                {p. chance}
              </td>
            ))}
          </tr>
          <tr className="table-info">
            <td>
              <strong>Lower Total</strong>
            </td>
            {game.players.map((p) => (
              <td key={p. playerId} className="text-center">
                <strong>{p.bottomTotal}</strong>
              </td>
            ))}
          </tr>

          {/* Grand Total */}
          <tr className="table-warning">
            <td>
              <strong>Grand Total</strong>
            </td>
            {game. players.map((p) => (
              <td key={p.playerId} className="text-center">
                <strong>{p.grandTotal}</strong>
              </td>
            ))}
          </tr>
        </tbody>
      </Table>
    </Container>
  );
};

export default GameDetail;