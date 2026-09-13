import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, ImageUp, MapPin, Sparkles } from "lucide-react";
import { useApp } from "../context/AppContext.jsx";

const DEMO_LOCATION = { address: "XYZ Road, Ward 12", ward: "Ward 12" };

export default function ReportIssue() {
  const navigate = useNavigate();
  const { setDraft } = useApp();
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [filename, setFilename] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [location, setLocation] = useState(null);
  const [locating, setLocating] = useState(false);

  function handleFiles(files) {
    const file = files?.[0];
    if (!file) return;
    setFilename(file.name);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(file);
    // Auto-capture demo location the moment a photo is added, mirroring
    // an app that reads photo EXIF / current GPS in the background.
    if (!location) setLocation(DEMO_LOCATION);
  }

  function useMyLocation() {
    setLocating(true);
    if (!navigator.geolocation) {
      setLocation(DEMO_LOCATION);
      setLocating(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          address: DEMO_LOCATION.address,
          ward: DEMO_LOCATION.ward,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setLocating(false);
      },
      () => {
        setLocation(DEMO_LOCATION);
        setLocating(false);
      },
      { timeout: 4000 }
    );
  }

  function handleAnalyze() {
    setDraft({ photo: preview, filename, location });
    navigate("/citizen/analyze");
  }

  return (
    <div className="mx-auto max-w-xl px-5 py-10">
      <h1 className="font-display text-2xl font-semibold text-ink">Report a Civic Issue</h1>
      <p className="mt-1 text-sm text-ink-soft">Take a photo. We'll handle the rest.</p>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => fileInputRef.current?.click()}
        className={`mt-6 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 text-center transition-colors ${
          dragOver ? "border-civic bg-civic/5" : "border-line bg-white hover:border-civic/40"
        }`}
      >
        {preview ? (
          <img
            src={preview}
            alt="Uploaded issue preview"
            className="mb-4 h-48 w-full max-w-xs rounded-xl object-cover shadow-sm"
          />
        ) : (
          <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-signal/10 text-signal-dark">
            <Camera size={28} />
          </span>
        )}
        <p className="font-display text-sm font-semibold text-ink">
          {preview ? "Photo added — tap to replace" : "Upload Photo or Video"}
        </p>
        <p className="mt-1 flex items-center gap-1.5 text-xs text-ink-soft">
          <ImageUp size={13} />
          Drag & drop or browse
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {location && (
        <div className="mt-4 flex items-center gap-3 rounded-xl border border-line bg-white p-4 animate-pop-in">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-civic/10 text-civic">
            <MapPin size={16} />
          </span>
          <div>
            <p className="text-xs font-medium text-ink-soft">Location detected</p>
            <p className="font-display text-sm font-semibold text-ink">{location.address}</p>
          </div>
        </div>
      )}

      {!location && (
        <button
          onClick={useMyLocation}
          disabled={locating}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-line bg-white py-3 text-sm font-medium text-ink-soft transition-colors hover:border-civic/40 hover:text-civic disabled:opacity-60"
        >
          <MapPin size={15} />
          {locating ? "Locating…" : "Use My Location"}
        </button>
      )}

      <button
        onClick={handleAnalyze}
        disabled={!preview || !location}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-signal py-3.5 text-sm font-semibold text-white shadow-md shadow-signal/25 transition-transform enabled:hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Sparkles size={17} />
        Analyze with AI
      </button>
    </div>
  );
}
