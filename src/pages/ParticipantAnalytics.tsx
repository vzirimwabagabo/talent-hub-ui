// src/pages/UserAnalytics.tsx

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Clock,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Bookmark,
  BarChart3,
  PieChart,
  LineChart,
  Users,
  Target,
  Award,
  Calendar,
  MapPin,
  Star,
  TrendingUp,
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement,
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { chartColors } from '@/lib/chartTheme';

// Register Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement
);

// Enhanced dummy data
const mockProfile = {
  id: 'profile_1',
  bio: { en: 'Passionate full-stack developer with 3+ years of experience in React and Node.js.' },
  skills: ['React', 'TypeScript', 'Node.js', 'MongoDB', 'Tailwind CSS', 'Python', 'AWS'],
  experienceLevel: 'intermediate' as const,
  availability: 'full-time' as const,
  profileCompletion: 85,
  joinedDate: '2024-01-15',
  totalApplications: 12,
  successRate: 67,
};

const mockApplications = [
  {
    id: 'app_1',
    opportunity: {
      id: 'opp_1',
      title: 'Senior Frontend Engineer',
      category: 'job',
      deadline: '2025-12-15',
      organization: 'TechCorp Inc.',
    },
    matchScore: 0.92,
    status: 'approved' as const,
    message: 'Excited to bring my React expertise to your team!',
    appliedDate: '2025-10-01',
  },
  {
    id: 'app_2',
    opportunity: {
      id: 'opp_2',
      title: 'UX Design Intern',
      category: 'internship',
      deadline: '2025-11-30',
      organization: 'DesignStudio',
    },
    matchScore: 0.78,
    status: 'pending' as const,
    message: '',
    appliedDate: '2025-10-15',
  },
  {
    id: 'app_3',
    opportunity: {
      id: 'opp_3',
      title: 'Tech Scholarship 2025',
      category: 'scholarship',
      deadline: '2025-10-20',
      organization: 'Education Foundation',
    },
    matchScore: 0.65,
    status: 'rejected' as const,
    message: 'Applied for full tuition support.',
    appliedDate: '2025-09-20',
  },
  {
    id: 'app_4',
    opportunity: {
      id: 'opp_8',
      title: 'Backend Developer',
      category: 'job',
      deadline: '2025-11-10',
      organization: 'StartupXYZ',
    },
    matchScore: 0.88,
    status: 'approved' as const,
    message: 'Looking forward to working with your team!',
    appliedDate: '2025-10-05',
  },
  {
    id: 'app_5',
    opportunity: {
      id: 'opp_9',
      title: 'Mentorship Program',
      category: 'volunteering',
      deadline: '2025-12-01',
      organization: 'TechCommunity',
    },
    matchScore: 0.95,
    status: 'pending' as const,
    message: 'Interested in mentoring junior developers.',
    appliedDate: '2025-10-10',
  },
];

const mockRecommended = [
  {
    id: 'opp_4',
    title: 'Remote React Developer',
    category: 'job',
    location: 'Remote',
    deadline: '2025-11-25',
    isActive: true,
    matchScore: 0.91,
    salary: '$80,000 - $100,000',
  },
  {
    id: 'opp_5',
    title: 'Summer Coding Bootcamp',
    category: 'internship',
    location: 'Kigali, Rwanda',
    deadline: '2025-12-01',
    isActive: true,
    matchScore: 0.76,
    salary: 'Stipend: $2,000/month',
  },
  {
    id: 'opp_6',
    title: 'Women in Tech Grant',
    category: 'grant',
    location: 'Remote',
    deadline: '2025-10-30',
    isActive: true,
    matchScore: 0.82,
    salary: 'Grant: $10,000',
  },
  {
    id: 'opp_7',
    title: 'Community Volunteer Program',
    category: 'volunteering',
    location: 'Kigali, Rwanda',
    deadline: '2025-11-10',
    isActive: true,
    matchScore: 0.69,
    salary: 'Volunteer',
  },
  {
    id: 'opp_10',
    title: 'AI Research Fellowship',
    category: 'fellowship',
    location: 'Remote',
    deadline: '2025-12-20',
    isActive: true,
    matchScore: 0.87,
    salary: 'Fellowship: $5,000',
  },
];

const mockBookmarks = [
  { id: 'bkmk_1', itemId: 'opp_4', itemType: 'Opportunity' as const, title: 'Remote React Developer', category: 'job' },
  { id: 'bkmk_2', itemId: 'event_1', itemType: 'Event' as const, title: 'Talent Networking Night', category: 'event' },
  { id: 'bkmk_3', itemId: 'opp_10', itemType: 'Opportunity' as const, title: 'AI Research Fellowship', category: 'fellowship' },
  { id: 'bkmk_4', itemId: 'resource_1', itemType: 'Resource' as const, title: 'React Best Practices Guide', category: 'resource' },
];

// Monthly application data for trend chart
const monthlyApplications = [
  { month: 'Jan', applications: 2, approved: 1 },
  { month: 'Feb', applications: 1, approved: 0 },
  { month: 'Mar', applications: 3, approved: 2 },
  { month: 'Apr', applications: 2, approved: 1 },
  { month: 'May', applications: 4, approved: 3 },
  { month: 'Jun', applications: 3, approved: 2 },
  { month: 'Jul', applications: 5, approved: 4 },
  { month: 'Aug', applications: 4, approved: 3 },
  { month: 'Sep', applications: 6, approved: 4 },
  { month: 'Oct', applications: 8, approved: 6 },
];

// Chart size configurations
const CHART_SIZES = {
  small: { height: 250, className: 'h-[250px]' },
  medium: { height: 320, className: 'h-[320px]' },
  large: { height: 400, className: 'h-[400px]' },
  xlarge: { height: 500, className: 'h-[500px]' },
};

export default function UserAnalytics() {
  const [profile] = useState(mockProfile);
  const [applications] = useState(mockApplications);
  const [recommended] = useState(mockRecommended);
  const [bookmarks] = useState(mockBookmarks);
  const [chartSize, setChartSize] = useState<'small' | 'medium' | 'large'>('medium');

  // 📊 Application Status Chart Data
  const applicationChartData = useMemo(() => {
    const statusCounts = { pending: 0, approved: 0, rejected: 0, fulfilled: 0 };
    applications.forEach(app => {
      statusCounts[app.status as keyof typeof statusCounts]++;
    });

    return {
      labels: ['Pending', 'Approved', 'Rejected', 'Fulfilled'],
      datasets: [
        {
          data: [statusCounts.pending, statusCounts.approved, statusCounts.rejected, statusCounts.fulfilled],
          backgroundColor: [
            chartColors.warning,      // pending
            chartColors.success,      // approved
            chartColors.destructive,  // rejected
            chartColors.accent,       // fulfilled
          ],
          borderWidth: 0,
          borderRadius: 8,
        },
      ],
    };
  }, [applications]);

  // 📊 Opportunity Category Chart Data
  const categoryChartData = useMemo(() => {
    const categoryCounts: Record<string, number> = {};
    recommended.forEach(opp => {
      categoryCounts[opp.category] = (categoryCounts[opp.category] || 0) + 1;
    });

    const colors = [
      chartColors.primary,
      chartColors.secondary,
      chartColors.accent,
      chartColors.muted,
      chartColors.success,
      chartColors.warning,
    ];

    return {
      labels: Object.keys(categoryCounts).map(cat => 
        cat.charAt(0).toUpperCase() + cat.slice(1)
      ),
      datasets: [
        {
          data: Object.values(categoryCounts),
          backgroundColor: Object.keys(categoryCounts).map((_, i) => colors[i % colors.length]),
          borderWidth: 0,
          borderRadius: 6,
        },
      ],
    };
  }, [recommended]);

  // 📈 Application Trend Chart Data
  const trendChartData = useMemo(() => ({
    labels: monthlyApplications.map(item => item.month),
    datasets: [
      {
        label: 'Applications',
        data: monthlyApplications.map(item => item.applications),
        borderColor: chartColors.primary,
        backgroundColor: `${chartColors.primary}20`,
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Approved',
        data: monthlyApplications.map(item => item.approved),
        borderColor: chartColors.success,
        backgroundColor: `${chartColors.success}20`,
        tension: 0.4,
        fill: true,
      },
    ],
  }), []);

  // 🎯 Match Score Distribution
  const matchScoreData = useMemo(() => {
    const scoreRanges = {
      '90-100%': 0,
      '80-89%': 0,
      '70-79%': 0,
      '60-69%': 0,
      'Below 60%': 0,
    };

    applications.forEach(app => {
      const score = app.matchScore * 100;
      if (score >= 90) scoreRanges['90-100%']++;
      else if (score >= 80) scoreRanges['80-89%']++;
      else if (score >= 70) scoreRanges['70-79%']++;
      else if (score >= 60) scoreRanges['60-69%']++;
      else scoreRanges['Below 60%']++;
    });

    return {
      labels: Object.keys(scoreRanges),
      datasets: [
        {
          data: Object.values(scoreRanges),
          backgroundColor: [
            chartColors.success,
            chartColors.primary,
            chartColors.accent,
            chartColors.warning,
            chartColors.destructive,
          ],
          borderWidth: 0,
          borderRadius: 6,
        },
      ],
    };
  }, [applications]);

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
      case 'rejected': return <AlertCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      default: return null;
    }
  };

  // Chart options with customizable size
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: { 
          padding: 20, 
          usePointStyle: true, 
          font: { size: 12, family: 'system-ui' },
          color: 'hsl(215, 16%, 47%)',
        },
      },
      tooltip: { 
        padding: 12, 
        titleFont: { size: 14, family: 'system-ui' }, 
        bodyFont: { size: 13, family: 'system-ui' },
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        cornerRadius: 8,
      },
    },
    scales: {
      x: { 
        grid: { display: false, drawBorder: false },
        ticks: { color: 'hsl(215, 16%, 47)', font: { family: 'system-ui' } },
      },
      y: { 
        grid: { color: 'hsl(214, 32%, 91%)', drawBorder: false },
        ticks: { color: 'hsl(215, 16%, 47%)', font: { family: 'system-ui' } },
        beginAtZero: true,
      },
    },
  };

  const pieOptions = {
    ...chartOptions,
    cutout: '60%',
    plugins: {
      ...chartOptions.plugins,
      legend: { 
        ...chartOptions.plugins.legend, 
        position: 'right' as const,
      },
    },
  };

  const lineOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      legend: {
        position: 'top' as const,
        labels: chartOptions.plugins.legend.labels,
      },
    },
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Participant Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back! Here's your activity overview.</p>
        </div>
        
        {/* Chart Size Controls */}
        <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-lg">
          {(['small', 'medium', 'large'] as const).map((size) => (
            <Button
              key={size}
              variant={chartSize === size ? "default" : "ghost"}
              size="sm"
              onClick={() => setChartSize(size)}
              className="capitalize text-xs"
            >
              {size}
            </Button>
          ))}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Applications</p>
                <p className="text-2xl font-bold mt-1">{applications.length}</p>
              </div>
              <Target className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700 dark:text-green-300">Success Rate</p>
                <p className="text-2xl font-bold mt-1">{profile.successRate}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Bookmarks</p>
                <p className="text-2xl font-bold mt-1">{bookmarks.length}</p>
              </div>
              <Bookmark className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-700 dark:text-orange-300">Recommended</p>
                <p className="text-2xl font-bold mt-1">{recommended.length}</p>
              </div>
              <Star className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Application Status Pie Chart */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <PieChart className="h-5 w-5" />
              Application Status
              <Badge variant="outline" className="ml-auto">
                {applications.length} total
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className={CHART_SIZES[chartSize].className}>
            <Pie data={applicationChartData} options={pieOptions} />
          </CardContent>
        </Card>

        {/* Application Trend Line Chart */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <LineChart className="h-5 w-5" />
              Application Trends
              <Badge variant="outline" className="ml-auto">
                Monthly
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className={CHART_SIZES[chartSize].className}>
            <Line data={trendChartData} options={lineOptions} />
          </CardContent>
        </Card>

        {/* Opportunity Categories */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <BarChart3 className="h-5 w-5" />
              Opportunity Categories
              <Badge variant="outline" className="ml-auto">
                {recommended.length} opportunities
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className={CHART_SIZES[chartSize].className}>
            <Bar data={categoryChartData} options={chartOptions} />
          </CardContent>
        </Card>

        {/* Match Score Distribution */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Award className="h-5 w-5" />
              Match Score Distribution
              <Badge variant="outline" className="ml-auto">
                Your applications
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className={CHART_SIZES[chartSize].className}>
            <Bar data={matchScoreData} options={chartOptions} />
          </CardContent>
        </Card>
      </div>

      {/* Bottom Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Applications */}
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Recent Applications ({applications.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {applications.map((app) => (
                <div key={app.id} className="p-4 border rounded-lg bg-card hover:bg-muted/30 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{app.opportunity.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <span>{app.opportunity.organization}</span>
                        <span>•</span>
                        <span className="capitalize">{app.opportunity.category}</span>
                        <span>•</span>
                        <span className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          Applied: {new Date(app.appliedDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={getStatusColor(app.status)} 
                        className="flex items-center gap-1"
                      >
                        {getStatusIcon(app.status)}
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </Badge>
                      <div className="text-sm font-medium px-2 py-1 bg-primary/10 text-primary rounded">
                        {Math.round(app.matchScore * 100)}% Match
                      </div>
                    </div>
                  </div>
                  {app.message && (
                    <div className="text-sm mt-3 bg-muted/50 p-3 rounded border">
                      <strong>Your application note:</strong> {app.message}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Profile Completion */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Your Profile</span>
                <Badge variant="participant">Participant</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Completion Progress</span>
                  <span className="font-semibold">{profile.profileCompletion}%</span>
                </div>
                <Progress value={profile.profileCompletion} className="h-3" />
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground">Experience</div>
                  <div className="font-medium capitalize">{profile.experienceLevel}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Availability</div>
                  <div className="font-medium capitalize">{profile.availability}</div>
                </div>
              </div>

              <div>
                <div className="text-sm text-muted-foreground mb-2">Skills</div>
                <div className="flex flex-wrap gap-1">
                  {profile.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <Button className="w-full" size="sm">
                Complete Profile
              </Button>
            </CardContent>
          </Card>

          {/* Bookmarks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bookmark className="h-5 w-5" />
                Bookmarks ({bookmarks.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {bookmarks.map((item) => (
                  <div key={item.id} className="flex items-center p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                    <Bookmark className="h-4 w-4 mr-3 text-primary flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{item.title}</div>
                      <div className="text-xs text-muted-foreground capitalize">{item.category}</div>
                    </div>
                    <ExternalLink className="h-3 w-3 ml-2 text-muted-foreground flex-shrink-0" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <ExternalLink className="h-4 w-4 mr-2" />
                Browse Opportunities
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" />
                View Events
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics Report
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}