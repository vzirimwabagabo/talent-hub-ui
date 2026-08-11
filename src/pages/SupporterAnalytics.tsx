import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/badge';
import { Calendar, DollarSign, FileText, Users } from 'lucide-react';
import { getAllEvents } from '@/api/eventApi';
import { getDonations } from '@/api/donationApi';
import { getAllOpportunities } from '@/api/opportunityApi';

interface OpportunityData {
  _id?: string;
  id?: string;
  title?: string;
  category?: string;
  location?: string;
  isActive?: boolean;
  status?: string;
  postedBy?: { _id?: string; id?: string; name?: string } | string;
  createdAt?: string;
}

interface EventData {
  _id?: string;
  id?: string;
  title?: string;
  startDate?: string;
  endDate?: string;
  isVirtual?: boolean;
  location?: string;
  attendees?: Array<{ _id?: string; id?: string; name?: string }>;
}

interface DonationData {
  _id?: string;
  id?: string;
  amount: number;
  description?: string;
  createdAt?: string;
}

export default function SupporterAnalytics() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);

  const [opportunities, setOpportunities] = useState<OpportunityData[]>([]);
  const [events, setEvents] = useState<EventData[]>([]);
  const [donations, setDonations] = useState<DonationData[]>([]);

  useEffect(() => {
    const loadAnalytics = async () => {
      setLoading(true);
      setError(null);
      setWarnings([]);

      const [opportunitiesRes, eventsRes, donationsRes] = await Promise.allSettled([
        getAllOpportunities(),
        getAllEvents(),
        getDonations(),
      ]);

      const nextWarnings: string[] = [];

      if (opportunitiesRes.status === 'fulfilled') {
        setOpportunities(opportunitiesRes.value?.opportunities || []);
      } else {
        nextWarnings.push('Opportunities data is currently unavailable.');
      }

      if (eventsRes.status === 'fulfilled') {
        setEvents(eventsRes.value?.events || []);
      } else {
        nextWarnings.push('Events data is currently unavailable.');
      }

      if (donationsRes.status === 'fulfilled') {
        setDonations(donationsRes.value || []);
      } else {
        nextWarnings.push('Donations data is unavailable for this account or failed to load.');
      }

      setWarnings(nextWarnings);

      if (
        opportunitiesRes.status === 'rejected' &&
        eventsRes.status === 'rejected' &&
        donationsRes.status === 'rejected'
      ) {
        setError('Failed to load supporter analytics. Please try again.');
      }

      setLoading(false);
    };

    loadAnalytics();
  }, []);

  const stats = useMemo(() => {
    const activeOpportunities = opportunities.filter((opp) => opp.isActive !== false && opp.status !== 'closed');
    const totalAttendees = events.reduce((sum, event) => sum + (event.attendees?.length || 0), 0);
    const totalDonationAmount = donations.reduce((sum, donation) => sum + Number(donation.amount || 0), 0);

    const categoryMap: Record<string, number> = {};
    for (const opp of opportunities) {
      const key = opp.category || 'other';
      categoryMap[key] = (categoryMap[key] || 0) + 1;
    }

    return {
      totalOpportunities: opportunities.length,
      activeOpportunities: activeOpportunities.length,
      totalEvents: events.length,
      totalAttendees,
      totalDonations: donations.length,
      totalDonationAmount,
      categoryMap,
    };
  }, [donations, events, opportunities]);

  const recentOpportunities = useMemo(
    () => [...opportunities].sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime()).slice(0, 6),
    [opportunities]
  );

  const upcomingEvents = useMemo(
    () => [...events].filter((event) => event.startDate && new Date(event.startDate) >= new Date()).slice(0, 6),
    [events]
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="py-8 text-muted-foreground">Loading supporter analytics...</CardContent>
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
          <CardTitle>Supporter Analytics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {warnings.map((warning, index) => (
            <p key={index} className="text-sm text-amber-600">{warning}</p>
          ))}
          <p className="text-sm text-muted-foreground">
            Live metrics are computed from opportunities, events, and donations endpoints.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="py-5">
            <p className="text-sm text-muted-foreground">Total Opportunities</p>
            <p className="text-2xl font-bold">{stats.totalOpportunities}</p>
            <p className="text-xs text-muted-foreground mt-1">{stats.activeOpportunities} active</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-5">
            <p className="text-sm text-muted-foreground">Donations Logged</p>
            <p className="text-2xl font-bold">{stats.totalDonations}</p>
            <p className="text-xs text-muted-foreground mt-1">${stats.totalDonationAmount.toLocaleString()} total</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-5">
            <p className="text-sm text-muted-foreground">Events and Reach</p>
            <p className="text-2xl font-bold">{stats.totalEvents}</p>
            <p className="text-xs text-muted-foreground mt-1">{stats.totalAttendees} attendees across events</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Recent Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentOpportunities.length === 0 ? (
              <p className="text-sm text-muted-foreground">No opportunities available.</p>
            ) : (
              <ul className="space-y-3">
                {recentOpportunities.map((opp) => {
                  const id = opp._id || opp.id || `${opp.title}-${opp.createdAt}`;
                  return (
                    <li key={id} className="p-3 border rounded-lg">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-medium">{opp.title || 'Untitled opportunity'}</p>
                          <p className="text-xs text-muted-foreground capitalize">
                            {(opp.category || 'other')} {opp.location ? `• ${opp.location}` : ''}
                          </p>
                        </div>
                        <Badge variant="secondary">{opp.isActive === false || opp.status === 'closed' ? 'Inactive' : 'Active'}</Badge>
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
              <Calendar className="h-5 w-5" />
              Upcoming Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingEvents.length === 0 ? (
              <p className="text-sm text-muted-foreground">No upcoming events found.</p>
            ) : (
              <ul className="space-y-3">
                {upcomingEvents.map((event) => {
                  const id = event._id || event.id || `${event.title}-${event.startDate}`;
                  return (
                    <li key={id} className="p-3 border rounded-lg">
                      <p className="font-medium">{event.title || 'Untitled event'}</p>
                      <p className="text-xs text-muted-foreground">
                        {event.startDate ? new Date(event.startDate).toLocaleDateString() : 'Unknown date'}
                        {event.location ? ` • ${event.location}` : ''}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {event.attendees?.length || 0} attending • {event.isVirtual ? 'Virtual' : 'In-person'}
                      </p>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Opportunity Categories
          </CardTitle>
        </CardHeader>
        <CardContent>
          {Object.keys(stats.categoryMap).length === 0 ? (
            <p className="text-sm text-muted-foreground">No category data available.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(stats.categoryMap).map(([category, count]) => (
                <div key={category} className="p-3 border rounded-lg">
                  <p className="text-xs text-muted-foreground capitalize">{category}</p>
                  <p className="text-xl font-semibold mt-1">{count}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Recent Donations
          </CardTitle>
        </CardHeader>
        <CardContent>
          {donations.length === 0 ? (
            <p className="text-sm text-muted-foreground">No donations found for this account.</p>
          ) : (
            <ul className="space-y-2">
              {donations.slice(0, 5).map((donation) => {
                const id = donation._id || donation.id || `${donation.amount}-${donation.createdAt}`;
                return (
                  <li key={id} className="text-sm text-muted-foreground">
                    ${Number(donation.amount || 0).toLocaleString()} {donation.description ? `• ${donation.description}` : ''}
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
