import { Bell } from "lucide-react";
import { useApp } from "../context/AppContext.jsx";

export default function ToastHost() {
  const { toasts } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2 sm:top-6 sm:right-6">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="animate-toast-in flex items-start gap-3 rounded-xl border border-line bg-white/95 p-4 shadow-lg shadow-ink/5 backdrop-blur"
        >
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-signal/10 text-signal-dark">
            <Bell size={16} />
          </span>
          <p className="text-sm leading-snug text-ink">{toast.message}</p>
        </div>
      ))}
    </div>
  );
}
