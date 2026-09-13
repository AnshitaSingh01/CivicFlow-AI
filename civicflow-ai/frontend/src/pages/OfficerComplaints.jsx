import { useApp } from "../context/AppContext.jsx";
import OfficerComplaintCard from "../components/OfficerComplaintCard.jsx";
import StatusBadge, { PriorityTag } from "../components/StatusBadge.jsx";

export default function OfficerComplaints() {
  const { complaints, loading, updateStatus, pushToast } = useApp();

  async function handleAction(id, nextStatus) {
    try {
      await updateStatus(id, nextStatus);
    } catch {
      pushToast("Couldn't update the complaint. Please retry.");
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <h1 className="font-display text-2xl font-semibold text-ink">All Complaints</h1>
      <p className="mt-1 text-sm text-ink-soft">Road Department queue, including resolved cases.</p>

      {loading ? (
        <div className="mt-6 space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl bg-paper-dim" />
          ))}
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {complaints.map((c) =>
            c.status === "RESOLVED" ? (
              <div
                key={c.id}
                className="flex items-center justify-between gap-4 rounded-xl border border-line bg-white p-4 opacity-80"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-paper-dim text-xl">
                    {c.icon}
                  </span>
                  <div>
                    <p className="font-display text-sm font-semibold text-ink">
                      #{c.id} · {c.label}
                    </p>
                    <p className="text-xs text-ink-soft">{c.ward}</p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  <PriorityTag priority={c.priority} />
                  <StatusBadge status={c.status} />
                </div>
              </div>
            ) : (
              <OfficerComplaintCard key={c.id} complaint={c} onAction={handleAction} />
            )
          )}
        </div>
      )}
    </div>
  );
}
