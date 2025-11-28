// src/pages/MyAnalytics.tsx
import { useAuth } from '@/contexts/AuthContext';
import UserAnalytics from '@/pages/ParticipantAnalytics'; // your TestDashboard renamed
import SupporterAnalytics from '@/pages/SupporterAnalytics';

export default function MyAnalytics() {
  const { user } = useAuth();

  if (!user) {
    return <div>Loading...</div>;
  }

  if (user?.role === 'supporter') {
    return <SupporterAnalytics />;
  }

  // Default: participant (you could also handle admin if needed)
  return <UserAnalytics />;
}