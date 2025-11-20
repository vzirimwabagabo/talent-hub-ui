// src/components/ProtectedRoute.tsx

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { hasRequiredRole } from '@/utils/auth';
import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children?: ReactNode;
  redirectPath?: string;
  requiredRole?: string | string[]; // e.g., 'admin' or ['admin', 'moderator']
  unauthorizedPath?: string; // where to send if role denied
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectPath = '/login',
  requiredRole,
  unauthorizedPath = '/dashboard', // fallback for role denial
}) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
        Loading...
      </div>
    );
  }

  // Not authenticated → redirect to login
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  // Authenticated but missing required role
  if (!hasRequiredRole(user, requiredRole)) {
    return <Navigate to={unauthorizedPath} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;