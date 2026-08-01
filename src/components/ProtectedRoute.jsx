import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * ProtectedRoute component to enforce role-based access control (RBAC).
 * Checks localStorage for authenticated user & token, verifying role against allowedRoles.
 * Redirects unauthorized users to their role-appropriate dashboard.
 */
export default function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem('token');
  const userJson = localStorage.getItem('user');

  if (!token || !userJson) {
    return <Navigate to="/role-selection" replace />;
  }

  let user;
  try {
    user = JSON.parse(userJson);
  } catch (err) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return <Navigate to="/role-selection" replace />;
  }

  const userRole = user?.role;

  // Normalize role matching (support both 'Admin' and 'Administrator')
  const isAllowed = allowedRoles.some((role) => {
    if (role === 'Admin' || role === 'Administrator') {
      return userRole === 'Admin' || userRole === 'Administrator';
    }
    return userRole === role;
  });

  if (!isAllowed) {
    // Redirect user to their correct dashboard based on database role
    if (userRole === 'Visitor') {
      return <Navigate to="/visitor/dashboard" replace />;
    }
    if (userRole === 'Staff') {
      return <Navigate to="/staff/dashboard" replace />;
    }
    if (userRole === 'Administrator' || userRole === 'Admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/role-selection" replace />;
  }

  return children;
}
