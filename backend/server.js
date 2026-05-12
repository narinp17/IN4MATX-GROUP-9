// importing a tool (Express)
const express = require("express");
const cors = require("cors");

// initalizing a backend server
const app = express();

// allow JSON data sent from frontend
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Friendli backend is running!");
});

// Fake nearby users
app.get("/nearby-users", (req, res) => {
  res.json({
    users: [
      { id: 1, name: "Alex", interests: ["running", "music"], distance: 1.2 },
      { id: 2, name: "Jamie", interests: ["gaming", "art"], distance: 0.7 }
    ]
  });
});

// Fake ping system
app.post("/send-ping", (req, res) => {
  const { from, to } = req.body;

  res.json({
    message: `Ping sent from ${from} to ${to}`
  });
});

// Start server
app.listen(3000, () => {
  console.log("Backend running on http://localhost:3000");
});