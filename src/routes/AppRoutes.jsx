import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

/**
 * Main Application Routes Configuration
 * 
 * Modular route layout pre-configured for future module extensions:
 * - Visitor Portal (`/`, `/visitor/*`)
 * - Staff Portal (`/staff/*`)
 * - Admin Portal (`/admin/*`)
 */

export const VISITOR_ROUTES = {
  HOME: '/',
  FEEDBACK: '/visitor/feedback',
};

export const STAFF_ROUTES = {
  HOME: '/staff',
};

export const ADMIN_ROUTES = {
  HOME: '/admin',
};

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Visitor Portal Routes Placeholder */}
        <Route
          path="/"
          element={
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-slate-800">
              <div className="max-w-md w-full bg-white rounded-xl shadow-md p-8 border border-slate-100 text-center">
                <h1 className="text-xl font-semibold text-slate-900 mb-2">
                  Digital Visitor Feedback &amp; Experience Management Portal
                </h1>
                <p className="text-sm text-slate-500">
                  Project setup complete. Ready for future page and module development.
                </p>
              </div>
            </div>
          }
        />

        {/* Staff Portal Routes Placeholder */}
        {/* <Route path="/staff/*" element={<StaffRoutes />} /> */}

        {/* Admin Portal Routes Placeholder */}
        {/* <Route path="/admin/*" element={<AdminRoutes />} /> */}

        {/* Fallback Catch-all Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
