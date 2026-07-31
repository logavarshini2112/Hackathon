import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';

import LandingPage from '../pages/visitor/LandingPage';
import RoleSelection from '../pages/RoleSelection';

import VisitorLogin from '../pages/visitor/VisitorLogin';
import StaffLogin from '../pages/staff/StaffLogin';
import AdminLogin from '../pages/admin/AdminLogin';

import VisitorDashboard from '../pages/visitor/VisitorDashboard';

/**
 * Dashboard Coming Soon Placeholder Component (Staff & Admin)
 */
function DashboardPlaceholder({ title, badge }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-slate-800 font-sans">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-200 text-center space-y-4">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-100">
          {badge}
        </span>
        <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
        <p className="text-sm text-slate-600">
          Welcome! You have successfully logged in. Dashboard UI is coming soon in the next module.
        </p>
        <button
          onClick={() => navigate('/role-selection')}
          className="inline-block px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-all cursor-pointer shadow-md"
        >
          Back to Role Selection
        </button>
      </div>
    </div>
  );
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Role Selection Page */}
        <Route path="/role-selection" element={<RoleSelection />} />

        {/* Authentication Routes */}
        <Route path="/visitor/login" element={<VisitorLogin />} />
        <Route path="/staff/login" element={<StaffLogin />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Complete Visitor Dashboard */}
        <Route path="/visitor/dashboard" element={<VisitorDashboard />} />

        {/* Staff & Admin Dashboard Placeholders */}
        <Route
          path="/staff/dashboard"
          element={<DashboardPlaceholder title="Staff Dashboard" badge="Staff Portal" />}
        />
        <Route
          path="/admin/dashboard"
          element={<DashboardPlaceholder title="Administrator Dashboard" badge="Admin Controls" />}
        />

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
