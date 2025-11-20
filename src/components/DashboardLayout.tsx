// src/components/layout/DashboardLayout.tsx

import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import { Toaster } from '@/components/ui/toaster';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-4 md:p-6">
          {children}
        </main>
        <Toaster />
      </div>
    </div>
  );
}