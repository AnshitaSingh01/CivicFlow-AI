const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5050/api";

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }
  return res.json();
}

export const api = {
  getComplaints: () => request("/complaints"),
  getComplaint: (id) => request(`/complaints/${id}`),
  createComplaint: (payload) =>
    request("/complaints", { method: "POST", body: JSON.stringify(payload) }),
  updateStatus: (id, status) =>
    request(`/complaints/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    }),
  analyzeImage: (filename) =>
    request("/ai/analyze", {
      method: "POST",
      body: JSON.stringify({ filename }),
    }),
  getNotifications: () => request("/notifications"),
};

export default api;
