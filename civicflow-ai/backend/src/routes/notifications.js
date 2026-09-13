import { Router } from "express";
import { getAllNotifications } from "../data/store.js";

const router = Router();

// GET /api/notifications
router.get("/", (req, res) => {
  res.json({ notifications: getAllNotifications() });
});

export default router;
