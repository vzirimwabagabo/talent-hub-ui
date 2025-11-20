// src/pages/OpportunityDetail.tsx

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Briefcase,
  MapPin,
  Calendar,
  Link as LinkIcon,
  Building,
  Clock,
  Share2,
  Bookmark,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getOpportunityDetails } from '@/api/opportunityApi';
import type { Opportunity } from '@/types/opportunity';
import Header from '@/components/Header';

const categoryConfig = {
  job: { icon: Briefcase, label: 'Job', color: 'bg-blue-500/10 text-blue-500' },
  internship: { icon: Briefcase, label: 'Internship', color: 'bg-emerald-500/10 text-emerald-500' },
  scholarship: { icon: Building, label: 'Scholarship', color: 'bg-purple-500/10 text-purple-500' },
  grant: { icon: Building, label: 'Grant', color: 'bg-rose-500/10 text-rose-500' },
  volunteering: { icon: Building, label: 'Volunteering', color: 'bg-orange-500/10 text-orange-500' },
  other: { icon: Briefcase, label: 'Opportunity', color: 'bg-muted text-muted-foreground' },
};

const OpportunityDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOpportunity = async () => {
      if (!id) return;
      try {
        const res = await getOpportunityDetails(id);
        if (res.success) {
          setOpportunity(res.opportunity);
        } else {
          setError(res.error || 'Failed to load opportunity');
        }
      } catch (err: any) {
        setError('Opportunity not found');
      } finally {
        setIsLoading(false);
      }
    };
    fetchOpportunity();
  }, [id]);

  const getDaysUntilDeadline = () => {
    if (!opportunity?.deadline) return null;
    const today = new Date();
    const due = new Date(opportunity.deadline);
    const diffTime = due.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const daysLeft = getDaysUntilDeadline();
  const isExpired = daysLeft !== null && daysLeft < 0;
  const isUrgent = daysLeft !== null && daysLeft <= 3 && daysLeft >= 0;

  const handleApply = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (user.role === 'participant') {
      // Talent: open apply modal or redirect to match request
      navigate(`/match-requests/create?opportunity=${opportunity?.id}`);
    } else {
      // Supporter/Admin: edit opportunity
      navigate(`/opportunities/${opportunity?._id}/edit`);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: opportunity?.title || 'Opportunity',
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      // Show toast: "Link copied!"
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-primary mb-4"></div>
          <p className="text-muted-foreground">Loading opportunity details...</p>
        </div>
      </div>
    );
  }

  if (error || !opportunity) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md p-8 text-center">
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Not Found</h2>
          <p className="text-muted-foreground mb-6">{error || 'This opportunity does not exist.'}</p>
          <Button onClick={() => navigate('/opportunities')}>
            Browse Opportunities
          </Button>
        </Card>
      </div>
    );
  }

  const Icon = categoryConfig[opportunity.category]?.icon || Briefcase;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted pb-16">
      <Header/>
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 opacity-20"></div>
        <div className="container mx-auto px-4 pt-8 pb-12 relative z-10">
          <Button
            variant="ghost"
            onClick={() => navigate('/opportunities')}
            className="mb-6"
          >
            ← Back to Opportunities
          </Button>

          <div className="max-w-4xl mx-auto">
            {/* Category & Status */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Badge className={cn("text-sm px-3 py-1.5", categoryConfig[opportunity.category]?.color)}>
                <Icon className="h-3.5 w-3.5 mr-1.5" />
                {categoryConfig[opportunity.category]?.label}
              </Badge>
              {isExpired ? (
                <Badge variant="destructive">Closed</Badge>
              ) : isUrgent ? (
                <Badge variant="destructive">Ending soon!</Badge>
              ) : (
                daysLeft !== null && (
                  <Badge variant="secondary">{daysLeft} days left</Badge>
                )
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold mb-3">{opportunity.title}</h1>

            {/* Posted By */}
            <div className="flex items-center gap-2 text-muted-foreground mb-6">
              <Building className="h-4 w-4" />
              <span>Posted by {opportunity.postedBy.name}</span>
              <span>•</span>
              <span>
                {new Date(opportunity.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>

            {/* CTA Bar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <Button
                size="lg"
                className="flex-1"
                onClick={handleApply}
                disabled={isExpired}
              >
                {isExpired ? (
                  'Closed'
                ) : user?.role === 'participant' ? (
                  'Apply Now'
                ) : (
                  'Edit Opportunity'
                )}
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleShare}
                  className="h-12 w-12"
                >
                  <Share2 className="h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className={cn("h-12 w-12", isBookmarked && "text-primary border-primary")}
                >
                  <Bookmark className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 -mt-6">
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Description */}
          <div className="lg:col-span-2">
            <Card className="p-6 shadow-medium">
              <h2 className="text-xl font-bold mb-4">Description</h2>
              <div
                className="prose prose-primary max-w-none text-foreground"
                dangerouslySetInnerHTML={{ __html: opportunity.description.replace(/\n/g, '<br>') }}
              />
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Details Card */}
            <Card className="p-6 shadow-medium">
              <h3 className="font-bold text-lg mb-4">Details</h3>
              <div className="space-y-4">
                {opportunity.location && (
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p className="font-medium">{opportunity.location}</p>
                    </div>
                  </div>
                )}

                {opportunity.deadline && (
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Deadline</p>
                      <p className="font-medium">
                        {new Date(opportunity.deadline).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                      {daysLeft !== null && daysLeft >= 0 && (
                        <p className={cn("text-sm mt-1", isUrgent ? "text-destructive" : "text-muted-foreground")}>
                          <Clock className="h-3.5 w-3.5 inline mr-1" />
                          {daysLeft === 0 ? 'Ends today' : `Ends in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}`}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {opportunity.applyUrl && (
                  <div className="pt-2">
                    <a
                      href={opportunity.applyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
                    >
                      <LinkIcon className="h-4 w-4" />
                      Apply on external site
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                )}
              </div>
            </Card>

            {/* Posted By Card */}
            <Card className="p-6 shadow-medium">
              <h3 className="font-bold text-lg mb-4">Posted By</h3>
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Building className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{opportunity.postedBy.name}</p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {opportunity.postedBy.role === 'supporter'
                      ? opportunity.postedBy.supporterType
                      : opportunity.postedBy.role}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpportunityDetail;