// ============================================================
// AI SERVICE — DEMO MODE
// ------------------------------------------------------------
// This is a MOCK inference layer built for a one-day hackathon
// prototype. It does NOT run real computer vision — it maps a
// small set of demo scenarios to a realistic-looking detection
// result so the end-to-end flow can be demoed convincingly.
//
// To connect a real model later:
//   1. Set VITE_AI_API_URL / AI_API_URL to your inference endpoint.
//   2. Replace the body of analyzeImage() with a fetch/axios call
//      that posts the image and returns { issueType, confidence,
//      severity, description } in the same shape.
// Nothing else in the app needs to change.
// ============================================================

import { departmentFor } from "../data/store.js";

const DEMO_SCENARIOS = [
  {
    match: ["pothole", "road", "crack"],
    issueType: "pothole",
    label: "Pothole",
    icon: "🕳️",
    confidence: 0.94,
    severity: "HIGH",
    description: "Large road surface damage detected.",
  },
  {
    match: ["garbage", "trash", "waste", "dump"],
    issueType: "garbage",
    label: "Garbage",
    icon: "🗑️",
    confidence: 0.91,
    severity: "MEDIUM",
    description: "Accumulated waste detected on public property.",
  },
  {
    match: ["light", "streetlight", "lamp"],
    issueType: "broken_streetlight",
    label: "Broken Streetlight",
    icon: "💡",
    confidence: 0.89,
    severity: "MEDIUM",
    description: "Streetlight appears damaged or non-functional.",
  },
];

/**
 * DEMO MODE inference. Picks a scenario based on the uploaded
 * file's name when available, otherwise cycles through the demo
 * set so repeated uploads still feel varied during a live demo.
 */
let cursor = 0;

export function analyzeImage({ filename = "" } = {}) {
  const lower = filename.toLowerCase();
  let scenario = DEMO_SCENARIOS.find((s) =>
    s.match.some((keyword) => lower.includes(keyword))
  );

  if (!scenario) {
    scenario = DEMO_SCENARIOS[cursor % DEMO_SCENARIOS.length];
    cursor += 1;
  }

  const department = departmentFor(scenario.issueType);

  return {
    mode: "DEMO_MODE",
    issueType: scenario.issueType,
    label: scenario.label,
    icon: scenario.icon,
    confidence: scenario.confidence,
    severity: scenario.severity,
    priority: scenario.severity,
    description: scenario.description,
    department,
  };
}
