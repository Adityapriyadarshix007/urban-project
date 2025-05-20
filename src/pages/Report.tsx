
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ReportForm } from '@/components/ReportForm';

const Report = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold">Report an Issue</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Help improve your community by reporting public issues like waste, potholes, leaks, or streetlight problems
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <ReportForm />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Report;
