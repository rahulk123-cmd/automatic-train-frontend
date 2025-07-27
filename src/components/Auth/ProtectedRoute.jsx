import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If the user is authenticated but has the wrong role, redirect them to the login page
    // with a specific error message. This helps diagnose role-based access issues.
    const errorMessage = `Access Denied. Your account role is "${user.role || 'not set'}", but this page requires the "${allowedRoles.join(' or ')}" role.`;
    return <Navigate to="/login" state={{ error: errorMessage }} replace />;
  }

  return children;
};

export default ProtectedRoute;
