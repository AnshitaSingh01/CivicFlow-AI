import { useNavigate } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import { useApp } from "../context/AppContext.jsx";
import StatusBadge, { PriorityTag } from "../components/StatusBadge.jsx";

export default function MyComplaints() {
  const navigate = useNavigate();
  const { complaints, loading } = useApp();

  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">My Complaints</h1>
          <p className="mt-1 text-sm text-ink-soft">Every issue you've reported, in one place.</p>
        </div>
        <button
          onClick={() => navigate("/citizen/report")}
          className="hidden shrink-0 items-center gap-2 rounded-xl bg-signal px-4 py-2.5 text-sm font-semibold text-white shadow-sm sm:flex"
        >
          <PlusCircle size={16} />
          New Report
        </button>
      </div>

      {loading ? (
        <div className="mt-6 space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl bg-paper-dim" />
          ))}
        </div>
      ) : complaints.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-line p-10 text-center">
          <p className="text-sm text-ink-soft">You haven't reported anything yet.</p>
          <button
            onClick={() => navigate("/citizen/report")}
            className="mt-4 rounded-xl bg-signal px-4 py-2.5 text-sm font-semibold text-white"
          >
            Report an Issue
          </button>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {complaints.map((c) => (
            <button
              key={c.id}
              onClick={() => navigate(`/citizen/track/${c.id}`)}
              className="flex w-full items-center justify-between gap-4 rounded-xl border border-line bg-white p-4 text-left transition-colors hover:border-civic/30"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-paper-dim text-lg">
                  {c.icon}
                </span>
                <div>
                  <p className="font-display text-sm font-semibold text-ink">
                    {c.id} · {c.label}
                  </p>
                  <p className="text-xs text-ink-soft">{c.department} · {c.location}</p>
                </div>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1.5">
                <PriorityTag priority={c.priority} />
                <StatusBadge status={c.status} />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
