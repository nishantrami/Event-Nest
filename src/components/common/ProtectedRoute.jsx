import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login with previous intended path
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Restrict Organizer Dashboard to Admin only
  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/access-denied" state={{ from: location }} replace />;
  }

  return children;
};
