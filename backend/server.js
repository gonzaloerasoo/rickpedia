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
    const team = JSON.parse(data);
    res.json(team);
  });
});

app.post("/api/team", (req, res) => {
  const { characterId } = req.body;
  if (!characterId)
    return res.status(400).json({ error: "Missing characterId" });

  fs.readFile(DATA_PATH, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Error reading team file" });
    let team = JSON.parse(data);
    if (!team.includes(characterId)) {
      team.push(characterId);
      fs.writeFile(DATA_PATH, JSON.stringify(team, null, 2), (err) => {
        if (err)
          return res.status(500).json({ error: "Error writing team file" });
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
    if (err) return res.status(500).json({ error: "Error reading team file" });
    let team = JSON.parse(data);
    team = team.filter((memberId) => memberId !== id);
    fs.writeFile(DATA_PATH, JSON.stringify(team, null, 2), (err) => {
      if (err)
        return res.status(500).json({ error: "Error writing team file" });
      res.json({ success: true });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
