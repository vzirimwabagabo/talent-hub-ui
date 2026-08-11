import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { BarChart3, Bookmark, Briefcase, CheckCircle, Clock, XCircle } from 'lucide-react';
import api from '@/api/apiConfig';
import { getAllOpportunities } from '@/api/opportunityApi';

type MatchStatus = 'pending' | 'approved' | 'rejected' | 'fulfilled';

interface TalentProfileData {
  bio?: { en?: string };
  skills?: string[];
  experienceLevel?: string;
  availability?: string;
}

interface MatchRequestData {
  _id?: string;
  id?: string;
  status?: MatchStatus;
  matchScore?: number;
  message?: string;
  createdAt?: string;
  opportunity?: {
    title?: string;
    category?: string;
    deadline?: string;
  };
}

interface BookmarkData {
  _id?: string;
  id?: string;
  itemType?: string;
  itemId?: {
    title?: string;
    category?: string;
  };
}

interface OpportunityData {
  _id?: string;
  id?: string;
  title?: string;
  category?: string;
  location?: string;
  isActive?: boolean;
  status?: string;
  deadline?: string;
}

export default function ParticipantAnalytics() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);

  const [profile, setProfile] = useState<TalentProfileData | null>(null);
  const [matchRequests, setMatchRequests] = useState<MatchRequestData[]>([]);
  const [bookmarks, setBookmarks] = useState<BookmarkData[]>([]);
  const [opportunities, setOpportunities] = useState<OpportunityData[]>([]);

  useEffect(() => {
    const loadAnalytics = async () => {
      setLoading(true);
      setError(null);
      setWarnings([]);

      const [profileRes, matchRes, bookmarkRes, opportunitiesRes] = await Promise.allSettled([
        api.get('/talent/profile'),
        api.get('/match/my'),
        api.get('/bookmark'),
        getAllOpportunities(),
      ]);

      const nextWarnings: string[] = [];

      if (profileRes.status === 'fulfilled') {
        setProfile(profileRes.value.data?.data || null);
      } else {
        nextWarnings.push('Profile analytics are partially unavailable.');
      }

      if (matchRes.status === 'fulfilled') {
        setMatchRequests(matchRes.value.data?.data || []);
      } else {
        nextWarnings.push('Application analytics are currently unavailable.');
      }

      if (bookmarkRes.status === 'fulfilled') {
        setBookmarks(bookmarkRes.value.data?.data || []);
      } else {
        nextWarnings.push('Bookmarks could not be loaded.');
      }

      if (opportunitiesRes.status === 'fulfilled') {
        setOpportunities(opportunitiesRes.value?.opportunities || []);
      } else {
        nextWarnings.push('Recommended opportunities could not be loaded.');
      }

      setWarnings(nextWarnings);

      if (
        profileRes.status === 'rejected' &&
        matchRes.status === 'rejected' &&
        bookmarkRes.status === 'rejected' &&
        opportunitiesRes.status === 'rejected'
      ) {
        setError('Failed to load analytics data. Please try again.');
      }

      setLoading(false);
    };

    loadAnalytics();
  }, []);

  const stats = useMemo(() => {
    const totalApplications = matchRequests.length;
    const approved = matchRequests.filter((item) => item.status === 'approved' || item.status === 'fulfilled').length;
    const pending = matchRequests.filter((item) => item.status === 'pending').length;
    const rejected = matchRequests.filter((item) => item.status === 'rejected').length;
    const averageMatchScore = totalApplications
      ? Math.round(
          (matchRequests.reduce((sum, item) => sum + Number(item.matchScore || 0), 0) / totalApplications) * 100
        )
      : 0;

    const completionChecks = [
      Boolean(profile?.bio?.en),
      Boolean(profile?.skills?.length),
      Boolean(profile?.experienceLevel),
      Boolean(profile?.availability),
    ];
    const profileCompletion = Math.round(
      (completionChecks.filter(Boolean).length / completionChecks.length) * 100
    );

    const recommended = opportunities
      .filter((opp) => opp.isActive !== false && opp.status !== 'closed')
      .slice(0, 6);

    return {
      totalApplications,
      approved,
      pending,
      rejected,
      averageMatchScore,
      profileCompletion,
      recommended,
      bookmarksCount: bookmarks.length,
    };
  }, [bookmarks.length, matchRequests, opportunities, profile]);

  const recentApplications = useMemo(
    () => [...matchRequests].sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime()).slice(0, 5),
    [matchRequests]
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="py-8 text-muted-foreground">Loading participant analytics...</CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="py-8 text-destructive">{error}</CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Participant Analytics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {warnings.map((warning, index) => (
            <p key={index} className="text-sm text-amber-600">{warning}</p>
          ))}
          <div>
            <p className="text-sm text-muted-foreground mb-2">Profile Completion</p>
            <Progress value={stats.profileCompletion} />
            <p className="text-xs text-muted-foreground mt-2">{stats.profileCompletion}% complete</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="py-5">
            <p className="text-sm text-muted-foreground">Applications</p>
            <p className="text-2xl font-bold">{stats.totalApplications}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-5">
            <p className="text-sm text-muted-foreground">Approved</p>
            <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-5">
            <p className="text-sm text-muted-foreground">Pending</p>
            <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-5">
            <p className="text-sm text-muted-foreground">Bookmarks</p>
            <p className="text-2xl font-bold">{stats.bookmarksCount}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
          </CardHeader>
          <CardContent>
            {recentApplications.length === 0 ? (
              <p className="text-sm text-muted-foreground">No applications yet.</p>
            ) : (
              <ul className="space-y-3">
                {recentApplications.map((application) => {
                  const status = application.status || 'pending';
                  const id = application._id || application.id || `${application.opportunity?.title}-${application.createdAt}`;
                  return (
                    <li key={id} className="p-3 border rounded-lg">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-medium">{application.opportunity?.title || 'Untitled opportunity'}</p>
                          <p className="text-xs text-muted-foreground capitalize">{application.opportunity?.category || 'other'}</p>
                          {application.message && <p className="text-xs text-muted-foreground mt-1">{application.message}</p>}
                        </div>
                        <Badge variant="secondary" className="capitalize">
                          {status === 'approved' || status === 'fulfilled' ? (
                            <span className="flex items-center gap-1"><CheckCircle className="h-3 w-3" /> {status}</span>
                          ) : status === 'rejected' ? (
                            <span className="flex items-center gap-1"><XCircle className="h-3 w-3" /> {status}</span>
                          ) : (
                            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {status}</span>
                          )}
                        </Badge>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Recommended Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.recommended.length === 0 ? (
              <p className="text-sm text-muted-foreground">No recommendations available yet.</p>
            ) : (
              <ul className="space-y-3">
                {stats.recommended.map((opp) => {
                  const id = opp._id || opp.id || `${opp.title}-${opp.deadline}`;
                  return (
                    <li key={id} className="p-3 border rounded-lg">
                      <p className="font-medium">{opp.title || 'Untitled opportunity'}</p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {(opp.category || 'other')} {opp.location ? `• ${opp.location}` : ''}
                      </p>
                      {opp.deadline && (
                        <p className="text-xs text-muted-foreground mt-1">Deadline: {new Date(opp.deadline).toLocaleDateString()}</p>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
            <div className="mt-4">
              <Button variant="outline" className="w-full">Explore More</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bookmark className="h-5 w-5" />
            Bookmarks Snapshot
          </CardTitle>
        </CardHeader>
        <CardContent>
          {bookmarks.length === 0 ? (
            <p className="text-sm text-muted-foreground">No bookmarks saved yet.</p>
          ) : (
            <ul className="space-y-2">
              {bookmarks.slice(0, 5).map((bookmark) => {
                const id = bookmark._id || bookmark.id || `${bookmark.itemType}-${bookmark.itemId?.title}`;
                return (
                  <li key={id} className="text-sm text-muted-foreground">
                    {(bookmark.itemType || 'Item')}: {bookmark.itemId?.title || 'Untitled'}
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="py-5">
          <p className="text-sm text-muted-foreground">Average match score from your applications</p>
          <p className="text-xl font-semibold mt-1">{stats.averageMatchScore}%</p>
        </CardContent>
      </Card>
    </div>
  );
}
