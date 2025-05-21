import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ReportList } from '@/components/ReportList';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Report } from '@/types';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { getAuth } from 'firebase/auth';

const Reports = () => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [allReports, setAllReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) {
      console.warn('User not logged in');
      setLoading(false);
      return;
    }

    // Query reports where userId matches current user
    const reportsRef = collection(db, 'reports');
    const q = query(reportsRef, where('userId', '==', currentUser.uid));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const userReports = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            timestamp: data.timestamp?.toDate?.() || null,
            updatedAt: data.updatedAt?.toDate?.() || null,
          };
        }) as Report[];

        setAllReports(userReports);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching user reports:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const reports = {
    all: allReports,
    pending: allReports.filter(report => report.status === 'Pending'),
    inProgress: allReports.filter(report => report.status === 'In Progress'),
    fixed: allReports.filter(report => report.status === 'Fixed'),
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">My Reports</h1>

          {loading ? (
            <p className="text-center">Loading reports...</p>
          ) : (
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              defaultValue="all"
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="all">
                    All Reports
                    <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs">
                      {reports.all.length}
                    </span>
                  </TabsTrigger>
                  <TabsTrigger value="pending">
                    Pending
                    <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs">
                      {reports.pending.length}
                    </span>
                  </TabsTrigger>
                  <TabsTrigger value="inProgress">
                    In Progress
                    <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs">
                      {reports.inProgress.length}
                    </span>
                  </TabsTrigger>
                  <TabsTrigger value="fixed">
                    Fixed
                    <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs">
                      {reports.fixed.length}
                    </span>
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="all">
                <ReportList reports={reports.all} />
              </TabsContent>

              <TabsContent value="pending">
                <ReportList reports={reports.pending} />
              </TabsContent>

              <TabsContent value="inProgress">
                <ReportList reports={reports.inProgress} />
              </TabsContent>

              <TabsContent value="fixed">
                <ReportList reports={reports.fixed} />
              </TabsContent>
            </Tabs>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Reports;
