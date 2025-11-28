// src/components/dashboard/SupporterDashboard.tsx

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Users, Calendar, FileText, BarChart3 } from 'lucide-react';
import type { SupporterType } from '@/types/auth';
import type { MatchRequest, Donation, Event, Opportunity } from '@/types/dashboard';
import api from '@/api/apiConfig';

interface SupporterDashboardProps {
  supporterType: SupporterType;
}

export const SupporterDashboard = ({ supporterType }: SupporterDashboardProps) => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [matchRequests, setMatchRequests] = useState<MatchRequest[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [oppRes, reqRes, donRes, eventRes] = await Promise.all([
          api.get<{ opportunities: Opportunity[] }>('/opportunity'),
          api.get<{ requests: MatchRequest[] }>('/match/my'),
          supporterType === 'donor' 
            ? api.get<{ donations: Donation[] }>('/donation') 
            : Promise.resolve({ data: { donations: [] } }),
          api.get<{ events: Event[] }>('/event'),
        ]);


        setOpportunities(oppRes.data.data || []);
        setMatchRequests(reqRes.data.requests);
        setDonations(donRes.data.donations);
        setEvents(eventRes.data.events);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      }
    };
    fetchData();
  }, [supporterType]);

  return (
    <div className="space-y-6">
      {/* Role Banner */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-4 rounded-lg">
        <div className="flex items-center">
          <Badge variant="supporter" className="text-lg px-3 py-1">
            {supporterType?.charAt(0).toUpperCase() + supporterType?.slice(1)}
          </Badge>
          <p className="ml-4 text-muted-foreground">
            {supporterType === 'employer' 
              ? 'Manage opportunities and talent matches' 
              : supporterType === 'donor'
                ? 'Track your donations and impact'
                : 'Coordinate volunteer efforts'}
          </p>
        </div>
      </div>
      {/* Analytics Button - Quick Action */}
<Card>
  <CardContent className="p-4">
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h3 className="font-medium">Track your impact</h3>
        <p className="text-sm text-muted-foreground mt-1">
          View analytics on applications, matches, donations, and events.
        </p>
      </div>
      <Button
        variant="outline"
        onClick={() => navigate('/my-analytics')}
      >
        <BarChart3 className="h-4 w-4 mr-2" />
        Go to Analytics
      </Button>
    </div>
  </CardContent>
</Card>

      {/* Posted Opportunities */}
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Your Opportunities ({opportunities?.length || 0})
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button 
            className="mb-4" 
            onClick={() => navigate('/admin/create-opportunity')}
          >
            Post New Opportunity
          </Button>
          <div className="space-y-3">
            {opportunities?.length > 0 && opportunities?.map((opp) => (
              <div key={opp.id} className="p-3 border rounded-lg">
                <div className="flex justify-between">
                  <h3 className="font-medium">{opp.title}</h3>
                  <Badge variant={opp.isActive ? 'default' : 'secondary'}>
                    {opp.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {opp?.category} • Applicants: {matchRequests?.filter(r => r.opportunity.id === opp.id).length}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Match Requests */}
      {matchRequests?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Match Requests ({matchRequests.filter(r => r.status === 'pending').length} pending)
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {matchRequests
                .filter(r => r.status === 'pending')
                .map((request) => (
                  <div key={request.id} className="p-3 border rounded-lg">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-medium">{request.opportunity.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          Match Score: {Math.round(request.matchScore * 100)}%
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">Approve</Button>
                        <Button size="sm" variant="ghost">Reject</Button>
                      </div>
                    </div>
                    {request.message && (
                      <div className="mt-2 text-sm bg-muted p-2 rounded">
                        <strong>Message:</strong> {request.message}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Donations (Donor only) */}
      {supporterType === 'donor' && donations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>
              <div className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                Your Donations
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {donations.map((donation) => (
                <div key={donation.id} className="flex justify-between items-center p-2 border rounded">
                  <div>
                    <span className="font-medium">{donation.amount} {donation.currency}</span>
                    {donation.message && <p className="text-sm text-muted-foreground">{donation.message}</p>}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {new Date(donation.date).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Events */}
      {events?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Upcoming Events
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {events.map((event) => (
                <div key={event.id} className="p-3 border rounded-lg">
                  <h3 className="font-medium">{event.title}</h3>
                  <div className="text-sm text-muted-foreground mt-1">
                    {new Date(event.startDate).toLocaleDateString()} • 
                    {event.isVirtual ? 'Virtual' : event.location}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};