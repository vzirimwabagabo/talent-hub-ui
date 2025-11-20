// src/pages/admin/Dashboard.tsx

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  DollarSign, 
  MessageCircle, 
  UserCheck, 
  HeartHandshake,
  TrendingUp 
} from 'lucide-react';
import { getAdminAnalytics, getAdminUsers } from '@/api/adminApi';
import { AdminAnalytics, AdminUser } from '@/types/admin';
// comments

const StatCard = ({
  title,
  value,
  icon: Icon,
  color = 'primary'
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color?: 'primary' | 'destructive' | 'accent';
}) => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium flex items-center gap-2">
        <Icon className="h-4 w-4" />
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
);

const UserTable = ({ users }: { users: AdminUser[] }) => (
  <Card>
    <CardHeader>
      <CardTitle>Recent Users</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-muted-foreground border-b">
              <th className="pb-2">Name</th>
              <th className="pb-2">Email</th>
              <th className="pb-2">Role</th>
              <th className="pb-2">Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.slice(0, 5).map(user => (
              <tr key={user.id} className="border-b border-border/30 hover:bg-muted/30">
                <td className="py-3 font-medium">{user.name}</td>
                <td className="py-3 text-sm text-muted-foreground">{user.email}</td>
                <td className="py-3">
                  <Badge variant={user.role === 'admin' ? 'admin' : user.role}>
                    {user.role === 'supporter' ? user.supporterType || 'Supporter' : user.role}
                  </Badge>
                </td>
                <td className="py-3 text-sm text-muted-foreground">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </CardContent>
  </Card>
);

const ProfileList = ({ 
  title, 
  profiles,
  icon: Icon 
}: { 
  title: string; 
  profiles: AdminProfile[];
  icon: React.ElementType;
}) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Icon className="h-4 w-4" />
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        {profiles.length === 0 ? (
          <p className="text-muted-foreground text-sm">No profiles yet</p>
        ) : (
          profiles.map(profile => (
            <div key={profile.id} className="p-3 border rounded-lg bg-muted/30">
              <div className="font-medium">{profile.user.name}</div>
              <div className="text-sm text-muted-foreground mt-1">
                {profile.skills.slice(0, 3).join(', ')}
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                Updated: {new Date(profile.updatedAt).toLocaleDateString()}
              </div>
            </div>
          ))
        )}
      </div>
    </CardContent>
  </Card>
);

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [analyticsRes, usersRes] = await Promise.all([
        getAdminAnalytics(),
        getAdminUsers()
      ]);
      
      if (analyticsRes.success) setAnalytics(analyticsRes.data!);
      if (usersRes.success) setUsers(usersRes.data!);
      
      setLoading(false);
    };
    
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground">Loading admin dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-4 rounded-lg">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Platform overview and user management
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Users"
          value={analytics?.totalUsers || 0}
          icon={Users}
        />
        <StatCard
          title="Total Donations"
          value={`$${(analytics?.totalDonations || 0).toLocaleString()}`}
          icon={DollarSign}
          color="accent"
        />
        <StatCard
          title="Unread Messages"
          value={analytics?.unreadMessages || 0}
          icon={MessageCircle}
          color="destructive"
        />
        <StatCard
          title="Active Talents"
          value={analytics?.mostActiveTalents.length || 0}
          icon={UserCheck}
        />
        <StatCard
          title="Active Volunteers"
          value={analytics?.mostActiveVolunteers.length || 0}
          icon={HeartHandshake}
        />
      </div>

      {/* Data Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UserTable users={users} />
        <ProfileList
          title="Most Active Talents"
          profiles={analytics?.mostActiveTalents || []}
          icon={UserCheck}
        />
        <ProfileList
          title="Most Active Volunteers"
          profiles={analytics?.mostActiveVolunteers || []}
          icon={HeartHandshake}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;