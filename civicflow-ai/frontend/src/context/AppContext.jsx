import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import api from "../services/api.js";

const AppContext = createContext(null);

const POLL_INTERVAL_MS = 4000;

export function AppProvider({ children }) {
  const [complaints, setComplaints] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [draft, setDraft] = useState(null); // { photo, location, ward, analysis }
  const [loading, setLoading] = useState(true);
  const knownNotificationIds = useRef(new Set());

  const refreshComplaints = useCallback(async () => {
    try {
      const { complaints: list } = await api.getComplaints();
      setComplaints(list);
    } catch (err) {
      console.error("Failed to load complaints", err);
    }
  }, []);

  const refreshNotifications = useCallback(async () => {
    try {
      const { notifications: list } = await api.getNotifications();
      const fresh = list.filter((n) => !knownNotificationIds.current.has(n.id));
      fresh.forEach((n) => {
        knownNotificationIds.current.add(n.id);
      });
      // Only toast for notifications that arrive after the first load.
      if (knownNotificationIds.current.size > 0 && !loading) {
        fresh.forEach((n) => pushToast(n.message));
      }
      setNotifications(list);
    } catch (err) {
      console.error("Failed to load notifications", err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  const pushToast = useCallback((message) => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  useEffect(() => {
    (async () => {
      await refreshComplaints();
      const { notifications: list } = await api.getNotifications().catch(() => ({ notifications: [] }));
      list.forEach((n) => knownNotificationIds.current.add(n.id));
      setNotifications(list);
      setLoading(false);
    })();
  }, [refreshComplaints]);

  // Poll — simulates real-time updates (Socket.IO-ready: swap this
  // effect for socket listeners on complaintStatusUpdated etc.)
  useEffect(() => {
    const interval = setInterval(() => {
      refreshComplaints();
      refreshNotifications();
    }, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [refreshComplaints, refreshNotifications]);

  const updateStatus = useCallback(
    async (id, status) => {
      const { complaint } = await api.updateStatus(id, status);
      setComplaints((prev) => prev.map((c) => (c.id === id ? complaint : c)));
      await refreshNotifications();
      return complaint;
    },
    [refreshNotifications]
  );

  const submitComplaint = useCallback(
    async (payload) => {
      const { complaint } = await api.createComplaint(payload);
      setComplaints((prev) => [complaint, ...prev]);
      return complaint;
    },
    []
  );

  const value = {
    complaints,
    notifications,
    toasts,
    pushToast,
    draft,
    setDraft,
    loading,
    updateStatus,
    submitComplaint,
    refreshComplaints,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
