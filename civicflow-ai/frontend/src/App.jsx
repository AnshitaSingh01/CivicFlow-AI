import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import ToastHost from "./components/ToastHost.jsx";
import Landing from "./pages/Landing.jsx";
import CitizenDashboard from "./pages/CitizenDashboard.jsx";
import ReportIssue from "./pages/ReportIssue.jsx";
import AIAnalysis from "./pages/AIAnalysis.jsx";
import ComplaintSuccess from "./pages/ComplaintSuccess.jsx";
import TrackComplaint from "./pages/TrackComplaint.jsx";
import MyComplaints from "./pages/MyComplaints.jsx";
import Notifications from "./pages/Notifications.jsx";
import OfficerDashboard from "./pages/OfficerDashboard.jsx";
import OfficerComplaints from "./pages/OfficerComplaints.jsx";
import OfficerMap from "./pages/OfficerMap.jsx";

export default function App() {
  return (
    <div className="min-h-screen bg-paper">
      <Navbar />
      <ToastHost />
      <Routes>
        <Route path="/" element={<Landing />} />

        <Route path="/citizen" element={<CitizenDashboard />} />
        <Route path="/citizen/report" element={<ReportIssue />} />
        <Route path="/citizen/analyze" element={<AIAnalysis />} />
        <Route path="/citizen/success/:id" element={<ComplaintSuccess />} />
        <Route path="/citizen/track/:id" element={<TrackComplaint />} />
        <Route path="/citizen/complaints" element={<MyComplaints />} />
        <Route path="/citizen/notifications" element={<Notifications />} />

        <Route path="/officer" element={<OfficerDashboard />} />
        <Route path="/officer/complaints" element={<OfficerComplaints />} />
        <Route path="/officer/map" element={<OfficerMap />} />
        <Route path="/officer/notifications" element={<Notifications />} />
      </Routes>
    </div>
  );
}
