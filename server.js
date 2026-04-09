const express = require("express");
const cors = require("cors");

const app = express();

// ✅ MIDDLEWARE
app.use(cors());
app.use(express.json({ limit: "1mb" }));

// ✅ STORAGE
let detections = [];
let bestFind = null;

// ✅ HOME ROUTE (fixes "Cannot GET /")
app.get("/", (req, res) => {
  res.send("Brainrot backend running 🚀");
});

// ✅ GET ALL DETECTIONS
app.get("/detections", (req, res) => {
  res.json({
    total: detections.length,
    bestFind: bestFind,
    detections: detections
  });
});

// ✅ RECEIVE FROM LUA
app.post("/detections", (req, res) => {
  try {
    const detection = req.body;

    // ❗ SAFETY CHECK (prevents crashes)
    if (!detection || typeof detection !== "object") {
      return res.status(400).json({ error: "Invalid data" });
    }

    // ensure gen is number
    detection.gen = Number(detection.gen) || 0;

    // add timestamp if missing
    detection.timestamp = detection.timestamp || Date.now();

    detections.push(detection);

    // update best
    if (!bestFind || detection.gen > bestFind.gen) {
      bestFind = detection;
    }

    console.log("📥 Detection:", detection.name, detection.gen);

    res.json({ status: "ok" });
  } catch (err) {
    console.error("❌ POST ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ AUTO CLEAN (prevents memory crash)
setInterval(() => {
  if (detections.length > 2000) {
    detections = detections.slice(-1000);
    console.log("🧹 Cleaned old detections");
  }
}, 60000);

// ✅ START SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("✅ Server running on port " + PORT);
});
