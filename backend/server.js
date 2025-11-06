const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 3000;
const DATA_PATH = path.join(__dirname, "team.json");

app.use(cors());
app.use(express.json());

app.get("/api/team", (req, res) => {
  fs.readFile(DATA_PATH, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading team file:", err);
      return res.status(500).json([]);
    }
    try {
      const team = JSON.parse(data);
      res.json(Array.isArray(team) ? team : []);
    } catch (parseErr) {
      console.error("Error parsing team file:", parseErr);
      res.json([]);
    }
  });
});

app.post("/api/team", (req, res) => {
  const { characterId } = req.body;
  if (!characterId || typeof characterId !== "string") {
    return res.status(400).json({ error: "Missing or invalid characterId" });
  }

  fs.readFile(DATA_PATH, "utf8", (err, data) => {
    let team = [];
    if (!err) {
      try {
        team = JSON.parse(data);
        if (!Array.isArray(team)) team = [];
      } catch {
        team = [];
      }
    }

    if (!team.includes(characterId)) {
      team.push(characterId);
      fs.writeFile(DATA_PATH, JSON.stringify(team, null, 2), (err) => {
        if (err) {
          console.error("Error writing team file:", err);
          return res.status(500).json({ error: "Error writing team file" });
        }
        res.json({ success: true });
      });
    } else {
      res.json({ success: true });
    }
  });
});

app.delete("/api/team/:id", (req, res) => {
  const id = req.params.id;

  fs.readFile(DATA_PATH, "utf8", (err, data) => {
    let team = [];
    if (!err) {
      try {
        team = JSON.parse(data);
        if (!Array.isArray(team)) team = [];
      } catch {
        team = [];
      }
    }

    const updatedTeam = team.filter(
      (memberId) => String(memberId) !== String(id)
    );
    fs.writeFile(DATA_PATH, JSON.stringify(updatedTeam, null, 2), (err) => {
      if (err) {
        console.error("Error writing team file:", err);
        return res.status(500).json({ error: "Error writing team file" });
      }
      res.json({ success: true });
    });
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
