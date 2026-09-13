import { useApp } from "../context/AppContext.jsx";
import OfficerComplaintCard from "../components/OfficerComplaintCard.jsx";

export default function OfficerDashboard() {
  const { complaints, loading, updateStatus, pushToast } = useApp();

  const newCount = complaints.filter((c) => c.status === "REPORTED").length;
  const highCount = complaints.filter((c) => c.priority === "HIGH" && c.status !== "RESOLVED").length;
  const inProgressCount = complaints.filter((c) => c.status === "IN_PROGRESS").length;
  const resolvedCount = complaints.filter((c) => c.status === "RESOLVED").length;

  const queue = complaints.filter((c) => c.status !== "RESOLVED");

  async function handleAction(id, nextStatus) {
    try {
      await updateStatus(id, nextStatus);
    } catch {
      pushToast("Couldn't update the complaint. Please retry.");
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <h1 className="font-display text-2xl font-semibold text-ink">Road Department</h1>
      <p className="mt-1 text-sm text-ink-soft">Officer Dashboard</p>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="New" value={newCount} />
        <StatCard label="High Priority" value={highCount} accent="warn" />
        <StatCard label="In Progress" value={inProgressCount} accent="signal" />
        <StatCard label="Resolved" value={resolvedCount} accent="success" />
      </div>

      <div className="mt-10">
        <h2 className="font-display text-base font-semibold text-ink">Active Queue</h2>
        {loading ? (
          <div className="mt-4 space-y-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-24 animate-pulse rounded-xl bg-paper-dim" />
            ))}
          </div>
        ) : queue.length === 0 ? (
          <p className="mt-4 rounded-xl border border-dashed border-line p-8 text-center text-sm text-ink-soft">
            Queue clear — no active complaints right now.
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            {queue.map((c) => (
              <OfficerComplaintCard key={c.id} complaint={c} onAction={handleAction} />
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
      : accent === "warn"
      ? "text-warn"
      : "text-ink";
  return (
    <div className="rounded-2xl border border-line bg-white p-4">
      <p className="text-xs font-medium text-ink-soft">{label}</p>
      <p className={`mt-1.5 font-display text-2xl font-semibold ${accentClass}`}>{value}</p>
    </div>
  );
}
