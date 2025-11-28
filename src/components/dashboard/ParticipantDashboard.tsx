// src/components/dashboard/ParticipantDashboard.ts
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock, CheckCircle, AlertCircle, ExternalLink, Bookmark, BarChart3 } from 'lucide-react';
import api from '@/api/apiConfig';
import type { MatchRequest, TalentProfile, Opportunity, BookmarkItem } from '@/types/dashboard';

export const ParticipantDashboard = () => {
  const [profile, setProfile] = useState<TalentProfile | null>(null);
  const [applications, setApplications] = useState<MatchRequest[]>([]);
  const [recommended, setRecommended] = useState<Opportunity[]>([]);
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, appsRes, recRes, bookmarksRes] = await Promise.all([
          api.get<{ profile: TalentProfile }>('/talent/profile'),
          api.get<{ requests: MatchRequest[] }>('/match-requests'),
          api.get<{ opportunities: Opportunity[] }>('/opportunities/recommended'),
          api.get<{ bookmarks: BookmarkItem[] }>('/bookmarks'),
        ]);
        setProfile(profileRes.data.profile);
        setApplications(appsRes.data.requests);
        setRecommended(recRes.data.opportunities);
        setBookmarks(bookmarksRes.data.bookmarks);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      }
    };
    fetchData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'primary';
      case 'rejected': return 'destructive';
      case 'pending': return 'warning';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Completion */}
      {profile && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Your Profile</span>
              <Badge variant="participant">Participant</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Completion: {profile.profileCompletion}%</span>
                  <span>{profile.experienceLevel}</span>
                </div>
                <Progress value={profile.profileCompletion} className="h-2" />
              </div>
              {/* 👇 Updated button group */}
              <div className="flex gap-2">
                <Button size="sm" onClick={() => navigate('/profile')}>
                  Complete Profile
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate('/my-analytics')}
                >
                  <BarChart3 className="h-3 w-3 mr-1" />
                  Recommended
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Applications */}
      <Card>
        <CardHeader>
          <CardTitle>Your Applications ({applications.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {applications.length === 0 ? (
            <p className="text-muted-foreground">You haven't applied to any opportunities yet.</p>
          ) : (
            <div className="space-y-3">
              {applications.map((app) => (
                <div 
                  key={app.id} 
                  className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => navigate(`/opportunities/${app.opportunity.id}`)}
                >
                  <div className="flex justify-between">
                    <h3 className="font-medium">{app.opportunity.title}</h3>
                    <Badge variant={getStatusColor(app.status)}>
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {app.opportunity.category} • Match Score: {Math.round(app.matchScore * 100)}%
                  </div>
                  {app.message && (
                    <div className="text-sm mt-2 bg-muted p-2 rounded">
                      <strong>Your note:</strong> {app.message}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recommended Opportunities */}
       <Card>
        <CardHeader>
          <CardTitle>Recommended Opportunities</CardTitle>
        </CardHeader>
        <CardContent>
          {recommended.length === 0 ? (
            <p className="text-muted-foreground">No opportunities match your profile yet.</p>
          ) : (
            <div className="grid gap-4">
              {recommended.map((opp) => (
                <div 
                  key={opp.id}
                  className="p-4 border rounded-lg hover:shadow-medium transition-shadow cursor-pointer"
                  onClick={() => navigate(`/opportunities/${opp.id}`)}
                >
                  <div className="flex justify-between">
                    <h3 className="font-semibold">{opp.title}</h3>
                    <Badge variant="secondary">{opp.category}</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {opp.location || 'Remote'} • 
                    {opp.deadline && (
                      <span className="ml-2 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        Deadline: {new Date(opp.deadline).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          <Button className="mt-4 w-full" onClick={() => navigate('/opportunities')}>
            View All Opportunities
          </Button>
        </CardContent>
      </Card>

      {/* Bookmarks */}
      {bookmarks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Bookmarks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {bookmarks.map((item) => (
                <div key={item.id} className="flex items-center p-2 bg-muted rounded">
                  <Bookmark className="h-4 w-4 mr-2 text-primary" />
                  <span className="text-sm truncate">{item.title}</span>
                  <ExternalLink className="h-3 w-3 ml-auto text-muted-foreground" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};