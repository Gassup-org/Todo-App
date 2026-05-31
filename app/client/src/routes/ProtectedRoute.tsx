import { Navigate, useLocation } from 'react-router-dom';
import type { PropsWithChildren } from 'react';
import type { UserRole } from '../types/auth';
import { useAuth } from '../providers/AuthProvider';

interface ProtectedRouteProps {
  roles: UserRole[];
}

export function ProtectedRoute({ roles, children }: PropsWithChildren<ProtectedRouteProps>) {
  const auth = useAuth();
  const location = useLocation();

  if (auth.loading) {
    return <div className="screen-center">Loading your secure workspace...</div>;
  }

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (!auth.hasRole(roles)) {
    return <Navigate to="/app/dashboard" replace />;
  }

  return <>{children}</>;
}