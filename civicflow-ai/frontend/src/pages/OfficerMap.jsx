import { useApp } from "../context/AppContext.jsx";
import { MapPin } from "lucide-react";

export default function OfficerMap() {
  const { complaints } = useApp();
  const active = complaints.filter((c) => c.status !== "RESOLVED");

  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <h1 className="font-display text-2xl font-semibold text-ink">Complaint Map</h1>
      <p className="mt-1 text-sm text-ink-soft">
        A geographic view is planned for the next development phase.
      </p>

      <div className="mt-6 rounded-2xl border border-dashed border-line bg-paper-dim/60 p-10 text-center">
        <MapPin className="mx-auto mb-3 text-civic" size={28} />
        <p className="text-sm text-ink-soft">
          Live map view coming soon — for now, here's the active queue by ward.
        </p>
        <div className="mx-auto mt-6 flex max-w-sm flex-col gap-2 text-left">
          {active.map((c) => (
            <div
              key={c.id}
              className="flex items-center justify-between rounded-lg border border-line bg-white px-3 py-2 text-sm"
            >
              <span className="text-ink">{c.ward}</span>
              <span className="text-ink-soft">
                {c.icon} {c.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
