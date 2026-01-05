import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

/**
 * Interface for the ProtectedRoute props.
 */
interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
}

/**
 * ProtectedRoute component with improved redirect logic to prevent infinite loops.
 * Documentation in English as requested.
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // 1. Handle the loading state to prevent premature redirects
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    );
  }

  // 2. If not logged in, redirect to login page
  // We save the current location to redirect back after login if needed
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Role-Based Access Control (RBAC)
  // If the user is logged in but doesn't have the permission, 
  // DO NOT send them to /login (that causes the loop).
  // Instead, send them to their allowed home page.
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const defaultPath = user.role === 'coder' ? '/dashboard' : '/admin';
    
    // Safety check: if they are already at their default path, don't redirect again
    if (location.pathname === defaultPath) {
      return <Outlet />;
    }

    return <Navigate to={defaultPath} replace />;
  }

  // 4. Authorized: Render the requested route
  return <Outlet />;
};

export default ProtectedRoute;