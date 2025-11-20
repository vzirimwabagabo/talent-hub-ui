// src/pages/CreateOpportunity.tsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Briefcase, 
  MapPin, 
  LinkIcon, 
  Calendar, 
  Clock,
  ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { createOpportunity } from '@/api/opportunityApi';
import type { OpportunityCategory } from '@/types/opportunity';

const categoryConfig: Record<OpportunityCategory, { label: string; color: 'default' | 'secondary' | 'accent' | 'destructive' }> = {
  job: { label: 'Job', color: 'default' },
  internship: { label: 'Internship', color: 'secondary' },
  scholarship: { label: 'Scholarship', color: 'accent' },
  grant: { label: 'Grant', color: 'destructive' },
  volunteering: { label: 'Volunteering', color: 'secondary' },
  other: { label: 'Other', color: 'default' },
};

const CreateOpportunity = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'job' as OpportunityCategory,
    location: '',
    applyUrl: '',
    deadline: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Title is required');
      return false;
    }
    if (formData.title.length > 150) {
      setError('Title must be under 150 characters');
      return false;
    }
    if (formData.description.length > 2000) {
      setError('Description must be under 2000 characters');
      return false;
    }
    if (formData.applyUrl && !isValidUrl(formData.applyUrl)) {
      setError('Please enter a valid URL');
      return false;
    }
    return true;
  };

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    const result = await createOpportunity(formData);
    setIsSubmitting(false);

    if (result.success) {
      navigate('/opportunities', { replace: true });
    } else {
      setError(result.error || 'Something went wrong');
    }
  };

  const categoryOptions: OpportunityCategory[] = [
    'job',
    'internship',
    'scholarship',
    'grant',
    'volunteering',
    'other'
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Create New Opportunity</h1>
        <p className="text-muted-foreground">
          Post opportunities for talent to discover and apply to
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Opportunity Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <Input
              label="Opportunity Title"
              labelIcon={<Briefcase className="h-4 w-4" />}
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Software Engineer Intern"
              required
              error={formData.title.length > 150 ? 'Max 150 characters' : ''}
            />

            {/* Category */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Category
              </label>
              <div className="flex flex-wrap gap-2">
                {categoryOptions.map((cat) => (
                  <Button
                    key={cat}
                    type="button"
                    variant={formData.category === cat ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFormData({ ...formData, category: cat })}
                    className="capitalize"
                  >
                    {categoryConfig[cat].label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Description
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the opportunity, requirements, benefits, etc."
                className="min-h-[120px]"
              />
              <p className="text-xs text-muted-foreground text-right">
                {formData.description.length}/2000
              </p>
            </div>

            {/* Location */}
            <Input
              label="Location"
              labelIcon={<MapPin className="h-4 w-4" />}
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g., Kigali, Rwanda or Remote"
            />

            {/* Apply URL */}
            <Input
              label="Application URL"
              labelIcon={<LinkIcon className="h-4 w-4" />}
              type="url"
              value={formData.applyUrl}
              onChange={(e) => setFormData({ ...formData, applyUrl: e.target.value })}
              placeholder="https://example.com/apply"
              endIcon={formData.applyUrl && (
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
              )}
            />

            {/* Deadline */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Deadline (Optional)
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full pl-10 pr-3 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {categoryConfig[formData.category].label}s often have deadlines
              </p>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating Opportunity...' : 'Create Opportunity'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Category Preview */}
      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground mb-2">
          Selected category:
        </p>
        <Badge variant={categoryConfig[formData.category].color}>
          {categoryConfig[formData.category].label}
        </Badge>
      </div>
    </div>
  );
};

export default CreateOpportunity;