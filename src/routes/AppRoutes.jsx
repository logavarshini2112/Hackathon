import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import LandingPage from '../pages/visitor/LandingPage';
import RoleSelection from '../pages/RoleSelection';

import VisitorLogin from '../pages/visitor/VisitorLogin';
import StaffLogin from '../pages/staff/StaffLogin';
import AdminLogin from '../pages/admin/AdminLogin';

import VisitorDashboard from '../pages/visitor/VisitorDashboard';
import StaffDashboard from '../pages/staff/StaffDashboard';
import AdminDashboard from '../pages/admin/AdminDashboard';

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

        {/* Complete System Dashboards */}
        <Route path="/visitor/dashboard" element={<VisitorDashboard />} />
        <Route path="/staff/dashboard" element={<StaffDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
