import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Bell, Compass, LayoutGrid, MapPin, PlusCircle, ShieldCheck, User } from "lucide-react";
import { useApp } from "../context/AppContext.jsx";

const citizenLinks = [
  { to: "/citizen", label: "Dashboard", icon: LayoutGrid, end: true },
  { to: "/citizen/report", label: "Report Issue", icon: PlusCircle },
  { to: "/citizen/complaints", label: "My Complaints", icon: Compass },
  { to: "/citizen/notifications", label: "Notifications", icon: Bell },
];

const officerLinks = [
  { to: "/officer", label: "Dashboard", icon: LayoutGrid, end: true },
  { to: "/officer/complaints", label: "Complaints", icon: Compass },
  { to: "/officer/map", label: "Map", icon: MapPin },
  { to: "/officer/notifications", label: "Notifications", icon: Bell },
];

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { notifications } = useApp();
  const isOfficer = location.pathname.startsWith("/officer");
  const links = isOfficer ? officerLinks : citizenLinks;
  const unread = notifications.filter((n) => !n.read).length;

  if (location.pathname === "/") return null;

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 font-display text-lg font-semibold tracking-tight text-ink"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-civic text-white">
            <ShieldCheck size={17} />
          </span>
          CivicFlow<span className="text-signal-dark">AI</span>
        </button>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-civic/10 text-civic"
                    : "text-ink-soft hover:bg-paper-dim hover:text-ink"
                }`
              }
            >
              <Icon size={16} />
              {label}
              {label === "Notifications" && unread > 0 && (
                <span className="ml-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-signal text-[10px] font-semibold text-white">
                  {unread}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden rounded-full border border-line p-0.5 sm:flex">
            <button
              onClick={() => navigate("/citizen")}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                !isOfficer ? "bg-civic text-white" : "text-ink-soft hover:text-ink"
              }`}
            >
              Citizen
            </button>
            <button
              onClick={() => navigate("/officer")}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                isOfficer ? "bg-civic text-white" : "text-ink-soft hover:text-ink"
              }`}
            >
              Officer
            </button>
          </div>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-paper-dim text-ink-soft">
            <User size={16} />
          </span>
        </div>
      </div>
    </header>
  );
}
