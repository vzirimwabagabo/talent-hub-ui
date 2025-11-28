// src/pages/SupporterAnalytics.tsx

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  DollarSign,
  Users,
  Calendar,
  FileText,
  BarChart3,
  TrendingUp,
  PieChart,
  LineChart,
  Target,
  Award,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Plus,
  Filter,
  MapPin,
  Building,
  GraduationCap,
  HeartHandshake,
} from 'lucide-react';

// Chart.js
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
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';

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

// Chart size configurations
const CHART_SIZES = {
  small: { height: 250, className: 'h-[250px]' },
  medium: { height: 320, className: 'h-[320px]' },
  large: { height: 400, className: 'h-[400px]' },
};

// ===== ENHANCED DUMMY DATA =====

const mockOpportunities = [
  { 
    id: 'opp1', 
    title: 'Senior Frontend Engineer', 
    category: 'job', 
    isActive: true,
    organization: 'TechCorp Inc.',
    location: 'Remote',
    salary: '$90,000 - $120,000',
    deadline: '2025-12-15',
    applications: 15,
    matches: 8,
    createdAt: '2025-09-01'
  },
  { 
    id: 'opp2', 
    title: 'UX Design Intern', 
    category: 'internship', 
    isActive: true,
    organization: 'DesignStudio',
    location: 'Kigali, Rwanda',
    salary: 'Stipend: $2,000/month',
    deadline: '2025-11-30',
    applications: 25,
    matches: 12,
    createdAt: '2025-10-01'
  },
  { 
    id: 'opp3', 
    title: 'Tech Scholarship 2025', 
    category: 'scholarship', 
    isActive: false,
    organization: 'Education Foundation',
    location: 'Global',
    amount: '$10,000',
    deadline: '2025-10-20',
    applications: 42,
    matches: 20,
    createdAt: '2025-08-15'
  },
  { 
    id: 'opp4', 
    title: 'Community Volunteer Program', 
    category: 'volunteering', 
    isActive: true,
    organization: 'Local Community',
    location: 'Kigali, Rwanda',
    deadline: '2025-11-10',
    applications: 8,
    matches: 5,
    createdAt: '2025-10-10'
  },
];

const mockMatchRequests = [
  { 
    id: 'req1', 
    opportunity: { id: 'opp1', title: 'Senior Frontend Engineer' }, 
    participant: { name: 'Alice Johnson', skills: ['React', 'TypeScript', 'Node.js'] },
    status: 'pending', 
    matchScore: 0.92, 
    message: 'Very excited about this opportunity! I have 3+ years of React experience.',
    appliedDate: '2025-10-15'
  },
  { 
    id: 'req2', 
    opportunity: { id: 'opp1', title: 'Senior Frontend Engineer' }, 
    participant: { name: 'Bob Smith', skills: ['Vue', 'JavaScript', 'CSS'] },
    status: 'approved', 
    matchScore: 0.88, 
    message: '',
    appliedDate: '2025-10-12'
  },
  { 
    id: 'req3', 
    opportunity: { id: 'opp2', title: 'UX Design Intern' }, 
    participant: { name: 'Carol Davis', skills: ['Figma', 'UI/UX', 'Wireframing'] },
    status: 'pending', 
    matchScore: 0.76, 
    message: 'Portfolio attached with recent projects.',
    appliedDate: '2025-10-18'
  },
  { 
    id: 'req4', 
    opportunity: { id: 'opp3', title: 'Tech Scholarship 2025' }, 
    participant: { name: 'David Wilson', skills: ['Python', 'Machine Learning'] },
    status: 'rejected', 
    matchScore: 0.65, 
    message: 'Looking to advance my AI research skills.',
    appliedDate: '2025-10-10'
  },
  { 
    id: 'req5', 
    opportunity: { id: 'opp4', title: 'Community Volunteer Program' }, 
    participant: { name: 'Eva Brown', skills: ['Teaching', 'Mentoring'] },
    status: 'approved', 
    matchScore: 0.89, 
    message: 'Passionate about community development.',
    appliedDate: '2025-10-14'
  },
];

const mockDonations = [
  { 
    id: 'don1', 
    amount: 2500, 
    currency: 'USD', 
    date: '2025-05-15', 
    message: 'For scholarship programs',
    status: 'completed',
    impact: '5 scholarships funded'
  },
  { 
    id: 'don2', 
    amount: 5000, 
    currency: 'USD', 
    date: '2025-06-10', 
    message: 'Event sponsorship for annual conference',
    status: 'completed',
    impact: '200 attendees supported'
  },
  { 
    id: 'don3', 
    amount: 1000, 
    currency: 'USD', 
    date: '2025-07-01', 
    message: '',
    status: 'completed',
    impact: '10 laptops provided'
  },
  { 
    id: 'don4', 
    amount: 7500, 
    currency: 'USD', 
    date: '2025-10-01', 
    message: 'Women in Tech initiative support',
    status: 'pending',
    impact: '15 mentorships'
  },
];

const mockEvents = [
  { 
    id: 'evt1', 
    title: 'Talent Networking Night', 
    startDate: '2025-11-10', 
    endDate: '2025-11-10',
    isVirtual: false, 
    location: 'Kigali Innovation City',
    attendees: 45,
    capacity: 100,
    description: 'Connect with top tech talent and industry leaders'
  },
  { 
    id: 'evt2', 
    title: 'AI Ethics Workshop', 
    startDate: '2025-11-20', 
    endDate: '2025-11-20',
    isVirtual: true, 
    location: 'Online',
    attendees: 120,
    capacity: 200,
    description: 'Exploring ethical considerations in artificial intelligence'
  },
  { 
    id: 'evt3', 
    title: 'Mentorship Program Kickoff', 
    startDate: '2025-11-25', 
    endDate: '2025-11-25',
    isVirtual: true, 
    location: 'Online',
    attendees: 35,
    capacity: 50,
    description: 'Launching our quarterly mentorship program'
  },
];

// Monthly performance data
const monthlyPerformance = [
  { month: 'Jan', opportunities: 2, applications: 15, matches: 8 },
  { month: 'Feb', opportunities: 3, applications: 22, matches: 12 },
  { month: 'Mar', opportunities: 1, applications: 8, matches: 4 },
  { month: 'Apr', opportunities: 4, applications: 35, matches: 18 },
  { month: 'May', opportunities: 2, applications: 18, matches: 10 },
  { month: 'Jun', opportunities: 5, applications: 42, matches: 25 },
  { month: 'Jul', opportunities: 3, applications: 28, matches: 15 },
  { month: 'Aug', opportunities: 4, applications: 38, matches: 22 },
  { month: 'Sep', opportunities: 6, applications: 55, matches: 32 },
  { month: 'Oct', opportunities: 8, applications: 72, matches: 45 },
];

// =====================

export default function SupporterAnalytics() {
  const [supporterType, setSupporterType] = useState<'employer' | 'donor' | 'volunteer'>('employer');
  const [chartSize, setChartSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  // Chart data calculations
  const opportunityStatusChart = useMemo(() => ({
    labels: ['Active', 'Inactive'],
    datasets: [{
      data: [
        mockOpportunities.filter(opp => opp.isActive).length,
        mockOpportunities.filter(opp => !opp.isActive).length
      ],
      backgroundColor: [chartColors.success, chartColors.muted],
      borderWidth: 0,
      borderRadius: 8,
    }]
  }), []);

  const applicationStatusData = useMemo(() => ({
    labels: ['Pending', 'Approved', 'Rejected'],
    datasets: [{
      data: [
        mockMatchRequests.filter(r => r.status === 'pending').length,
        mockMatchRequests.filter(r => r.status === 'approved').length,
        mockMatchRequests.filter(r => r.status === 'rejected').length,
      ],
      backgroundColor: [
        chartColors.warning,    // pending
        chartColors.success,    // approved
        chartColors.destructive,// rejected
      ],
      borderWidth: 0,
      borderRadius: 6,
    }]
  }), []);

  const performanceTrendData = useMemo(() => ({
    labels: monthlyPerformance.map(m => m.month),
    datasets: [
      {
        label: 'Applications',
        data: monthlyPerformance.map(m => m.applications),
        borderColor: chartColors.primary,
        backgroundColor: `${chartColors.primary}20`,
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Successful Matches',
        data: monthlyPerformance.map(m => m.matches),
        borderColor: chartColors.success,
        backgroundColor: `${chartColors.success}20`,
        tension: 0.4,
        fill: true,
      },
    ],
  }), []);

  const donationTrendData = useMemo(() => ({
    labels: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
    datasets: [{
      label: 'Donations ($)',
      data: [2500, 5000, 1000, 3000, 4000, 7500],
      borderColor: chartColors.accent,
      backgroundColor: `${chartColors.accent}20`,
      tension: 0.3,
      fill: true,
    }]
  }), []);

  const donationCategoryChart = useMemo(() => ({
    labels: ['Scholarships', 'Events', 'Equipment', 'Mentorship'],
    datasets: [{
      data: [40, 25, 20, 15],
      backgroundColor: [
        chartColors.primary,
        chartColors.accent,
        chartColors.secondary,
        chartColors.success,
      ],
      borderWidth: 0,
    }]
  }), []);

  const eventAttendanceData = useMemo(() => ({
    labels: mockEvents.map(e => e.title),
    datasets: [{
      label: 'Attendance Rate',
      data: mockEvents.map(e => (e.attendees / e.capacity) * 100),
      backgroundColor: [
        chartColors.primary,
        chartColors.accent,
        chartColors.success,
      ],
      borderWidth: 0,
      borderRadius: 6,
    }]
  }), []);

  const categoryDistributionData = useMemo(() => ({
    labels: ['Jobs', 'Internships', 'Scholarships', 'Volunteering'],
    datasets: [{
      data: [45, 25, 20, 10],
      backgroundColor: [
        chartColors.primary,
        chartColors.accent,
        chartColors.secondary,
        chartColors.success,
      ],
      borderWidth: 0,
    }]
  }), []);

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
        ticks: { font: { family: 'system-ui' } },
      },
      y: { 
        grid: { color: 'hsl(214, 32%, 91%)', drawBorder: false },
        ticks: { font: { family: 'system-ui' } },
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'success';
      case 'rejected': return 'destructive';
      case 'pending': return 'warning';
      default: return 'secondary';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'job': return <Building className="h-4 w-4" />;
      case 'internship': return <GraduationCap className="h-4 w-4" />;
      case 'scholarship': return <Award className="h-4 w-4" />;
      case 'volunteering': return <HeartHandshake className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const filteredRequests = mockMatchRequests.filter(request => 
    activeFilter === 'all' || request.status === activeFilter
  );

  const totalDonations = mockDonations.reduce((sum, donation) => sum + donation.amount, 0);
  const totalImpact = mockOpportunities.reduce((sum, opp) => sum + opp.matches, 0);
  const approvalRate = mockMatchRequests.length > 0 
    ? Math.round((mockMatchRequests.filter(r => r.status === 'approved').length / mockMatchRequests.length) * 100)
    : 0;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header with Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Supporter Dashboard</h1>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Chart Size Controls */}
          <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-lg">
            {(['small', 'medium', 'large'] as const).map((size) => (
              <Button
                key={size}
                variant={chartSize === size ? "default" : "ghost"}
                size="sm"
                onClick={() => setChartSize(size)}
                className="capitalize text-xs h-8 px-2"
              >
                {size}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Role Selection */}
      <div className="flex flex-wrap gap-3">
        <Button
          variant={supporterType === 'employer' ? 'default' : 'outline'}
          onClick={() => setSupporterType('employer')}
          className="flex items-center gap-2"
        >
          <Building className="h-4 w-4" />
          Employer View
        </Button>
        <Button
          variant={supporterType === 'donor' ? 'default' : 'outline'}
          onClick={() => setSupporterType('donor')}
          className="flex items-center gap-2"
        >
          <DollarSign className="h-4 w-4" />
          Donor View
        </Button>
        <Button
          variant={supporterType === 'volunteer' ? 'default' : 'outline'}
          onClick={() => setSupporterType('volunteer')}
          className="flex items-center gap-2"
        >
          <HeartHandshake className="h-4 w-4" />
          Volunteer View
        </Button>
      </div>

      {/* Role Banner & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Role Banner */}
        <Card className="lg:col-span-4 bg-gradient-to-r from-primary/10 to-accent/10">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
              <div className="flex items-center mb-4 sm:mb-0">
                <Badge variant="supporter" className="text-lg px-4 py-2">
                  {supporterType.charAt(0).toUpperCase() + supporterType.slice(1)}
                </Badge>
                <p className="ml-4 text-muted-foreground">
                  {supporterType === 'employer'
                    ? 'Manage opportunities and talent matches'
                    : supporterType === 'donor'
                    ? 'Track your donations and impact'
                    : 'Coordinate volunteer efforts'}
                </p>
              </div>
              <div className="flex gap-4 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{mockOpportunities.length}</div>
                  <div className="text-muted-foreground">Opportunities</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{totalImpact}</div>
                  <div className="text-muted-foreground">Matches Made</div>
                </div>
                {supporterType === 'donor' && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">${totalDonations.toLocaleString()}</div>
                    <div className="text-muted-foreground">Total Donated</div>
                  </div>
                )}
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{mockMatchRequests.length}</div>
                  <div className="text-muted-foreground">Total Requests</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Pending Requests</p>
                <p className="text-2xl font-bold mt-1">
                  {mockMatchRequests.filter(r => r.status === 'pending').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700 dark:text-green-300">Approval Rate</p>
                <p className="text-2xl font-bold mt-1">{approvalRate}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Total Applicants</p>
                <p className="text-2xl font-bold mt-1">{mockMatchRequests.length}</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-700 dark:text-orange-300">Active Events</p>
                <p className="text-2xl font-bold mt-1">{mockEvents.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dynamic Charts based on Supporter Type */}
        {supporterType === 'employer' && (
          <>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <PieChart className="h-5 w-5" />
                  Application Status
                  <Badge variant="outline" className="ml-auto">
                    {mockMatchRequests.length} total
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className={CHART_SIZES[chartSize].className}>
                <Pie data={applicationStatusData} options={pieOptions} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <LineChart className="h-5 w-5" />
                  Performance Trends
                  <Badge variant="outline" className="ml-auto">
                    Monthly
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className={CHART_SIZES[chartSize].className}>
                <Line data={performanceTrendData} options={lineOptions} />
              </CardContent>
            </Card>
          </>
        )}

        {supporterType === 'donor' && (
          <>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="h-5 w-5" />
                  Donation Trend
                  <Badge variant="outline" className="ml-auto">
                    ${totalDonations.toLocaleString()}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className={CHART_SIZES[chartSize].className}>
                <Line data={donationTrendData} options={lineOptions} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <PieChart className="h-5 w-5" />
                  Donation Categories
                  <Badge variant="outline" className="ml-auto">
                    Distribution
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className={CHART_SIZES[chartSize].className}>
                <Pie data={donationCategoryChart} options={pieOptions} />
              </CardContent>
            </Card>
          </>
        )}

        {supporterType === 'volunteer' && (
          <>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BarChart3 className="h-5 w-5" />
                  Event Attendance
                  <Badge variant="outline" className="ml-auto">
                    {mockEvents.length} events
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className={CHART_SIZES[chartSize].className}>
                <Bar data={eventAttendanceData} options={chartOptions} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Target className="h-5 w-5" />
                  Opportunity Categories
                  <Badge variant="outline" className="ml-auto">
                    Distribution
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className={CHART_SIZES[chartSize].className}>
                <Pie data={categoryDistributionData} options={pieOptions} />
              </CardContent>
            </Card>
          </>
        )}

        {/* Shared Charts */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <PieChart className="h-5 w-5" />
              Opportunity Status
              <Badge variant="outline" className="ml-auto">
                {mockOpportunities.length} total
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className={CHART_SIZES[chartSize].className}>
            <Pie data={opportunityStatusChart} options={pieOptions} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <BarChart3 className="h-5 w-5" />
              Category Distribution
              <Badge variant="outline" className="ml-auto">
                All Types
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className={CHART_SIZES[chartSize].className}>
            <Bar data={categoryDistributionData} options={chartOptions} />
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column - Opportunities & Events */}
        <div className="xl:col-span-2 space-y-6">
          {/* Posted Opportunities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Your Opportunities ({mockOpportunities.length})
                </div>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  New Opportunity
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockOpportunities.map((opp) => (
                  <div key={opp.id} className="p-4 border rounded-lg bg-card hover:bg-muted/30 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getCategoryIcon(opp.category)}
                          <h3 className="font-semibold text-lg">{opp.title}</h3>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
                          <span className="flex items-center">
                            <Building className="h-3 w-3 mr-1" />
                            {opp.organization}
                          </span>
                          <span>•</span>
                          <span className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {opp.location}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="capitalize">
                            {opp.category}
                          </Badge>
                          {opp.salary && <span className="text-sm font-medium">{opp.salary}</span>}
                          {opp.amount && <span className="text-sm font-medium">{opp.amount}</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={opp.isActive ? 'default' : 'secondary'}>
                          {opp.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        <div className="text-right">
                          <div className="font-semibold">{opp.applications} applicants</div>
                          <div className="text-xs text-muted-foreground">{opp.matches} matches</div>
                        </div>
                      </div>
                    </div>
                    {opp.deadline && (
                      <div className="flex items-center text-sm text-muted-foreground mt-2">
                        <Clock className="h-3 w-3 mr-1" />
                        Deadline: {new Date(opp.deadline).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Events */}
          {mockEvents.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Upcoming Events ({mockEvents.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {mockEvents.map((event) => (
                    <div key={event.id} className="p-4 border rounded-lg bg-card hover:bg-muted/30 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{event.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground mt-2">
                            <span>
                              {new Date(event.startDate).toLocaleDateString()} 
                              {event.endDate && ` - ${new Date(event.endDate).toLocaleDateString()}`}
                            </span>
                            <span>•</span>
                            <span>{event.isVirtual ? 'Virtual' : event.location}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="font-semibold">{event.attendees} / {event.capacity}</div>
                            <div className="text-xs text-muted-foreground">attendees</div>
                          </div>
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </div>
                      </div>
                      <Progress 
                        value={(event.attendees / event.capacity) * 100} 
                        className="h-2 mt-3"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Match Requests & Donations */}
        <div className="space-y-6">
          {/* Match Requests */}
          {(supporterType === 'employer' || supporterType === 'volunteer') && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Match Requests
                  </div>
                  <div className="flex gap-1">
                    {(['all', 'pending', 'approved', 'rejected'] as const).map((filter) => (
                      <Button
                        key={filter}
                        variant={activeFilter === filter ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setActiveFilter(filter)}
                        className="capitalize text-xs h-8 px-2"
                      >
                        {filter}
                      </Button>
                    ))}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {filteredRequests.map((request) => (
                    <div key={request.id} className="p-3 border rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors">
                      <div className="flex justify-between items-start gap-3">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{request.opportunity.title}</h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            {request.participant.name} • {Math.round(request.matchScore * 100)}% match
                          </p>
                          {request.participant.skills && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {request.participant.skills.slice(0, 3).map((skill) => (
                                <Badge key={skill} variant="outline" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                              {request.participant.skills.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{request.participant.skills.length - 3} more
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                        <Badge 
                          variant={getStatusColor(request.status)} 
                          className="flex items-center gap-1 whitespace-nowrap"
                        >
                          {getStatusIcon(request.status)}
                          {request.status}
                        </Badge>
                      </div>
                      
                      {request.message && (
                        <div className="mt-2 text-sm bg-muted/50 p-2 rounded border">
                          <strong>Message:</strong> {request.message}
                        </div>
                      )}
                      
                      <div className="flex gap-2 mt-3">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        {request.status === 'pending' && (
                          <>
                            <Button size="sm" className="flex-1">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Approve
                            </Button>
                            <Button size="sm" variant="destructive" className="flex-1">
                              <XCircle className="h-3 w-3 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                  {filteredRequests.length === 0 && (
                    <div className="text-center text-muted-foreground py-8">
                      <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No {activeFilter === 'all' ? '' : activeFilter} requests found</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Donations (Donor only) */}
          {supporterType === 'donor' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Recent Donations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockDonations.map((donation) => (
                    <div key={donation.id} className="p-3 border rounded-lg bg-muted/20">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-semibold">
                            ${donation.amount.toLocaleString()} {donation.currency}
                          </div>
                          {donation.message && (
                            <p className="text-sm text-muted-foreground mt-1">{donation.message}</p>
                          )}
                          {donation.impact && (
                            <Badge variant="outline" className="mt-1 text-xs">
                              {donation.impact}
                            </Badge>
                          )}
                        </div>
                        <div className="text-right">
                          <Badge variant={donation.status === 'completed' ? 'success' : 'warning'}>
                            {donation.status}
                          </Badge>
                          <div className="text-sm text-muted-foreground mt-1">
                            {new Date(donation.date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Plus className="h-4 w-4 mr-2" />
                Create New Opportunity
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" />
                View All Applicants
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <BarChart3 className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                Manage Events
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}