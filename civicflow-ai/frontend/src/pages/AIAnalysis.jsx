import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, Building2, MapPin, RefreshCcw, ScanLine, ShieldCheck } from "lucide-react";
import { useApp } from "../context/AppContext.jsx";
import api from "../services/api.js";
import { PriorityTag } from "../components/StatusBadge.jsx";

export default function AIAnalysis() {
  const navigate = useNavigate();
  const { draft, setDraft, submitComplaint, pushToast } = useApp();
  const [phase, setPhase] = useState("scanning"); // scanning | result
  const [analysis, setAnalysis] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!draft?.photo) {
      navigate("/citizen/report");
      return;
    }
    let cancelled = false;
    setPhase("scanning");

    const minDelay = new Promise((resolve) => setTimeout(resolve, 1800));
    Promise.all([api.analyzeImage(draft.filename), minDelay])
      .then(([{ analysis: result }]) => {
        if (cancelled) return;
        setAnalysis(result);
        setPhase("result");
      })
      .catch(() => {
        if (cancelled) return;
        pushToast("AI analysis failed — please try again.");
        navigate("/citizen/report");
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft]);

  async function handleSubmit() {
    setSubmitting(true);
    try {
      const complaint = await submitComplaint({
        issueType: analysis.issueType,
        label: analysis.label,
        icon: analysis.icon,
        confidence: analysis.confidence,
        severity: analysis.severity,
        description: analysis.description,
        location: draft.location.address,
        ward: draft.location.ward,
      });
      setDraft(null);
      navigate(`/citizen/success/${complaint.id}`);
    } catch (err) {
      pushToast("Couldn't submit the complaint. Please try again.");
      setSubmitting(false);
    }
  }

  function handleChangeIssue() {
    setDraft(null);
    navigate("/citizen/report");
  }

  if (phase === "scanning") {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-5 py-20 text-center">
        <div className="relative mb-6 h-48 w-full max-w-xs overflow-hidden rounded-2xl border border-line shadow-sm">
          <img src={draft?.photo} alt="Uploaded issue" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-civic/10" />
          <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-signal/60 to-transparent animate-scanline" />
        </div>
        <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-civic/10 text-civic">
          <ScanLine size={18} className="animate-pulse" />
        </span>
        <p className="font-display text-lg font-semibold text-ink">Analyzing your report…</p>
        <p className="mt-1 text-sm text-ink-soft">DEMO MODE — simulated inference for this prototype.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-5 py-10">
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-ink-soft/70" style={{ letterSpacing: "0.02em" }}>
        AI Detection
      </p>
      <div className="rounded-2xl border border-line bg-white p-6 animate-pop-in">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-signal/10 text-2xl">
            {analysis.icon}
          </span>
          <div>
            <p className="font-display text-lg font-semibold text-ink">{analysis.label} Detected</p>
            <p className="text-xs text-ink-soft">{analysis.description}</p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <MetricBox label="Confidence" value={`${Math.round(analysis.confidence * 100)}%`} />
          <MetricBox label="Severity" value={<PriorityTag priority={analysis.severity} />} raw />
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-line bg-white p-6 animate-pop-in">
        <p className="mb-4 flex items-center gap-2 text-xs font-semibold text-ink-soft">
          <Building2 size={14} />
          Responsible Department
        </p>
        <p className="font-display text-lg font-semibold text-ink">🏢 {analysis.department}</p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <span className="flex items-center gap-1.5 text-ink-soft">
            <MapPin size={14} />
            {draft?.location?.ward}
          </span>
          <span className="flex items-center gap-1.5 text-ink-soft">
            <AlertTriangle size={14} />
            Priority: <PriorityTag priority={analysis.severity} className="ml-1" />
          </span>
        </div>
      </div>

      <div className="mt-2 flex items-center gap-1.5 rounded-xl bg-amber-bg px-4 py-2.5 text-xs text-amber">
        <ShieldCheck size={14} />
        DEMO MODE — this result is simulated for the prototype, not a live model prediction.
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-signal py-3.5 text-sm font-semibold text-white shadow-md shadow-signal/25 transition-transform enabled:hover:-translate-y-0.5 disabled:opacity-60"
        >
          {submitting ? "Submitting…" : "Submit Complaint"}
        </button>
        <button
          onClick={handleChangeIssue}
          className="flex items-center justify-center gap-2 rounded-xl border border-line bg-white px-5 py-3.5 text-sm font-medium text-ink-soft transition-colors hover:border-civic/40 hover:text-civic"
        >
          <RefreshCcw size={15} />
          Change Issue
        </button>
      </div>
    </div>
  );
}

function MetricBox({ label, value, raw }) {
  return (
    <div className="rounded-xl bg-paper-dim p-3.5">
      <p className="text-xs text-ink-soft">{label}</p>
      {raw ? (
        <div className="mt-1">{value}</div>
      ) : (
        <p className="mt-1 font-display text-lg font-semibold text-ink">{value}</p>
      )}
    </div>
  );
}
