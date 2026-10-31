const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, "data");
const DATA_FILE = path.join(DATA_DIR, "consultations.json");
const FRONTEND_DIR = path.join(__dirname, "..", "frontend");

app.disable("x-powered-by");
app.use(express.json({ limit: "20kb" }));

// Serve the static frontend from the same origin as the API.
app.use(express.static(FRONTEND_DIR));

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, "[]", "utf8");
}

function readConsultations() {
  ensureDataFile();
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  } catch {
    throw new Error("Could not read consultation storage.");
  }
}

function cleanText(value, maxLength) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "NutriFlow AI API" });
});

app.post("/api/consultations", (req, res) => {
  const name = cleanText(req.body.name, 100);
  const email = cleanText(req.body.email, 160).toLowerCase();
  const interest = cleanText(req.body.interest, 80);
  const message = cleanText(req.body.message, 1200);

  if (name.length < 2) return res.status(400).json({ error: "Please enter your name." });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "Please enter a valid email address." });
  }
  const allowedInterests = [
    "Personalized nutrition",
    "Nutrition consultation",
    "Nutrition education",
    "General question"
  ];
  if (!allowedInterests.includes(interest)) {
    return res.status(400).json({ error: "Please choose a valid service." });
  }

  try {
    const consultations = readConsultations();
    const record = {
      id: require("crypto").randomUUID(),
      name,
      email,
      interest,
      message,
      createdAt: new Date().toISOString(),
      status: "new"
    };
    consultations.push(record);
    fs.writeFileSync(DATA_FILE, JSON.stringify(consultations, null, 2), "utf8");
    return res.status(201).json({
      message: "Consultation request received.",
      id: record.id
    });
  } catch (error) {
    console.error("Consultation save failed:", error.message);
    return res.status(500).json({ error: "We couldn't save your request. Please try again later." });
  }
});

// Fallback to the landing page for frontend routes.
app.get("*", (_req, res) => {
  res.sendFile(path.join(FRONTEND_DIR, "index.html"));
});

app.listen(PORT, () => {
  ensureDataFile();
  console.log(`NutriFlow AI is running at http://localhost:${PORT}`);
});
