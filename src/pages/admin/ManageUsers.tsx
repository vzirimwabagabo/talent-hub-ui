// src/pages/admin/UserManagement.tsx

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  UserCheck, 
  HeartHandshake, 
  Shield, 
  Search,
  Edit3,
  Trash2,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getAdminUsers, updateUser, deleteUser } from '@/api/adminApi';
import type { User, UserRole, SupporterType } from '@/types/user';

const roleConfig: Record<UserRole, { label: string; icon: any; color: string }> = {
  admin: { label: 'Admin', icon: Shield, color: 'bg-destructive/10 text-destructive' },
  participant: { label: 'Participant', icon: UserCheck, color: 'bg-primary/10 text-primary' },
  supporter: { label: 'Supporter', icon: HeartHandshake, color: 'bg-emerald-500/10 text-emerald-500' },
};

const supporterTypeOptions: SupporterType[] = [null, 'employer', 'donor', 'volunteer'];

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole | 'all'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<{ role: UserRole; supporterType: SupporterType }>({ 
    role: 'participant', 
    supporterType: null 
  });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getAdminUsers();
        if (res.success) {
          setUsers(res.data || []);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load users');
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Filter users
  useEffect(() => {
    let result = users;
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(user =>
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term)
      );
    }
    
    if (selectedRole !== 'all') {
      result = result.filter(user => user.role === selectedRole);
    }
    
    setFilteredUsers(result);
  }, [users, searchTerm, selectedRole]);

  const handleEditStart = (user: User) => {
    setEditingId(user.id);
    setEditData({
      role: user.role,
      supporterType: user.supporterType
    });
  };

  const handleSave = async (userId: string) => {
    const result = await updateUser(userId, editData);
    if (result.success) {
      setUsers(prev => 
        prev.map(u => u.id === userId ? { ...u, ...result.data! } : u)
      );
      setActionMessage({ type: 'success', message: 'User updated successfully' });
    } else {
      setActionMessage({ type: 'error', message: result.error || 'Update failed' });
    }
    setEditingId(null);
    setTimeout(() => setActionMessage(null), 3000);
  };

  const handleDelete = async (userId: string) => {
    const result = await deleteUser(userId);
    if (result.success) {
      setUsers(prev => prev.filter(u => u._id !== userId));
      setActionMessage({ type: 'success', message: 'User deleted successfully' });
    } else {
      setActionMessage({ type: 'error', message: result.error || 'Delete failed' });
    }
    setDeleteConfirm(null);
    setTimeout(() => setActionMessage(null), 3000);
  };

  const roleStats = useMemo(() => {
    const stats = { total: users.length, admin: 0, participant: 0, supporter: 0 };
    users.forEach(user => {
      stats[user.role]++;
    });
    return stats;
  }, [users]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground">Loading user management...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-4 rounded-lg">
        <h1 className="text-2xl font-bold">User Management</h1>
        <p className="text-muted-foreground mt-1">
          Manage platform users, roles, and permissions
        </p>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Users className="h-4 w-4" />
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{roleStats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <UserCheck className="h-4 w-4" />
              Participants
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{roleStats.participant}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <HeartHandshake className="h-4 w-4" />
              Supporters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{roleStats.supporter}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Shield className="h-4 w-4" />
              Admins
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{roleStats.admin}</div>
          </CardContent>
        </Card>
      </div>

      {/* Action Message */}
      {actionMessage && (
        <div className={cn(
          "p-3 rounded-lg text-sm flex items-center gap-2",
          actionMessage.type === 'success' 
            ? "bg-primary/10 text-primary" 
            : "bg-destructive/10 text-destructive"
        )}>
          {actionMessage.type === 'success' ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <AlertTriangle className="h-4 w-4" />
          )}
          {actionMessage.message}
        </div>
      )}

      {/* Search & Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Filter by Role</label>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedRole === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedRole('all')}
                >
                  All
                </Button>
                {(['participant', 'supporter', 'admin'] as UserRole[]).map(role => (
                  <Button
                    key={role}
                    variant={selectedRole === role ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedRole(role)}
                    className="capitalize"
                  >
                    {roleConfig[role].label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="text-destructive py-4">{error}</div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No users found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-muted-foreground border-b">
                    <th className="pb-3">Name</th>
                    <th className="pb-3">Email</th>
                    <th className="pb-3">Role</th>
                    <th className="pb-3">Type</th>
                    <th className="pb-3">Joined</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(user => (
                    <tr key={user.id} className="border-b border-border/30 hover:bg-muted/30">
                      <td className="py-4 font-medium">{user.name}</td>
                      <td className="py-4 text-sm text-muted-foreground">{user.email}</td>
                      <td className="py-4">
                        {editingId === user.id ? (
                          <select
                            value={editData.role}
                            onChange={(e) => setEditData({ ...editData, role: e.target.value as UserRole })}
                            className="border rounded px-2 py-1 text-sm"
                          >
                            <option value="participant">Participant</option>
                            <option value="supporter">Supporter</option>
                            <option value="admin">Admin</option>
                          </select>
                        ) : (
                          <Badge className={cn(roleConfig[user.role].color, "capitalize")}>
                            {roleConfig[user.role].label}
                          </Badge>
                        )}
                      </td>
                      <td className="py-4">
                        {user.role === 'supporter' ? (
                          editingId === user.id ? (
                            <select
                              value={editData.supporterType || ''}
                              onChange={(e) => setEditData({ 
                                ...editData, 
                                supporterType: e.target.value || null 
                              })}
                              className="border rounded px-2 py-1 text-sm"
                            >
                              <option value="">None</option>
                              <option value="employer">Employer</option>
                              <option value="donor">Donor</option>
                              <option value="volunteer">Volunteer</option>
                            </select>
                          ) : (
                            <Badge variant="secondary" className="capitalize">
                              {user.supporterType || '—'}
                            </Badge>
                          )
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="py-4 text-sm text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 text-right">
                        {editingId === user.id ? (
                          <div className="flex gap-2 justify-end">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingId(null);
                                setEditData({ role: user.role, supporterType: user.supporterType });
                              }}
                            >
                              Cancel
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleSave(user.id)}
                            >
                              Save
                            </Button>
                          </div>
                        ) : (
                          <div className="flex gap-2 justify-end">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleEditStart(user)}
                            >
                              <Edit3 className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="text-destructive hover:bg-destructive/10"
                              onClick={() => setDeleteConfirm(user._id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="max-w-md p-6">
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="text-xl font-bold text-center mb-2">Confirm Deletion</h3>
            <p className="text-muted-foreground text-center mb-6">
              Are you sure you want to delete this user? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setDeleteConfirm(null)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={() => handleDelete(deleteConfirm)}
              >
                Delete
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default UserManagement;