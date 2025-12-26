import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Container, Alert, Spinner, Form } from "react-bootstrap";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getGames } from "../api/games.js";

// Color palette for player lines
const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7300",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#0088FE",
];

const Analytics = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scoreType, setScoreType] = useState("grandTotal");

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const data = await getGames();
        setGames(data);
      } catch (err) {
        console.error("Error fetching games:", err);
        setError("Failed to load games");
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

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
      </Container>
    );
  }

  if (games.length === 0) {
    return (
      <Container>
        <h2 className="mb-4">Analytics</h2>
        <Alert variant="info">
          No games yet!{" "}
          <Alert.Link as={Link} to="/game/new">
            Create your first game
          </Alert.Link>{" "}
          to see analytics.
        </Alert>
      </Container>
    );
  }

  // Build a map of playerId -> most recent name
  const playerNames = {};
  games.forEach((game) => {
    game.players.forEach((player) => {
      playerNames[player.playerId] = player. name;
    });
  });

  // Get unique player IDs
  const uniquePlayerIds = [...new Set(Object.keys(playerNames))];

  // Transform games into chart data
  // Sort by date ascending for the chart
  const sortedGames = [... games].sort(
    (a, b) => new Date(a.datePlayed) - new Date(b.datePlayed)
  );

  const chartData = sortedGames.map((game) => {
    const dataPoint = {
      date: new Date(game.datePlayed).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      fullDate: game.datePlayed,
    };

    game.players.forEach((player) => {
      dataPoint[player.playerId] = player[scoreType];
    });

    return dataPoint;
  });

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Analytics</h2>
        <Form. Select
          style={{ width: "auto" }}
          value={scoreType}
          onChange={(e) => setScoreType(e.target. value)}
        >
          <option value="grandTotal">Grand Total</option>
          <option value="topTotal">Upper Section Total</option>
          <option value="bottomTotal">Lower Section Total</option>
        </Form.Select>
      </div>

      <div style={{ width: "100%", height: 400 }}>
        <ResponsiveContainer>
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip
              labelFormatter={(label, payload) => {
                if (payload && payload[0]) {
                  return new Date(payload[0]. payload.fullDate).toLocaleDateString(
                    "en-US",
                    {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    }
                  );
                }
                return label;
              }}
            />
            <Legend />
            {uniquePlayerIds.map((playerId, index) => (
              <Line
                key={playerId}
                type="monotone"
                dataKey={playerId}
                name={playerNames[playerId]}
                stroke={COLORS[index % COLORS.length]}
                strokeWidth={2}
                dot={{ r: 4 }}
                connectNulls
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <p className="text-muted text-center mt-3">
        Showing {scoreType === "grandTotal" ?  "Grand Total" :  scoreType === "topTotal" ? "Upper Section Total" : "Lower Section Total"} scores over {games.length} game{games.length !== 1 ? "s" : ""}
      </p>
    </Container>
  );
};

export default Analytics;