// src/pages/EditOpportunity.tsx

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Briefcase,
  MapPin,
  LinkIcon,
  Calendar,
  ExternalLink,
  Loader2,
  AlertTriangle,
  Save,
  X,
  CheckCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getOpportunityDetails, updateOpportunity } from '@/api/opportunityApi';
import type { Opportunity, OpportunityCategory } from '@/types/opportunity';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/button';

const categoryConfig: Record<OpportunityCategory, { label: string; color: string }> = {
  job: { label: 'Job', color: 'bg-blue-500/10 text-blue-500' },
  internship: { label: 'Internship', color: 'bg-emerald-500/10 text-emerald-500' },
  scholarship: { label: 'Scholarship', color: 'bg-purple-500/10 text-purple-500' },
  grant: { label: 'Grant', color: 'bg-rose-500/10 text-rose-500' },
  volunteering: { label: 'Volunteering', color: 'bg-orange-500/10 text-orange-500' },
  other: { label: 'Other', color: 'bg-muted text-muted-foreground' },
};

const EditOpportunity = () => {
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState<Partial<Opportunity>>({
    title: '',
    description: '',
    category: 'job',
    location: '',
    applyUrl: '',
    deadline: '',
    isActive: true,
  });
  const [originalData, setOriginalData] = useState<Opportunity | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  //

  useEffect(() => {
    const fetchOpportunity = async () => {
      if (!id) return;
      try {
        const res = await getOpportunityDetails(id);
        if (res.success) {
          const opp = res.opportunity;
          setFormData({
            title: opp.title,
            description: opp.description,
            category: opp.category,
            location: opp.location || '',
            applyUrl: opp.applyUrl || '',
            deadline: opp.deadline ? new Date(opp.deadline).toISOString().split('T')[0] : '',
            isActive: opp.isActive,
          });
          setOriginalData(opp);
        }
      } catch (err: any) {
        setError('Failed to load opportunity');
      } finally {
        setIsLoading(false);
      }
    };
    fetchOpportunity();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !originalData) return;

    // Basic validation
    if (!formData.title?.trim()) {
      setError('Title is required');
      return;
    }
    if (formData.applyUrl && !isValidUrl(formData.applyUrl)) {
      setError('Please enter a valid URL');
      return;
    }

    setIsSubmitting(true);
    const result = await updateOpportunity(id, formData);
    setIsSubmitting(false);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => navigate('/opportunities'), 1500);
    } else {
      setError(result.error || 'Failed to update');
    }
  };

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const isDirty = JSON.stringify(formData) !== JSON.stringify({
    title: originalData?.title,
    description: originalData?.description,
    category: originalData?.category,
    location: originalData?.location || '',
    applyUrl: originalData?.applyUrl || '',
    deadline: originalData?.deadline ? new Date(originalData.deadline).toISOString().split('T')[0] : '',
    isActive: originalData?.isActive,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading opportunity...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Edit Opportunity</h1>
          <p className="text-muted-foreground">Update opportunity details</p>
        </div>
        <Badge className={cn(categoryConfig[formData.category as OpportunityCategory]?.color)}>
          {categoryConfig[formData.category as OpportunityCategory]?.label}
        </Badge>
      </div>

      <Card className="shadow-large border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Opportunity Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-destructive/10 text-destructive rounded-lg text-sm flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-primary/10 text-primary rounded-lg text-sm flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Opportunity updated successfully!
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <Input
              label="Title"
              name="title"
              value={formData.title || ''}
              onChange={handleChange}
              required
              placeholder="e.g., Senior Software Engineer"
            />

            {/* Category */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Category</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {Object.entries(categoryConfig).map(([key, config]) => (
                  <Button
                    key={key}
                    type="button"
                    variant={formData.category === key ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFormData({ ...formData, category: key as OpportunityCategory })}
                    className="justify-start capitalize"
                  >
                    {config.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Description</label>
              <Textarea
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
                placeholder="Describe the opportunity, requirements, benefits, etc."
                className="min-h-[120px]"
              />
            </div>

            {/* Location */}
            <Input
              label="Location"
              name="location"
              value={formData.location || ''}
              onChange={handleChange}
              placeholder="e.g., Kigali, Rwanda or Remote"
            />

            {/* Apply URL */}
            <Input
              label="Application URL"
              name="applyUrl"
              type="url"
              value={formData.applyUrl || ''}
              onChange={handleChange}
              placeholder="https://example.com/apply"
              endIcon={formData.applyUrl && <ExternalLink className="h-4 w-4 text-muted-foreground" />}
            />

            {/* Deadline */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Deadline (Optional)
              </label>
              <input
                type="date"
                name="deadline"
                value={formData.deadline || ''}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                className="w-full pl-3 pr-3 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth"
              />
            </div>

            {/* Status */}
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div>
                <label className="font-medium">Active</label>
                <p className="text-sm text-muted-foreground">Hide from public listings if disabled</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-background after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button
                type="submit"
                disabled={isSubmitting || !isDirty || success}
                className="flex-1"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
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

export default EditOpportunity;