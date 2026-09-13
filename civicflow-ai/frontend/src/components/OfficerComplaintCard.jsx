import { useState } from "react";
import { MapPin } from "lucide-react";
import StatusBadge, { PriorityTag } from "./StatusBadge.jsx";

const ACTIONS = {
  REPORTED: { label: "Accept", next: "ASSIGNED" },
  ASSIGNED: { label: "Start Work", next: "IN_PROGRESS" },
  IN_PROGRESS: { label: "Mark Resolved", next: "RESOLVED" },
};

export default function OfficerComplaintCard({ complaint, onAction }) {
  const [busy, setBusy] = useState(false);
  const action = ACTIONS[complaint.status];
  const badgeLabel = complaint.status === "REPORTED" ? "NEW" : null;

  async function handleClick() {
    if (!action) return;
    setBusy(true);
    await onAction(complaint.id, action.next);
    setBusy(false);
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-line bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-paper-dim text-xl">
          {complaint.icon}
        </span>
        <div>
          <p className="font-display text-sm font-semibold text-ink">
            #{complaint.id} · {complaint.label}
          </p>
          <p className="mt-0.5 flex items-center gap-1 text-xs text-ink-soft">
            <MapPin size={12} />
            {complaint.ward}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <PriorityTag priority={complaint.priority} />
            {badgeLabel ? (
              <span className="inline-flex items-center rounded-full border border-civic/20 bg-civic/10 px-2.5 py-1 text-xs font-medium text-civic">
                {badgeLabel}
              </span>
            ) : (
              <StatusBadge status={complaint.status} />
            )}
          </div>
        </div>
      </div>

      {action && (
        <button
          onClick={handleClick}
          disabled={busy}
          className="shrink-0 rounded-xl bg-civic px-4 py-2.5 text-sm font-semibold text-white transition-transform enabled:hover:-translate-y-0.5 disabled:opacity-60"
        >
          {busy ? "Updating…" : action.label}
        </button>
      )}
    </div>
  );
}
