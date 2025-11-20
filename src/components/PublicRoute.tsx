// src/components/PublicRoute.tsx

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ReactNode } from 'react';

interface PublicRouteProps {
  children?: ReactNode;
  redirectPath?: string;
}

const PublicRoute: React.FC<PublicRouteProps> = ({
  children,
  redirectPath = '/dashboard',
}) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
        Loading...
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default PublicRoute;