export const STATUS_FLOW = [
  "REPORTED",
  "AI_VERIFIED",
  "ASSIGNED",
  "IN_PROGRESS",
  "RESOLVED",
];

export const STATUS_LABELS = {
  REPORTED: "Reported",
  AI_VERIFIED: "AI Verified",
  ASSIGNED: "Assigned to Department",
  IN_PROGRESS: "In Progress",
  RESOLVED: "Resolved",
};

export function timeAgo(iso) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.round(diffMs / 60000);
  if (minutes < 1) return "just now";
  if (minutes === 1) return "1 minute ago";
  if (minutes < 60) return `${minutes} minutes ago`;
  const hours = Math.round(minutes / 60);
  if (hours === 1) return "1 hour ago";
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.round(hours / 24);
  return days === 1 ? "1 day ago" : `${days} days ago`;
}
