// src/pages/MatchRequests.tsx

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  getMatchRequestsForTalent, 
  createMatchRequest,
  getMatchRequestsForReview 
} from '@/api/matchRequestApi';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/Card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  FileText,
  Star,
  Send
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { MatchRequest } from '@/types/matchRequest';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'approved': return 'success';
    case 'rejected': return 'destructive';
    case 'pending': return 'warning';
    default: return 'secondary';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'approved': return <CheckCircle className="h-4 w-4" />;
    case 'rejected': return <XCircle className="h-4 w-4" />;
    case 'pending': return <Clock className="h-4 w-4" />;
    default: return <FileText className="h-4 w-4" />;
  }
};

// Talent View
const TalentMatchRequests = () => {
  const [requests, setRequests] = useState<MatchRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const result = await getMatchRequestsForTalent();
      if (result.success) setRequests(result.data || []);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      {requests.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium mb-2">No match requests yet</h3>
            <p className="text-muted-foreground">Apply to opportunities to create match requests.</p>
          </CardContent>
        </Card>
      ) : (
        requests.map(req => (
          <Card key={req.id}>
            <CardHeader>
              <div className="flex justify-between">
                <CardTitle>{req.opportunity.title}</CardTitle>
                <Badge variant={getStatusColor(req.status)}>
                  {getStatusIcon(req.status)}
                  <span className="ml-1">{req.status.charAt(0).toUpperCase() + req.status.slice(1)}</span>
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <span className="font-medium">Match Score:</span>
                  <div className="flex items-center mt-1">
                    <Star className="h-4 w-4 text-primary mr-1" />
                    <span>{Math.round(req.matchScore * 100)}%</span>
                  </div>
                </div>
                {req.message && (
                  <div>
                    <span className="font-medium">Your Note:</span>
                    <p className="mt-1 bg-muted p-2 rounded text-sm">{req.message}</p>
                  </div>
                )}
                <div className="text-sm text-muted-foreground">
                  Applied on: {new Date(req.createdAt).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

// Reviewer View (Supporter/Admin)
const ReviewerMatchRequests = () => {
  const [requests, setRequests] = useState<MatchRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const result = await getMatchRequestsForReview();
      if (result.success) setRequests(result.data || []);
      setLoading(false);
    };
    load();
  }, []);

  const handleUpdateStatus = async (id: string, status: 'approved' | 'rejected') => {
    const result = await updateMatchRequestStatus(id, status);
    if (result.success) {
      setRequests(prev => 
        prev.map(req => req.id === id ? { ...req, status } : req)
      );
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      {requests.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium mb-2">No pending requests</h3>
            <p className="text-muted-foreground">All match requests have been reviewed.</p>
          </CardContent>
        </Card>
      ) : (
        requests
          .filter(req => req.status === 'pending')
          .map(req => (
            <Card key={req.id}>
              <CardHeader>
                <CardTitle>{req.opportunity.title}</CardTitle>
                <div className="text-sm text-muted-foreground">
                  Talent: {req.talent.name} • Match Score: {Math.round(req.matchScore * 100)}%
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {req.message && (
                    <div>
                      <span className="font-medium">Applicant Note:</span>
                      <p className="mt-1 bg-muted p-2 rounded text-sm">{req.message}</p>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button 
                      variant="default" 
                      size="sm"
                      onClick={() => handleUpdateStatus(req.id, 'approved')}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" /> Approve
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleUpdateStatus(req.id, 'rejected')}
                    >
                      <XCircle className="h-4 w-4 mr-1" /> Reject
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
      )}
    </div>
  );
};

const MatchRequests = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Match Requests</h1>
        <p className="text-muted-foreground">
          {user?.role === 'participant' 
            ? 'Track your applications to opportunities' 
            : 'Review talent applications and approve matches'}
        </p>
      </div>

      {user?.role === 'participant' ? (
        <TalentMatchRequests />
      ) : (
        <ReviewerMatchRequests />
      )}
    </div>
  );
};

export default MatchRequests;