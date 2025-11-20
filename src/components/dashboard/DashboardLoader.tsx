// src/components/dashboard/DashboardLoader.tsx

import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { ParticipantDashboard } from './ParticipantDashboard';
import { SupporterDashboard } from './SupporterDashboard';
import { AdminDashboard } from './AdminDashboard';
import { Card, CardContent } from '@/components/ui/Card';

export const DashboardLoader = () => {
  const { user, loading } = useAuth();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (loading || !isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground">Loading dashboard...</div>
      </div>
    );
  }

  if (!user) {
    return <div>Please log in to view your dashboard.</div>;
  }

  //alert(user.role)

  // Role-based rendering
  switch (user.role) {
    case 'participant':
      return <ParticipantDashboard />;
    case 'supporter':
      return <SupporterDashboard supporterType={user.supporterType} />;
    case 'admin':
      return <AdminDashboard />;
    default:
      return (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">Dashboard not available for your role.</p>
          </CardContent>
        </Card>
      );
  }
};