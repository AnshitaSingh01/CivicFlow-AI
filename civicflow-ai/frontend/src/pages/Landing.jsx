import { useNavigate } from "react-router-dom";
import { ArrowRight, Building2, Camera, MapPinned, ScanSearch, ShieldCheck, Zap } from "lucide-react";

const PIPELINE = [
  { icon: Camera, label: "Citizen Report", detail: "Photo + location" },
  { icon: ScanSearch, label: "AI Detection", detail: "Type + severity" },
  { icon: Building2, label: "Department", detail: "Auto-routed" },
  { icon: ShieldCheck, label: "Resolution", detail: "Tracked live" },
];

const FEATURES = [
  {
    icon: ScanSearch,
    title: "AI-powered detection",
    body: "Understands what's wrong from a single photo — no forms, no dropdowns.",
  },
  {
    icon: Building2,
    title: "Smart department routing",
    body: "Every issue reaches the team responsible for it, automatically.",
  },
  {
    icon: Zap,
    title: "Real-time tracking",
    body: "Watch a complaint move from reported to resolved, step by step.",
  },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-paper">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-6">
        <div className="flex items-center gap-2 font-display text-lg font-semibold tracking-tight">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-civic text-white">
            <ShieldCheck size={17} />
          </span>
          CivicFlow<span className="text-signal-dark">AI</span>
        </div>
        <button
          onClick={() => navigate("/officer")}
          className="text-sm font-medium text-ink-soft hover:text-ink"
        >
          Officer login →
        </button>
      </header>

      <section className="mx-auto grid max-w-6xl gap-12 px-5 pb-20 pt-8 md:grid-cols-[1.1fr_0.9fr] md:items-center">
        <div>
          <p className="mb-4 text-sm font-medium text-signal-dark">
            Report. Track. Resolve.
          </p>
          <h1 className="font-display text-4xl font-semibold leading-[1.1] tracking-tight text-ink sm:text-5xl">
            Civic problems shouldn't disappear into complaints.
          </h1>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-ink-soft">
            Report civic issues in seconds, automatically route them to the
            right department, and track resolution in real time.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={() => navigate("/citizen/report")}
              className="group flex items-center gap-2 rounded-xl bg-signal px-5 py-3 text-sm font-semibold text-white shadow-md shadow-signal/25 transition-transform hover:-translate-y-0.5"
            >
              Report an Issue
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </button>
            <button
              onClick={() => navigate("/citizen/complaints")}
              className="rounded-xl border border-line bg-white px-5 py-3 text-sm font-semibold text-ink transition-colors hover:border-civic/40 hover:text-civic"
            >
              Track Complaint
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-white p-6 shadow-sm shadow-ink/5">
          <p className="mb-5 font-display text-sm font-semibold text-ink-soft">
            How a report moves
          </p>
          <div className="flex flex-col">
            {PIPELINE.map(({ icon: Icon, label, detail }, index) => (
              <div key={label} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-civic/10 text-civic">
                    <Icon size={19} />
                  </span>
                  {index < PIPELINE.length - 1 && (
                    <span className="my-1 h-8 w-px bg-line" />
                  )}
                </div>
                <div className="pb-6">
                  <p className="font-display text-sm font-semibold text-ink">{label}</p>
                  <p className="text-xs text-ink-soft">{detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-24">
        <div className="grid gap-5 sm:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="rounded-2xl border border-line bg-white p-6 transition-shadow hover:shadow-md hover:shadow-ink/5"
            >
              <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-signal/10 text-signal-dark">
                <Icon size={18} />
              </span>
              <p className="font-display text-base font-semibold text-ink">{title}</p>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-line py-8 text-center text-xs text-ink-soft">
        <MapPinned size={14} className="mx-auto mb-2 text-line" />
        Built for a one-day civic-tech hackathon prototype.
      </footer>
    </div>
  );
}
