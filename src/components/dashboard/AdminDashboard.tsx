// src/components/dashboard/AdminDashboard.tsx

import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';
import api from '@/api/apiConfig';
import type { PlatformStats } from '@/types/dashboard';
import { getStats } from "@/api/adminApi";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [opportunityCategoryData, setOpportunityCategoryData] = useState([]);
  const [donationCurrencyData, setDonationCurrencyData] = useState([]);
  const [ratingDistributionData, setRatingDistributionData] = useState([]);

  const COLORS = [
    'hsl(199, 89%, 48%)',
    'hsl(56, 100%, 50%)',
    'hsl(352, 84%, 66%)',
    'hsl(140, 70%, 50%)',
    'hsl(270, 70%, 60%)'
  ];

  const userGrowthData = [
    { month: 'Jan', users: 50 },
    { month: 'Feb', users: 80 },
    { month: 'Mar', users: 120 },
    { month: 'Apr', users: 200 },
    { month: 'May', users: 300 }
  ];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get<{ stats: PlatformStats }>('/admin/stats');
        setStats(res.data.stats);
      } catch (error) {
        console.error('Failed to load admin stats:', error);
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      const res = await getStats();
      if (res?.stats) {
        setOpportunityCategoryData(res.stats.opportunityCategoryData);
        setDonationCurrencyData(res.stats.donationCurrencyData);
        setRatingDistributionData(res.stats.ratingDistributionData);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] p-0 font-sans flex justify-center">
      <div className="max-w-[77vw] w-full">
        {/* Main Dashboard Title */}
        <h1 className="text-3xl font-bold tracking-tight mb-2 mt-6 ml-2 select-none">
          Admin Dashboard
        </h1>

        {/* Admin Badge / Subtitle */}
        <div className="bg-gradient-to-r from-destructive/20 to-primary/20 rounded-lg p-2 flex items-center gap-4 select-none mb-4">
          <Badge variant="admin" className="text-lg px-3 py-1">Admin</Badge>
          <p className="text-[hsl(var(--muted-foreground))] text-sm sm:text-base">
            Platform oversight and management
          </p>
        </div>

        {/* Analytics Section */}
        <section>
         <h2 className="text-2xl font-semibold mb-2 ml-1">Analytics</h2>
          <div className="flex space-x-3 overflow-x-auto scrollbar-thin scrollbar-thumb-primary scrollbar-track-muted rounded-md py-2">
            {[
              {
                title: "User Growth Over Months",
                chart: (
                  <ResponsiveContainer width="100%" height={160}>
                    <LineChart data={userGrowthData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--popover))', color: 'hsl(var(--popover-foreground))' }} />
                      <Legend wrapperStyle={{ color: 'hsl(var(--muted-foreground))' }} />
                      <Line type="monotone" dataKey="users" stroke="hsl(var(--primary))" strokeWidth={2} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                )
              },
              {
                title: "Opportunities by Category",
                chart: opportunityCategoryData && (
                  <ResponsiveContainer width="100%" height={160}>
                    <BarChart data={opportunityCategoryData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="category" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--popover))', color: 'hsl(var(--popover-foreground))' }} />
                      <Legend wrapperStyle={{ color: 'hsl(var(--muted-foreground))' }} />
                      <Bar dataKey="count" fill="hsl(var(--accent))" barSize={30} />
                    </BarChart>
                  </ResponsiveContainer>
                )
              },
              {
                title: "Donations by Currency",
                chart: donationCurrencyData && (
                  <ResponsiveContainer width="100%" height={160}>
                    <PieChart>
                      <Pie
                        data={donationCurrencyData}
                        dataKey="value"
                        nameKey="currency"
                        cx="50%"
                        cy="50%"
                        outerRadius={60}
                        label={({ name }) => name}
                        fill="hsl(var(--accent))"
                      >
                        {donationCurrencyData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--popover))', color: 'hsl(var(--popover-foreground))' }} />
                      <Legend verticalAlign="bottom" wrapperStyle={{ color: 'hsl(var(--muted-foreground))' }} />
                    </PieChart>
                  </ResponsiveContainer>
                )
              },
              {
                title: "Review Ratings Distribution",
                chart: ratingDistributionData && (
                  <ResponsiveContainer width="100%" height={160}>
                    <BarChart data={ratingDistributionData} layout="vertical" margin={{ left: 50 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                      <YAxis dataKey="rating" type="category" stroke="hsl(var(--muted-foreground))" />
                      <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--popover))', color: 'hsl(var(--popover-foreground))' }} />
                      <Legend wrapperStyle={{ color: 'hsl(var(--muted-foreground))' }} />
                      <Bar dataKey="count" fill="hsl(var(--destructive))" barSize={15} />
                    </BarChart>
                  </ResponsiveContainer>
                )
              }
            ].map(({ title, chart }, idx) => (
              <Card key={idx} className="min-w-[280px] max-w-[280px] flex-shrink-0 shadow-soft dark:shadow-md p-3">
                <CardHeader>
                  <CardTitle className="text-xs sm:text-sm font-semibold text-[hsl(var(--card-foreground))] truncate">{title}</CardTitle>
                </CardHeader>
                <CardContent className="p-0 h-40">
                  {chart ? chart : <p className="text-[hsl(var(--muted-foreground))] text-center pt-10">Loading...</p>}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Admin Actions Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-[hsl(var(--muted-foreground))] text-sm">
                Manage user roles, verify accounts, and handle reports.
              </p>
              <button
                className="text-[hsl(var(--primary))] hover:underline"
                onClick={() => window.location.href = '/admin/users'}
                type="button"
              >
                Go to User Management →
              </button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Content Moderation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-[hsl(var(--muted-foreground))] text-sm">
                Review opportunities, events, and user-generated content.
              </p>
              <button
                className="text-[hsl(var(--primary))] hover:underline"
                onClick={() => navigate('/admin/review')}
                type="button"
              >
                Review Content →
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
