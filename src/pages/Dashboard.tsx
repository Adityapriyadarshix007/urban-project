import { useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { db } from '@/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { Report } from '@/types';
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { ClockIcon, RefreshCwIcon, CheckCircle2Icon } from 'lucide-react';

const Dashboard = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'reports'));
        const fetchedReports: Report[] = snapshot.docs.map((doc) => {
          const data = doc.data();
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

        setReports(fetchedReports.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()));
      } catch (error) {
        console.error('Failed to fetch reports:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const pendingCount = reports.filter((r) => r.status === 'Pending').length;
  const inProgressCount = reports.filter((r) => r.status === 'In Progress').length;
  const fixedCount = reports.filter((r) => r.status === 'Fixed').length;

  const pieData = [
    { name: 'Pending', value: pendingCount },
    { name: 'In Progress', value: inProgressCount },
    { name: 'Fixed', value: fixedCount },
  ];

  const categoryCounts: Record<string, number> = {};
  reports.forEach((report) => {
    categoryCounts[report.category] = (categoryCounts[report.category] || 0) + 1;
  });
  const barData = Object.entries(categoryCounts).map(([category, count]) => ({
    category,
    count,
  }));

  const COLORS = ['#f87171', '#fbbf24', '#34d399'];

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
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <SummaryCard title="Total Reports" value={reports.length} change="+12%" />
              <SummaryCard title="Pending" value={pendingCount} change="+5%" icon={<ClockIcon />} />
              <SummaryCard title="In Progress" value={inProgressCount} change="+8%" icon={<RefreshCwIcon />} />
              <SummaryCard title="Fixed" value={fixedCount} change="+3%" icon={<CheckCircle2Icon />} />
            </div>

            {/* Charts */}
            <div className="grid md:grid-cols-2 gap-6 mb-10">
              {/* Pie Chart */}
              <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                  Report Status Distribution
                </h2>
                <div className="w-full h-[300px]">
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="value"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name} (${(percent * 100).toFixed(0)}%)`
                        }
                      >
                        {pieData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="bottom" />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Bar Chart */}
              <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                  Reports by Category
                </h2>
                <div className="w-full h-[300px]">
                  <ResponsiveContainer>
                    <BarChart data={barData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Recent Reports */}
            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                Recent Reports
              </h2>
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {reports.slice(0, 5).map((report) => (
                  <li key={report.id} className="py-4">
                    <div className="flex justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {report.category} - {report.status}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {report.address || report.location.address}
                        </p>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {report.timestamp.toLocaleDateString()}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

const SummaryCard = ({
  title,
  value,
  change,
  icon,
}: {
  title: string;
  value: number;
  change: string;
  icon?: React.ReactNode;
}) => (
  <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-4 flex justify-between items-center">
    <div>
      <p className="text-gray-500 dark:text-gray-400 text-sm">{title}</p>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      <p className="text-sm text-green-500">{change} from last month</p>
    </div>
    {icon && <div className="text-gray-400 dark:text-gray-500">{icon}</div>}
  </div>
);

export default Dashboard;
