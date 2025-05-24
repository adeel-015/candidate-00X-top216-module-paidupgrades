import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5050;

app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
    methods: ["POST"],
    credentials: true,
  })
);

app.use(express.json());

app.post("/api/create-upgrade-session", (req, res) => {
  const { finalistId, tier, amount } = req.body;
  console.log("API HIT:", req.body);

  const validTiers = {
    boost: 900,
    premium: 4900,
  };

  if (finalistId === "FIN_123" && validTiers[tier] === amount) {
    return res.json({ sessionId: "cs_test_123" });
  }

  return res.status(403).json({ error: "Forbidden – Invalid request" });
});

app.listen(PORT, () => {
  console.log(`Mock API running on http://localhost:${PORT}`);
});
