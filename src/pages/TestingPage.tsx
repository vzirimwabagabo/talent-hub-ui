import React from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const AdminDashboard1 = () => {
  // Dummy data samples - replace with real API data
  const userGrowthData = [
    { month: 'Jan', users: 50 },
    { month: 'Feb', users: 80 },
    { month: 'Mar', users: 120 },
    { month: 'Apr', users: 200 },
    { month: 'May', users: 300 }
  ];

  const opportunityCategoryData = [
    { category: 'Job', count: 120 },
    { category: 'Internship', count: 80 },
    { category: 'Scholarship', count: 40 },
    { category: 'Grant', count: 30 },
    { category: 'Volunteering', count: 25 }
  ];

  const donationCurrencyData = [
    { currency: 'USD', value: 40000 },
    { currency: 'EUR', value: 20000 },
    { currency: 'GBP', value: 15000 },
    { currency: 'KES', value: 10000 }
  ];

  const ratingDistributionData = [
    { rating: '5 stars', count: 60 },
    { rating: '4 stars', count: 25 },
    { rating: '3 stars', count: 10 },
    { rating: '2 stars', count: 4 },
    { rating: '1 star', count: 1 }
  ];

  const COLORS = [
    'hsl(199, 89%, 48%)',  // Tailwind --primary
    'hsl(56, 100%, 50%)',  // Accent yellow-ish for variety
    'hsl(352, 84%, 66%)',  // Tailwind --destructive variant
    'hsl(140, 70%, 50%)',  // Green accent
    'hsl(270, 70%, 60%)'   // Purple-ish accent
  ];

  return (
    <div className="min-h-screen p-6 bg-[hsl(var(--background))] font-sans">
      <h1 className="mb-6 text-3xl font-semibold text-[hsl(var(--foreground))] select-none">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        
        {/* User Growth Line Chart */}
        <section className="bg-[hsl(var(--card))] rounded-lg p-6 shadow-soft dark:shadow-md">
          <h3 className="mb-4 text-xl font-medium text-[hsl(var(--card-foreground))] select-none">
            User Growth Over Months
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{ backgroundColor: 'hsl(var(--popover))', color: 'hsl(var(--popover-foreground))' }}
              />
              <Legend wrapperStyle={{ color: 'hsl(var(--muted-foreground))' }} />
              <Line type="monotone" dataKey="users" stroke="hsl(var(--primary))" strokeWidth={2} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </section>

        {/* Opportunity Category Bar Chart */}
        <section className="bg-[hsl(var(--card))] rounded-lg p-6 shadow-soft dark:shadow-md">
          <h3 className="mb-4 text-xl font-medium text-[hsl(var(--card-foreground))] select-none">
            Opportunities by Category
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={opportunityCategoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="category" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{ backgroundColor: 'hsl(var(--popover))', color: 'hsl(var(--popover-foreground))' }}
              />
              <Legend wrapperStyle={{ color: 'hsl(var(--muted-foreground))' }} />
              <Bar dataKey="count" fill="hsl(var(--accent))" barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </section>

        {/* Donation Currency Pie Chart */}
        <section className="bg-[hsl(var(--card))] rounded-lg p-6 shadow-soft dark:shadow-md">
          <h3 className="mb-4 text-xl font-medium text-[hsl(var(--card-foreground))] select-none">
            Donations by Currency
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={donationCurrencyData}
                dataKey="value"
                nameKey="currency"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name }) => name}
                fill="hsl(var(--accent))"
              >
                {donationCurrencyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: 'hsl(var(--popover))', color: 'hsl(var(--popover-foreground))' }}
              />
              <Legend verticalAlign="bottom" wrapperStyle={{ color: 'hsl(var(--muted-foreground))' }} />
            </PieChart>
          </ResponsiveContainer>
        </section>

        {/* Review Rating Distribution Bar Chart */}
        <section className="bg-[hsl(var(--card))] rounded-lg p-6 shadow-soft dark:shadow-md xl:col-span-2">
          <h3 className="mb-4 text-xl font-medium text-[hsl(var(--card-foreground))] select-none">
            Review Ratings Distribution
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={ratingDistributionData} layout="vertical" margin={{ left: 50 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
              <YAxis dataKey="rating" type="category" stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{ backgroundColor: 'hsl(var(--popover))', color: 'hsl(var(--popover-foreground))' }}
              />
              <Legend wrapperStyle={{ color: 'hsl(var(--muted-foreground))' }} />
              <Bar dataKey="count" fill="hsl(var(--destructive))" barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </section>

      </div>
    </div>
  );
};

export default AdminDashboard1;
