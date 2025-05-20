import { useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { AdminDashboard } from '@/components/AdminDashboard';
import { db } from '@/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { Report } from '@/types';

const Dashboard = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'reports'));
        const fetchedReports: Report[] = snapshot.docs.map(doc => {
          const data = doc.data();

          // Defensive checks to prevent crashing on missing fields
          return {
            id: doc.id,
            userId: data.userId || 'unknown',
            userEmail: data.userEmail || 'unknown',
            category: data.category || 'Waste',
            location: {
              lat: data.location?.lat || 0,
              lng: data.location?.lng || 0,
              address: data.location?.address || 'No address provided',
            },
            photo: data.photoUrl || data.photo || '',
            status: data.status || 'Pending',
            description: data.description || '',
            address: data.address || '',
            timestamp: data.timestamp?.toDate?.() || new Date(),
            updatedAt: data.updatedAt?.toDate?.() || null,
            assignedTo: data.assignedTo || '',
          };
        });

        setReports(fetchedReports);
      } catch (error) {
        console.error('Failed to fetch reports:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

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

        {loading ? (
          <p>Loading reports...</p>
        ) : (
          <AdminDashboard reports={reports} />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
