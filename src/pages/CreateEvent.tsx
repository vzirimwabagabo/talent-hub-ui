// src/pages/CreateEvent.tsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
//

import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  MapPin,
  Video,
  Users,
  Building,
  AlertTriangle,
  Save,
  X,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { createEvent } from '@/api/eventApi';
import type { CreateEventData } from '@/types/event';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/button';

const CreateEvent = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<CreateEventData>({
    title: '',
    description: '',
    startDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16), // tomorrow at current time
    endDate: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString().slice(0, 16),   // day after tomorrow
    isVirtual: false,
    location: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Event title is required');
      return false;
    }
    if (formData.title.length > 150) {
      setError('Title must be under 150 characters');
      return false;
    }
    if (formData.description.length > 1000) {
      setError('Description must be under 1000 characters');
      return false;
    }
    if (!formData.isVirtual && !formData.location?.trim()) {
      setError('Location is required for in-person events');
      return false;
    }
    if (new Date(formData.endDate) <= new Date(formData.startDate)) {
      setError('End date must be after start date');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    const result = await createEvent(formData);
    setIsSubmitting(false);

    if (result.success) {
      navigate('/events', { replace: true });
    } else {
      setError(result.error || 'Something went wrong');
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Create New Event</h1>
        <p className="text-muted-foreground">
          Host workshops, networking sessions, or community gatherings
        </p>
      </div>

      <Card className="shadow-large border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Event Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-destructive/10 text-destructive rounded-lg text-sm flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <Input
              label="Event Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Talent Networking Night"
              required
              error={formData.title.length > 150 ? 'Max 150 characters' : ''}
            />

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your event, agenda, and what attendees can expect..."
                className="min-h-[120px]"
              />
              <p className="text-xs text-muted-foreground text-right">
                {formData.description.length}/1000
              </p>
            </div>

            {/* Virtual Toggle */}
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div>
                <label className="font-medium">Virtual Event</label>
                <p className="text-sm text-muted-foreground">
                  {formData.isVirtual 
                    ? 'Event will be hosted online' 
                    : 'Event will be held at a physical location'}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isVirtual}
                  onChange={(e) => setFormData({ ...formData, isVirtual: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-background after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            {/* Location (Conditional) */}
            {!formData.isVirtual && (
              <Input
                label="Location"
                value={formData.location || ''}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., Kigali Innovation City, Room 204"
                required
                startIcon={<MapPin className="h-4 w-4" />}
              />
            )}

            {/* Date & Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4" />
                  Start Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full pl-3 pr-3 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4" />
                  End Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  min={formData.startDate}
                  className="w-full pl-3 pr-3 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth"
                />
              </div>
            </div>

            {/* Organizer Info */}
            {user && (
              <div className="p-4 bg-muted/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Building className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground capitalize">
                      {user.role === 'supporter' ? user.supporterType : user.role}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Create Event
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/events')}
                disabled={isSubmitting}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateEvent;