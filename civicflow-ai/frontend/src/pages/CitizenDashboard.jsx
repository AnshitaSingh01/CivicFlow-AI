import { useNavigate } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import { useApp } from "../context/AppContext.jsx";
import StatusBadge, { PriorityTag } from "../components/StatusBadge.jsx";

export default function CitizenDashboard() {
  const navigate = useNavigate();
  const { complaints, loading } = useApp();

  const total = complaints.length;
  const inProgress = complaints.filter(
    (c) => c.status === "IN_PROGRESS" || c.status === "ASSIGNED" || c.status === "AI_VERIFIED"
  ).length;
  const resolved = complaints.filter((c) => c.status === "RESOLVED").length;

  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <h1 className="font-display text-2xl font-semibold text-ink">Welcome back, Citizen</h1>
      <p className="mt-1 text-sm text-ink-soft">Here's what's happening with your reports.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <StatCard label="Total Reports" value={total} />
        <StatCard label="In Progress" value={inProgress} accent="signal" />
        <StatCard label="Resolved" value={resolved} accent="success" />
      </div>

      <button
        onClick={() => navigate("/citizen/report")}
        className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-signal py-3.5 text-sm font-semibold text-white shadow-md shadow-signal/25 transition-transform hover:-translate-y-0.5 sm:w-auto sm:px-6"
      >
        <PlusCircle size={17} />
        Report New Issue
      </button>

      <div className="mt-10">
        <h2 className="font-display text-base font-semibold text-ink">Recent Reports</h2>
        {loading ? (
          <div className="mt-4 space-y-3">
            {[0, 1].map((i) => (
              <div key={i} className="h-20 animate-pulse rounded-xl bg-paper-dim" />
            ))}
          </div>
        ) : complaints.length === 0 ? (
          <p className="mt-4 rounded-xl border border-dashed border-line p-6 text-center text-sm text-ink-soft">
            No reports yet. Report your first civic issue to see it here.
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            {complaints.slice(0, 6).map((c) => (
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
                    <p className="text-xs text-ink-soft">{c.location}</p>
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
    </div>
  );
}

function StatCard({ label, value, accent }) {
  const accentClass =
    accent === "signal"
      ? "text-signal-dark"
      : accent === "success"
      ? "text-success"
      : "text-ink";
  return (
    <div className="rounded-2xl border border-line bg-white p-5">
      <p className="text-xs font-medium text-ink-soft">{label}</p>
      <p className={`mt-2 font-display text-3xl font-semibold ${accentClass}`}>{value}</p>
    </div>
  );
}
