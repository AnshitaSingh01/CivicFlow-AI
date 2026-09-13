const STYLES = {
  REPORTED: "bg-paper-dim text-ink-soft border-line",
  AI_VERIFIED: "bg-amber-bg text-amber border-amber/30",
  ASSIGNED: "bg-civic/10 text-civic border-civic/20",
  IN_PROGRESS: "bg-signal/10 text-signal-dark border-signal/30",
  RESOLVED: "bg-success-bg text-success border-success/20",
};

const LABELS = {
  REPORTED: "Reported",
  AI_VERIFIED: "AI Verified",
  ASSIGNED: "Assigned",
  IN_PROGRESS: "In Progress",
  RESOLVED: "Resolved",
};

export default function StatusBadge({ status, className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${
        STYLES[status] || STYLES.REPORTED
      } ${className}`}
    >
      {status === "IN_PROGRESS" && (
        <span className="h-1.5 w-1.5 rounded-full bg-signal animate-pulse" />
      )}
      {LABELS[status] || status}
    </span>
  );
}

export function PriorityTag({ priority, className = "" }) {
  const styles = {
    HIGH: "bg-warn-bg text-warn border-warn/20",
    MEDIUM: "bg-amber-bg text-amber border-amber/30",
    LOW: "bg-success-bg text-success border-success/20",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${
        styles[priority] || styles.MEDIUM
      } ${className}`}
    >
      {priority}
    </span>
  );
}
