import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import LandingPage from '../pages/visitor/LandingPage';

/**
 * Role Selection Route Placeholder
 * Pre-configured for navigation from Login buttons
 */
function RoleSelectionPlaceholder() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-slate-800">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-200 text-center space-y-4">
        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
          ➔
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Role Selection</h2>
        <p className="text-sm text-slate-600">
          You navigated to <code className="bg-slate-100 px-2 py-1 rounded text-blue-600 font-mono">/role-selection</code>. This route is configured and ready for future Role Selection page implementation.
        </p>
        <button
          onClick={() => navigate('/')}
          className="inline-block px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-all cursor-pointer shadow-md"
        >
          Return to Landing Page
        </button>
      </div>
    </div>
  );
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing Page Route */}
        <Route path="/" element={<LandingPage />} />

        {/* Role Selection Target Route */}
        <Route path="/role-selection" element={<RoleSelectionPlaceholder />} />

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
