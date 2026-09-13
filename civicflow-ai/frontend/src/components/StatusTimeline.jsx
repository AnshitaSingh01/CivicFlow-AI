import { Check } from "lucide-react";
import { STATUS_FLOW, STATUS_LABELS } from "../lib/status.js";

function formatTime(iso) {
  if (!iso) return null;
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function StatusTimeline({ complaint }) {
  const historyByStatus = Object.fromEntries(
    (complaint.history || []).map((h) => [h.status, h.at])
  );
  const currentIndex = STATUS_FLOW.indexOf(complaint.status);

  return (
    <ol className="relative ml-3 border-l-2 border-line pl-6">
      {STATUS_FLOW.map((status, index) => {
        const done = index < currentIndex;
        const current = index === currentIndex;
        const pending = index > currentIndex;
        const time = historyByStatus[status];

        return (
          <li key={status} className="mb-8 last:mb-0">
            <span
              className={`absolute -left-[13px] flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                done
                  ? "border-success bg-success text-white"
                  : current
                  ? "border-signal bg-signal text-white shadow-md shadow-signal/30"
                  : "border-line bg-paper text-line"
              }`}
            >
              {done ? (
                <Check size={13} strokeWidth={3} />
              ) : (
                <span className={`h-2 w-2 rounded-full ${current ? "bg-white" : "bg-line"}`} />
              )}
            </span>
            <div className={current ? "animate-pop-in" : ""}>
              <p
                className={`font-display text-sm font-semibold ${
                  pending ? "text-ink-soft/60" : "text-ink"
                } ${current ? "text-base text-signal-dark" : ""}`}
              >
                {STATUS_LABELS[status]}
              </p>
              <p className="mt-0.5 text-xs text-ink-soft">
                {time ? formatTime(time) : pending ? "Pending" : ""}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
