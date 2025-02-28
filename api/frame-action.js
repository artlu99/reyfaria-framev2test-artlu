const express = require('express');
const app = express();

app.use(express.json());

app.post('/api/frame-action', (req, res) => {
  res.json({ message: "Frame action ejecutada correctamente." });
});

module.exports = app;
