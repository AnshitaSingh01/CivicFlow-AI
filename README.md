# CivicFlow AI

**Report. Track. Resolve.**

A one-day hackathon prototype demonstrating the full citizen → AI → department → officer → resolution loop for civic issue reporting.

> Citizens need a simple tool to report civic issues with real-time status updates.

---

## 1. Folder structure

```
civicflow-ai/
├── frontend/                  Vite + React + Tailwind app
│   ├── src/
│   │   ├── pages/             Landing, Report Issue, AI Analysis, Success,
│   │   │                      Track, Citizen/Officer dashboards, etc.
│   │   ├── components/        Navbar, StatusBadge, StatusTimeline,
│   │   │                      ToastHost, OfficerComplaintCard
│   │   ├── context/           AppContext.jsx — shared state + polling
│   │   ├── services/          api.js — REST client for the backend
│   │   └── lib/                status.js — shared status labels/helpers
│   └── .env.example
│
└── backend/                   Express REST API
    ├── src/
    │   ├── server.js
    │   ├── routes/             complaints.js, ai.js, notifications.js
    │   ├── services/           aiService.js — DEMO MODE mock inference
    │   └── data/                store.js — in-memory demo data store
    └── .env.example
```

---

## 2. Installation

From the project root:

```bash
cd backend && npm install
cd ../frontend && npm install
```

---

## 3. Environment variables

**backend/.env** (copy from `.env.example`)
```
PORT=5050
# Optional — leave blank to use the in-memory demo store
MONGO_URI=
```

**frontend/.env** (copy from `.env.example`)
```
VITE_API_URL=http://localhost:5050/api
# Optional — point to a real inference endpoint later
VITE_AI_API_URL=
```

> MongoDB is optional for the prototype. If `MONGO_URI` is not set, the backend automatically falls back to a clearly-marked in-memory demo store (`backend/src/data/store.js`) so the app runs immediately with no database setup.

---

## 4. Start the backend

```bash
cd backend
npm run dev      # nodemon, auto-restarts on changes
# or: npm start
```

Runs on **http://localhost:5050**. Health check: `GET /api/health`.

---

## 5. Start the frontend

```bash
cd frontend
npm run dev
```

Runs on **http://localhost:5173**.

---

## 6. Demo credentials

No authentication in this prototype — citizen and officer views are reached via a role switch in the top navbar (or by visiting `/citizen` and `/officer` directly).

---

## 7. Demo flow

1. Open the app — lands on the CivicFlow AI homepage.
2. Click **Report an Issue**.
3. Upload any photo (drag & drop or browse) — location auto-detects (falls back to a demo location: *XYZ Road, Ward 12*).
4. Click **Analyze with AI** → see the scanning animation ("Analyzing your report…").
5. AI reveals: **Pothole Detected · 94% confidence · HIGH severity**, auto-routed to **Road Department**, Ward 12.
6. Click **Submit Complaint** → success screen shows complaint **#CF1024**.
7. Open the **Officer Dashboard** (role switch, top right).
8. Officer sees the new HIGH-priority pothole complaint.
9. Click **Accept** → status moves to Assigned.
10. Click **Start Work** → status moves to In Progress.
11. Switch back to the citizen **Track Complaint** page (or wait — it polls automatically) → status shows **In Progress**, with a notification: *"Officer has started working on your complaint."*
12. Back on the Officer Dashboard, click **Mark Resolved**.
13. Citizen tracking page updates to **Resolved**, with a toast: *"Your civic issue has been resolved."*

The citizen and officer views stay in sync through the shared backend — the citizen dashboard polls every 4 seconds, which is enough to feel real-time in a live demo. The polling layer is isolated in `AppContext.jsx` so it can be swapped for Socket.IO events (`complaintCreated`, `complaintAssigned`, `complaintStatusUpdated`, `complaintResolved`) without touching any page component.

---

## 8. Features completed

- Full citizen journey: upload → AI detection (DEMO MODE) → auto department routing → complaint creation → tracking
- Automatic department routing (pothole/damaged_road → Road Dept, garbage/illegal_dumping → Municipal Corporation, broken_streetlight → Electricity Dept, water_leakage/drainage → Water Dept)
- Officer dashboard with Accept → Start Work → Mark Resolved flow
- Live-feeling status sync between officer and citizen views (polling, Socket.IO-ready)
- Toast notification system + in-app notifications page
- Vertical status timeline (Reported → AI Verified → Assigned → In Progress → Resolved)
- Loading skeletons, empty states, disabled-while-submitting buttons, drag-and-drop upload, geolocation with demo fallback
- REST backend with in-memory demo fallback (no DB setup required to run)
- Modular, clearly-labeled mock AI service, structured so a real model can be plugged in via `VITE_AI_API_URL` with no other code changes

## 9. Planned for the next 5 days

- Real computer-vision model behind `aiService.js` (currently DEMO MODE)
- MongoDB persistence (schema is already shaped for it in `store.js`)
- Socket.IO for true real-time push instead of polling
- Duplicate-report detection for the same location/issue
- Officer map view with real geolocation pins (placeholder page exists)
- Basic authentication for citizens and officers
- Admin panel for department and routing management
- Push/email notifications
- Analytics dashboard (resolution time, department load, ward heatmaps)
