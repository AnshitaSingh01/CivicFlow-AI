import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Bell, MapPin } from "lucide-react";
import { useApp } from "../context/AppContext.jsx";
import StatusTimeline from "../components/StatusTimeline.jsx";
import { PriorityTag } from "../components/StatusBadge.jsx";
import { timeAgo } from "../lib/status.js";

const LATEST_NOTE = {
  ASSIGNED: "Your complaint has been assigned to a department.",
  IN_PROGRESS: "Officer has started working on your complaint.",
  RESOLVED: "Your civic issue has been resolved.",
};

export default function TrackComplaint() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { complaints, loading } = useApp();
  const complaint = useMemo(() => complaints.find((c) => c.id === id), [complaints, id]);
  const [notFoundChecked, setNotFoundChecked] = useState(false);

  useEffect(() => {
    if (!loading) setNotFoundChecked(true);
  }, [loading]);

  if (!complaint && !notFoundChecked) {
    return <div className="mx-auto max-w-lg px-5 py-20 text-center text-sm text-ink-soft">Loading…</div>;
  }

  if (!complaint) {
    return (
      <div className="mx-auto max-w-lg px-5 py-20 text-center">
        <p className="text-sm text-ink-soft">We couldn't find that complaint.</p>
        <button
          onClick={() => navigate("/citizen/complaints")}
          className="mt-4 rounded-xl bg-civic px-4 py-2.5 text-sm font-semibold text-white"
        >
          View my complaints
        </button>
      </div>
    );
  }

  const note = LATEST_NOTE[complaint.status];

  return (
    <div className="mx-auto max-w-lg px-5 py-10">
      <h1 className="font-display text-2xl font-semibold text-ink">Track Complaint</h1>

      <div className="mt-5 rounded-2xl border border-line bg-white p-6">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-paper-dim text-xl">
            {complaint.icon}
          </span>
          <div>
            <p className="font-display text-base font-semibold text-ink">
              #{complaint.id} · {complaint.label}
            </p>
            <p className="flex items-center gap-1 text-xs text-ink-soft">
              <MapPin size={12} />
              {complaint.location}
            </p>
          </div>
          <PriorityTag priority={complaint.priority} className="ml-auto" />
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-line bg-white p-6">
        <StatusTimeline complaint={complaint} />
      </div>

      <p className="mt-3 text-center text-xs text-ink-soft">
        Last updated {timeAgo(complaint.updatedAt)}
      </p>

      {note && (
        <div className="mt-4 flex items-start gap-3 rounded-xl border border-signal/20 bg-signal/5 p-4 animate-pop-in">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-signal/10 text-signal-dark">
            <Bell size={16} />
          </span>
          <p className="text-sm text-ink">{note}</p>
        </div>
      )}
    </div>
  );
}
