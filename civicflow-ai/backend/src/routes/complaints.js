import { Router } from "express";
import {
  getAllComplaints,
  getComplaintById,
  createComplaint,
  updateComplaintStatus,
  departmentFor,
} from "../data/store.js";

const router = Router();

// GET /api/complaints
router.get("/", (req, res) => {
  res.json({ complaints: getAllComplaints() });
});

// GET /api/complaints/:id
router.get("/:id", (req, res) => {
  const complaint = getComplaintById(req.params.id);
  if (!complaint) {
    return res.status(404).json({ error: "Complaint not found." });
  }
  res.json({ complaint });
});

// POST /api/complaints
router.post("/", (req, res) => {
  const { issueType, label, icon, confidence, severity, description, location, ward } =
    req.body || {};

  if (!issueType || !location) {
    return res
      .status(400)
      .json({ error: "issueType and location are required." });
  }

  const department = departmentFor(issueType);

  const complaint = createComplaint({
    issueType,
    label: label || issueType,
    icon: icon || "📍",
    confidence: confidence ?? 0.9,
    severity: severity || "MEDIUM",
    priority: severity || "MEDIUM",
    description: description || "",
    location,
    ward: ward || "Unknown Ward",
    department,
  });

  res.status(201).json({ complaint });
});

// PUT /api/complaints/:id/status
router.put("/:id/status", (req, res) => {
  const { status } = req.body || {};
  if (!status) {
    return res.status(400).json({ error: "status is required." });
  }
  const complaint = updateComplaintStatus(req.params.id, status);
  if (!complaint) {
    return res
      .status(404)
      .json({ error: "Complaint not found or invalid status." });
  }
  res.json({ complaint });
});

export default router;
