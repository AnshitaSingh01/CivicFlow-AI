import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import api from "../services/api.js";
import { PriorityTag } from "../components/StatusBadge.jsx";

export default function ComplaintSuccess() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);

  useEffect(() => {
    api
      .getComplaint(id)
      .then(({ complaint }) => setComplaint(complaint))
      .catch(() => navigate("/citizen"));
  }, [id, navigate]);

  if (!complaint) {
    return <div className="mx-auto max-w-md px-5 py-20 text-center text-sm text-ink-soft">Loading…</div>;
  }

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-5 py-16 text-center">
      <span className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-success-bg text-success animate-pop-in">
        <CheckCircle2 size={32} />
      </span>
      <h1 className="font-display text-2xl font-semibold text-ink">
        Complaint Registered Successfully
      </h1>
      <p className="mt-2 font-display text-lg font-semibold text-signal-dark">#{complaint.id}</p>

      <div className="mt-6 w-full space-y-3 rounded-2xl border border-line bg-white p-6 text-left">
        <Row label="Issue" value={`${complaint.icon} ${complaint.label}`} />
        <Row label="Department" value={complaint.department} />
        <Row label="Priority" value={<PriorityTag priority={complaint.priority} />} />
        <Row label="Location" value={complaint.location} />
      </div>

      <p className="mt-5 text-sm text-ink-soft">An officer has been notified.</p>

      <button
        onClick={() => navigate(`/citizen/track/${complaint.id}`)}
        className="mt-6 w-full rounded-xl bg-signal py-3.5 text-sm font-semibold text-white shadow-md shadow-signal/25 transition-transform hover:-translate-y-0.5"
      >
        Track Complaint
      </button>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-line pb-3 last:border-0 last:pb-0">
      <span className="text-xs font-medium text-ink-soft">{label}</span>
      <span className="font-display text-sm font-semibold text-ink">{value}</span>
    </div>
  );
}
