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
    if (err) return res.status(500).json({ error: "Error reading team file" });
    try {
      const team = JSON.parse(data);
      res.json(Array.isArray(team) ? team : []);
    } catch {
      res.status(500).json({ error: "Invalid team data format" });
    }
  });
});

app.get("/api/team/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  fs.readFile(DATA_PATH, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Error reading team file" });
    try {
      const team = JSON.parse(data);
      if (!Array.isArray(team))
        return res.status(500).json({ error: "Invalid team data format" });
      const member = team.find((m) => m.id === id);
      if (!member) return res.status(404).json({ error: "Member not found" });
      res.json(member);
    } catch {
      res.status(500).json({ error: "Invalid team data format" });
    }
  });
});

app.post("/api/team", (req, res) => {
  const member = req.body;
  if (!member || typeof member.id !== "number") {
    return res.status(400).json({ error: "Missing or invalid character data" });
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

    if (!team.some((m) => m.id === member.id)) {
      team.push(member);
      fs.writeFile(DATA_PATH, JSON.stringify(team, null, 2), (err) => {
        if (err)
          return res.status(500).json({ error: "Error writing team file" });
        res.status(201).json(member);
      });
    } else {
      res.status(200).json({ message: "Already in team" });
    }
  });
});

app.patch("/api/team/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const updates = { ...req.body };
  delete updates.id;

  if (updates.origin && typeof updates.origin === "object") {
    updates.origin = updates.origin.name;
  }
  if (updates.location && typeof updates.location === "object") {
    updates.location = updates.location.name;
  }

  fs.readFile(DATA_PATH, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Error reading team file" });

    let team = [];
    try {
      team = JSON.parse(data);
      if (!Array.isArray(team)) team = [];
    } catch {
      return res.status(500).json({ error: "Invalid team data format" });
    }

    const index = team.findIndex((m) => m.id === id);
    if (index === -1)
      return res.status(404).json({ error: "Member not found" });

    team[index] = { ...team[index], ...updates };

    fs.writeFile(DATA_PATH, JSON.stringify(team, null, 2), (err) => {
      if (err)
        return res.status(500).json({ error: "Error writing team file" });
      res.json(team[index]);
    });
  });
});

app.delete("/api/team/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);

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

    const updatedTeam = team.filter((m) => m.id !== id);
    fs.writeFile(DATA_PATH, JSON.stringify(updatedTeam, null, 2), (err) => {
      if (err)
        return res.status(500).json({ error: "Error writing team file" });
      res.status(204).end();
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
