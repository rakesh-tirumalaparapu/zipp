import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import CheckerNavbar from "./CheckerNavbar";
import CheckerDashboard from "./CheckerDashboard";
import CheckerApplicationReview from "./CheckerApplicationReview";
import CheckerNotifications from "./CheckerNotifications";
import "./CheckerGlobal.css";

export default function Checker() {
  return (
    <div className="app-shell">
      <CheckerNavbar />
      <div className="container py-3">
        <Routes>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<CheckerDashboard />} />
          <Route path="application/:id" element={<CheckerApplicationReview />} />
          <Route path="notifications" element={<CheckerNotifications />} />
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Routes>
      </div>
    </div>
  );
}