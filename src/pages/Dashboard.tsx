import DashboardLayout from '@/components/DashboardLayout';
import { DashboardLoader } from '@/components/dashboard/DashboardLoader';

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="container mx-auto">
        <DashboardLoader />
      </div>
    </DashboardLayout>
  );
}