import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole?: UserRole;
  roleKey?: 'authority' | 'field' | 'citizen';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRole,
  roleKey = 'authority',
}) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated || !user) {
    // Redirect to the appropriate role-specific login page
    return <Navigate to={`/login/${roleKey}`} state={{ from: location }} replace />;
  }

  // If role is specified and does not match the authenticated user's role, redirect to the matching portal
  if (allowedRole && user.role !== allowedRole) {
    const roleRoutes: Record<UserRole, string> = {
      Authority: '/authority',
      FieldOfficer: '/field',
      Citizen: '/citizen',
    };
    return <Navigate to={roleRoutes[user.role] || '/'} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
