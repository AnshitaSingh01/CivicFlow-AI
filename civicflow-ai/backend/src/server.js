import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import complaintsRouter from "./routes/complaints.js";
import aiRouter from "./routes/ai.js";
import notificationsRouter from "./routes/notifications.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(express.json({ limit: "5mb" }));

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    storage: process.env.MONGO_URI ? "mongodb (not implemented in demo)" : "in-memory (demo fallback)",
  });
});

app.use("/api/complaints", complaintsRouter);
app.use("/api/ai", aiRouter);
app.use("/api/notifications", notificationsRouter);

app.use((req, res) => {
  res.status(404).json({ error: "Not found." });
});

app.listen(PORT, () => {
  console.log(`CivicFlow AI backend running on http://localhost:${PORT}`);
  if (!process.env.MONGO_URI) {
    console.log("MONGO_URI not set — using in-memory demo data store.");
  }
});
