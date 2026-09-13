import { Router } from "express";
import { analyzeImage } from "../services/aiService.js";

const router = Router();

// POST /api/ai/analyze
// Body: { filename?: string }
// This prototype does not accept real binary uploads — it reads
// the filename hint to pick a demo scenario. See aiService.js for
// how to wire in a real model.
router.post("/analyze", (req, res) => {
  const { filename } = req.body || {};
  const result = analyzeImage({ filename });
  res.json({ analysis: result });
});

export default router;
