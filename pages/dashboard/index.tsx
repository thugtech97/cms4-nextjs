import AdminLayout from '@/components/Layout/AdminLayout'
import WebsiteSummary from '@/components/UI/WebsiteSummary';
import RecentActivity from '@/components/UI/RecentActivity';
import StatsCards from '@/components/UI/StatsCards';

export default function DashboardIndex() {
  return (
    <div className="container">
      <h3 className="mb-4">
        Welcome, Adminz!
      </h3>
      
      <StatsCards/>
      
      <section className="row mb-4">
        <div className="col-md-4">
          <WebsiteSummary/>
        </div>

        <div className="col-md-8">
          <RecentActivity/>
        </div>
      </section>
    </div>
  );
}

DashboardIndex.Layout = AdminLayout;
