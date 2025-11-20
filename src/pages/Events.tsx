// src/pages/Events.tsx

import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  MapPin,
  Users,
  Video,
  Building,
  Clock,
  CheckCircle,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getAllEvents, eventRegister } from '@/api/eventApi';
import type { Event } from '@/types/event';

const Events = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [triggerReload, setTriggerReload] = useState(true)
  const navigate = useNavigate();

  // Event status helper
  const getEventStatus = (event: Event) => {
    const now = new Date();
    const start = new Date(event.startDate);
    const end = new Date(event.endDate);
    
    if (now < start) return 'upcoming';
    if (now >= start && now <= end) return 'live';
    return 'past';
  };

  // Sort events: live → upcoming → past
  const sortedEvents = useMemo(() => {
    const statusOrder = { live: 0, upcoming: 1, past: 2 };
    return [...events].sort((a, b) => {
      const statusA = getEventStatus(a);
      const statusB = getEventStatus(b);
      return statusOrder[statusA] - statusOrder[statusB] || 
             new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
    });
  }, [events ]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await getAllEvents();
        if (res.success) {
          setEvents(res.events || []);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load events');
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const isAttending = (event: Event) => {
    return event.attendees.some(attendee => attendee._id === user?.id);
  };

const handleRegister = async (eventId: string) => {
  if (!user) {
    navigate('/login');
    return;
  }

  try {
    const response = await eventRegister(eventId);
    if (response.success) {
      // Find the event that the user registered for
      setEvents((prevEvents) =>
        prevEvents.map((evt) => {
          if ((evt._id || evt.id) === eventId) {
            // Avoid duplicate attendees
            const alreadyAttending = evt.attendees.some(
              (attendee) => attendee._id === user.id || attendee.id === user.id
            );
            if (!alreadyAttending) {
              return {
                ...evt,
                attendees: [...evt.attendees, { _id: user.id, name: user.name }],
              };
            }
          }
          return evt;
        })
      );
    } else {
      alert(response.error || "Failed to register for event");
    }
  } catch (error) {
    alert("Failed to register for event");
    console.error(error);
  }
};


  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Upcoming <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Events</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Join workshops, networking sessions, and community gatherings
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="p-6">
                  <div className="h-48 bg-muted rounded-lg mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-6 bg-muted rounded w-3/4"></div>
                    <div className="h-4 bg-muted rounded w-full"></div>
                    <div className="h-4 bg-muted rounded w-5/6"></div>
                    <div className="flex gap-2 mt-4">
                      <div className="h-8 bg-muted rounded w-20"></div>
                      <div className="h-8 bg-muted rounded w-24"></div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted py-16">
      {/* Hero Section */}
      <div className="container mx-auto px-4 mb-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
            <Calendar className="h-5 w-5" />
            <span className="font-medium">Join our community events</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Upcoming <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Events</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Connect, learn, and grow with TalentHub's vibrant community through workshops, networking, and volunteer opportunities.
          </p>
        </div>
      </div>

      {/* Events Grid */}
      <div className="container mx-auto px-4 pb-20">
        {error ? (
          <div className="max-w-2xl mx-auto text-center py-12">
            <AlertTriangle className="h-16 w-16 text-destructive mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-destructive mb-2">Failed to Load Events</h3>
            <p className="text-muted-foreground">{error}</p>
          </div>
        ) : sortedEvents.length === 0 ? (
          <div className="max-w-2xl mx-auto text-center py-16">
            <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">No Events Scheduled</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Check back soon — we're always adding new events to help you connect and grow.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedEvents.map(event => {
              const status = getEventStatus(event);
              const isUserAttending = isAttending(event);
              const start = new Date(event.startDate);
              const end = new Date(event.endDate);
              const isSameDay = start.toDateString() === end.toDateString();

              return (
                <Link key={event.id} to={`/events/${event.id}`} className="block">
                  <Card
                    className={cn(
                      "group overflow-hidden border border-border/50 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1",
                      "bg-gradient-to-br from-card to-muted/30 backdrop-blur-sm",
                      status === 'live' && "ring-2 ring-primary/30",
                      status === 'past' && "opacity-80"
                    )}
                  >
                    <div className="p-6">
                      {/* Status Badge */}
                      <div className="flex justify-between items-start mb-4">
                        <Badge 
                          variant={status === 'live' ? 'default' : status === 'upcoming' ? 'secondary' : 'outline'}
                          className={cn(
                            "text-xs font-medium px-2.5 py-1",
                            status === 'live' && "animate-pulse"
                          )}
                        >
                          {status === 'live' ? (
                            <span className="flex items-center gap-1">
                              <CheckCircle className="h-3 w-3" /> Live
                            </span>
                          ) : status === 'upcoming' ? 'Upcoming' : 'Past'}
                        </Badge>
                        
                        <Badge 
                          variant={event.isVirtual ? 'accent' : 'secondary'}
                          className="text-xs font-medium px-2.5 py-1 capitalize"
                        >
                          {event.isVirtual ? 'Virtual' : 'In-Person'}
                        </Badge>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                        {event.title}
                      </h3>

                      {/* Description */}
                      <p className="text-muted-foreground mb-4 line-clamp-2">
                        {event?.description}
                      </p>

                      {/* Organizer */}
                      <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
                        <Building className="h-4 w-4" />
                        <span>By {event?.organizer?.name}</span>
                      </div>

                      {/* Date & Location */}
                      <div className="space-y-3 mb-5">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {start.toLocaleDateString('en-US', { 
                              weekday: 'short', 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                            {isSameDay ? '' : ` – ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
                            {', '}
                            {start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            {!isSameDay && ` – ${end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                          </span>
                        </div>
                        
                        {event.location && !event.isVirtual && (
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>{event.location}</span>
                          </div>
                        )}
                      </div>

                      {/* Footer */}
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span>{event.attendees.length} attending</span>
                        </div>
                        
                        <Button
                          size="sm"
                          variant={isUserAttending ? "secondary" : status === "past" ? "outline" : "default"}
                          disabled={status === "past"}
                          className="h-8 px-3"
                          onClick={(e) => {
                            e.preventDefault();
                            if (status !== 'past') {
                              handleRegister(event._id);
                            }
                          }}
                        >
                          {status === 'past' ? 'Event Ended' : 
                           isUserAttending ? 'Registered' : 'Register'}
                        </Button>
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}

        {/* CTA */}
       {
        user.role !== "participant" && (
           <div className="text-center mt-20">
          <Card className="inline-block p-6 border-border/30 bg-card/70 backdrop-blur">
            <Building className="h-10 w-10 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Host an Event?</h3>
            <p className="text-muted-foreground mb-4 max-w-md">
              Are you an organization or community leader? Share your event with our talent community.
            </p>
            <Button size="lg" onClick={() => navigate('/events/create')}>
              Create Event
            </Button>
          </Card>
        </div>
        )
       }
      </div>
    </div>
  );
};

export default Events;