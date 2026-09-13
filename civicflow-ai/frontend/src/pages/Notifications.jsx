import { Bell } from "lucide-react";
import { useApp } from "../context/AppContext.jsx";
import { timeAgo } from "../lib/status.js";

export default function Notifications() {
  const { notifications, loading } = useApp();

  return (
    <div className="mx-auto max-w-2xl px-5 py-10">
      <h1 className="font-display text-2xl font-semibold text-ink">Notifications</h1>
      <p className="mt-1 text-sm text-ink-soft">Updates on your civic reports.</p>

      {loading ? (
        <div className="mt-6 space-y-3">
          {[0, 1].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-paper-dim" />
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <p className="mt-6 rounded-xl border border-dashed border-line p-8 text-center text-sm text-ink-soft">
          No notifications yet.
        </p>
      ) : (
        <div className="mt-6 space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              className="flex items-start gap-3 rounded-xl border border-line bg-white p-4"
            >
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-signal/10 text-signal-dark">
                <Bell size={16} />
              </span>
              <div>
                <p className="text-sm text-ink">{n.message}</p>
                <p className="mt-1 text-xs text-ink-soft">{timeAgo(n.createdAt)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
