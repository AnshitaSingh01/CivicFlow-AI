// ============================================================
// DEMO IN-MEMORY DATA STORE
// ------------------------------------------------------------
// Prototype fallback used because MONGO_URI is not configured.
// Swap this module for a real MongoDB-backed repository later —
// every function below is written so the routes never need to
// change, only what's behind them.
// ============================================================

export const DEPARTMENT_ROUTING = {
  pothole: "Road Department",
  damaged_road: "Road Department",
  garbage: "Municipal Corporation",
  illegal_dumping: "Municipal Corporation",
  broken_streetlight: "Electricity Department",
  water_leakage: "Water Department",
  drainage: "Water Department",
};

export const STATUS_FLOW = [
  "REPORTED",
  "AI_VERIFIED",
  "ASSIGNED",
  "IN_PROGRESS",
  "RESOLVED",
];

function now(minutesAgo = 0) {
  return new Date(Date.now() - minutesAgo * 60_000).toISOString();
}

let complaints = [
  {
    id: "CF1024",
    issueType: "pothole",
    label: "Pothole",
    icon: "🕳️",
    confidence: 0.94,
    severity: "HIGH",
    priority: "HIGH",
    description: "Large road surface damage detected.",
    location: "XYZ Road, Ward 12",
    ward: "Ward 12",
    department: "Road Department",
    status: "IN_PROGRESS",
    citizen: "Citizen",
    history: [
      { status: "REPORTED", at: now(48) },
      { status: "AI_VERIFIED", at: now(47) },
      { status: "ASSIGNED", at: now(45) },
      { status: "IN_PROGRESS", at: now(18) },
    ],
    createdAt: now(48),
    updatedAt: now(18),
  },
  {
    id: "CF1023",
    issueType: "broken_streetlight",
    label: "Broken Streetlight",
    icon: "💡",
    confidence: 0.9,
    severity: "MEDIUM",
    priority: "MEDIUM",
    description: "Streetlight appears non-functional after dusk.",
    location: "Lakeview Avenue, Ward 7",
    ward: "Ward 7",
    department: "Electricity Department",
    status: "RESOLVED",
    citizen: "Citizen",
    history: [
      { status: "REPORTED", at: now(240) },
      { status: "AI_VERIFIED", at: now(239) },
      { status: "ASSIGNED", at: now(235) },
      { status: "IN_PROGRESS", at: now(200) },
      { status: "RESOLVED", at: now(120) },
    ],
    createdAt: now(240),
    updatedAt: now(120),
  },
  {
    id: "CF1022",
    issueType: "garbage",
    label: "Garbage",
    icon: "🗑️",
    confidence: 0.91,
    severity: "HIGH",
    priority: "HIGH",
    description: "Uncollected garbage piling up near residential block.",
    location: "Market Street, Ward 4",
    ward: "Ward 4",
    department: "Municipal Corporation",
    status: "ASSIGNED",
    citizen: "Citizen",
    history: [
      { status: "REPORTED", at: now(30) },
      { status: "AI_VERIFIED", at: now(29) },
      { status: "ASSIGNED", at: now(25) },
    ],
    createdAt: now(30),
    updatedAt: now(25),
  },
];

let notifications = [
  {
    id: "N1",
    complaintId: "CF1023",
    message: "Complaint #CF1023 has been resolved.",
    createdAt: now(120),
    read: false,
  },
  {
    id: "N2",
    complaintId: "CF1024",
    message: "Complaint #CF1024 is now In Progress.",
    createdAt: now(18),
    read: false,
  },
];

let counter = 1025;

export function nextComplaintId() {
  return `CF${counter++}`;
}

export function getAllComplaints() {
  return [...complaints].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
}

export function getComplaintById(id) {
  return complaints.find((c) => c.id === id) || null;
}

export function createComplaint(payload) {
  const id = nextComplaintId();
  const timestamp = new Date().toISOString();
  const complaint = {
    id,
    ...payload,
    status: "REPORTED",
    citizen: payload.citizen || "Citizen",
    history: [{ status: "REPORTED", at: timestamp }],
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  complaints.unshift(complaint);
  return complaint;
}

export function advanceToVerifiedAndAssigned(id) {
  const complaint = getComplaintById(id);
  if (!complaint) return null;
  const t1 = new Date().toISOString();
  complaint.status = "ASSIGNED";
  complaint.history.push({ status: "AI_VERIFIED", at: t1 });
  complaint.history.push({ status: "ASSIGNED", at: t1 });
  complaint.updatedAt = t1;
  return complaint;
}

export function updateComplaintStatus(id, status) {
  const complaint = getComplaintById(id);
  if (!complaint) return null;
  if (!STATUS_FLOW.includes(status)) return null;

  // Officer "Accept" moves a brand-new report straight to ASSIGNED —
  // record the AI_VERIFIED step it implies so the citizen timeline
  // still shows every stage.
  if (status === "ASSIGNED" && complaint.status === "REPORTED") {
    complaint.history.push({ status: "AI_VERIFIED", at: new Date().toISOString() });
  }

  complaint.status = status;
  complaint.updatedAt = new Date().toISOString();
  complaint.history.push({ status, at: complaint.updatedAt });

  const messages = {
    ASSIGNED: `Complaint #${id} has been assigned to ${complaint.department}.`,
    IN_PROGRESS: `Complaint #${id} is now In Progress.`,
    RESOLVED: `Complaint #${id} has been resolved.`,
  };
  if (messages[status]) {
    addNotification(id, messages[status]);
  }
  return complaint;
}

export function addNotification(complaintId, message) {
  const notification = {
    id: `N${notifications.length + 1}-${Date.now()}`,
    complaintId,
    message,
    createdAt: new Date().toISOString(),
    read: false,
  };
  notifications.unshift(notification);
  return notification;
}

export function getAllNotifications() {
  return [...notifications];
}

export function departmentFor(issueType) {
  return DEPARTMENT_ROUTING[issueType] || "Municipal Corporation";
}
