import { useMemo, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { updateUserProfile } from '@/api/userApi';

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const joinedDate = useMemo(() => {
    if (!user?.createdAt) return 'Unknown';
    return new Date(user.createdAt).toLocaleDateString();
  }, [user?.createdAt]);

  const onSave = async () => {
    setError(null);
    setFeedback(null);
    setIsSaving(true);

    const result = await updateUserProfile({
      name: formData.name,
      email: formData.email,
    });

    setIsSaving(false);
    if (!result.success) {
      setError(result.error || 'Failed to update profile.');
      return;
    }

    setFeedback('Profile updated successfully.');
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background p-8 flex justify-center">
        <Card className="w-full max-w-3xl">
          <CardHeader>
            <CardTitle className="text-2xl mb-2">My Profile</CardTitle>
            <CardDescription>Please sign in to view your profile.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8 flex justify-center">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="text-2xl mb-2">My Profile</CardTitle>
          <CardDescription>View and manage your account information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && <div className="text-sm p-3 rounded bg-destructive/10 text-destructive">{error}</div>}
          {feedback && <div className="text-sm p-3 rounded bg-primary/10 text-primary">{feedback}</div>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              disabled={!isEditing}
            />

            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
              disabled={!isEditing}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h3 className="font-semibold mb-1">Role</h3>
              <p className="capitalize">{user.role}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Supporter Type</h3>
              <p className="capitalize">{user.supporterType || 'N/A'}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Joined</h3>
              <p>{joinedDate}</p>
            </div>
          </div>

          <div className="flex gap-3">
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
            ) : (
              <>
                <Button onClick={onSave} disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({ name: user.name || '', email: user.email || '' });
                  }}
                >
                  Cancel
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
