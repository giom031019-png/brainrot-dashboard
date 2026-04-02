const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

let detections = [];
let bestFind = null;

app.get('/detections', (req, res) => {
  res.json({
    total: detections.length,
    bestFind,
    detections
  });
});

app.post('/detections', (req, res) => {
  const detection = req.body;
  detection.timestamp = Date.now();
  detections.push(detection);

  if (!bestFind || detection.gen > bestFind.gen) {
    bestFind = detection;
  }

  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
