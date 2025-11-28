// src/pages/Opportunities.tsx

import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Briefcase,
  MapPin,
  Calendar,
  Link as LinkIcon,
  Search,
  Clock,
  GraduationCap,
  Award,
  HandHeart,
  Zap,
  BookOpen,
  Building,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getAllOpportunities } from '@/api/opportunityApi';
import type { Opportunity } from '@/types/opportunity';
import Header from '@/components/Header';

// Category icons & colors
const categoryConfig = {
  job: { icon: Briefcase, label: 'Job', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
  internship: { icon: GraduationCap, label: 'Internship', color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
  scholarship: { icon: Award, label: 'Scholarship', color: 'bg-purple-500/10 text-purple-500 border-purple-500/20' },
  grant: { icon: HandHeart, label: 'Grant', color: 'bg-rose-500/10 text-rose-500 border-rose-500/20' },
  volunteering: { icon: HandHeart, label: 'Volunteering', color: 'bg-orange-500/10 text-orange-500 border-orange-500/20' },
  other: { icon: Zap, label: 'Other', color: 'bg-muted text-muted-foreground border-border' },
};

const Opportunities = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const res = await getAllOpportunities();
        if (res.success) {
          setOpportunities(res.opportunities || []);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load opportunities');
      } finally {
        setIsLoading(false);
      }
    };
    fetchOpportunities();
  }, []);

  const filteredOpportunities = useMemo(() => {
    return opportunities.filter(opportunity =>
      opportunity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opportunity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opportunity.location?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [opportunities, searchTerm]);

  const getDaysUntilDeadline = (deadline?: string) => {
    if (!deadline) return null;
    const today = new Date();
    const due = new Date(deadline);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const renderDeadlineBadge = (opportunity: Opportunity) => {
    const days = getDaysUntilDeadline(opportunity.deadline);
    if (days === null) return null;

    if (days < 0) {
      return <Badge variant="destructive">Closed</Badge>;
    }
    if (days === 0) {
      return <Badge variant="destructive">Today</Badge>;
    }
    if (days <= 3) {
      return <Badge variant="destructive">Ends in {days} days</Badge>;
    }
    if (days <= 7) {
      return <Badge variant="warning">Ends in a week</Badge>;
    }
    return <Badge variant="secondary">{days} days left</Badge>;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-primary mb-4"></div>
          <p className="text-muted-foreground">Discovering opportunities...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <Header />
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 opacity-30"></div>
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
              <Briefcase className="h-5 w-5" />
              <span className="font-medium">New opportunities added daily</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-6">
              Shape Your Future
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Connect with life-changing opportunities tailored to your skills and aspirations.
            </p>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="container mx-auto px-4 -mt-8 mb-12 z-20 relative">
        <Card className="max-w-4xl mx-auto border-border/30 shadow-large backdrop-blur-sm bg-card/80">
          <div className="p-2 md:p-4">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search opportunities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 py-3"
                />
              </div>
              <Button className="md:w-auto w-full" size="lg">
                Search
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Opportunities Grid */}
      <div className="container mx-auto px-4 pb-20">
        {error ? (
          <div className="text-center py-12">
            <AlertTriangle className="h-16 w-16 text-destructive mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-destructive mb-2">Oops!</h3>
            <p className="text-muted-foreground">{error}</p>
          </div>
        ) : filteredOpportunities.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">No opportunities found</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Try adjusting your search or check back soon — new opportunities are added regularly.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredOpportunities.map((opp) => {
              const Icon = categoryConfig[opp.category]?.icon || Briefcase;
              const daysLeft = getDaysUntilDeadline(opp.deadline);
              const isUrgent = daysLeft !== null && daysLeft <= 3 && daysLeft >= 0;
              
              return (
                <Link key={opp._id} to={`/opportunities/${opp._id}`} className="block">
                  <Card
                    className={cn(
                      "group overflow-hidden border border-border/50 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1",
                      "bg-gradient-to-br from-card to-muted/30 backdrop-blur-sm",
                      isUrgent && "ring-2 ring-destructive/30"
                    )}
                  >
                    <div className="p-6">
                      {/* Category Badge */}
                      <div className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium mb-4",
                        categoryConfig[opp.category]?.color || "bg-muted"
                      )}>
                        <Icon className="h-3.5 w-3.5" />
                        {categoryConfig[opp.category]?.label || 'Opportunity'}
                      </div>

                      {/* Title & Location */}
                      <div className="mb-4">
                        <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                          {opp.title}
                        </h3>
                        {opp.location && (
                          <div className="flex items-center gap-1.5 mt-1 text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span>{opp.location}</span>
                          </div>
                        )}
                      </div>

                      {/* Description */}
                      <p className="text-muted-foreground mb-5 line-clamp-3">
                        {opp.description}
                      </p>

                      {/* Footer */}
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex flex-wrap gap-2">
                          {opp.deadline && (
                            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              <span>Deadline: {new Date(opp.deadline).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {renderDeadlineBadge(opp)}
                          {opp.applyUrl && (
                            <Button variant="ghost" size="sm" className="h-8 px-2">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}

        {/* CTA */}
        <div className="text-center mt-20">
          <Card className="inline-block p-6 border-border/30 bg-card/70 backdrop-blur">
            <Building className="h-10 w-10 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Post an Opportunity?</h3>
            <p className="text-muted-foreground mb-4 max-w-md">
              Are you an organization looking for talent? Share your opportunity with our community.
            </p>
            <Button size="lg" onClick={() => navigate('/admin/create-opportunity')}>
              Create Opportunity
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Opportunities;