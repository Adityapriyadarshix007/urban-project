
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { AdminDashboard } from '@/components/AdminDashboard';
import { mockReports } from '@/data/mockData';

const Dashboard = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Public Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Explore and analyze civic issues in your community
          </p>
        </div>
        
        <AdminDashboard reports={mockReports} />
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
