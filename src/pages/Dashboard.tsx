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
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  const statusColors: { [key: string]: string } = {
    Pending: '#f87171',       // red
    'In Progress': '#facc15', // yellow
    Fixed: '#22c55e',         // green
  };

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
        setReports(fetchedReports);
      } catch (error) {
        console.error('Failed to fetch reports:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const statusCounts = reports.reduce(
    (acc, report) => {
      acc[report.status] = (acc[report.status] || 0) + 1;
      return acc;
    },
    {} as { [key: string]: number }
  );

  const categoryCounts = reports.reduce(
    (acc, report) => {
      acc[report.category] = (acc[report.category] || 0) + 1;
      return acc;
    },
    {} as { [key: string]: number }
  );

  const pieChartData = Object.keys(statusCounts).map((status) => ({
    name: status,
    value: statusCounts[status],
  }));

  const barChartData = Object.entries(categoryCounts).map(([category, count]) => ({
    category,
    count,
  }));

  const renderLabel = ({ cx, cy, midAngle, outerRadius, percent, index }: any) => {
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 30;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="#ffffff" // bright white for contrast
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      fontSize={16}
      fontWeight="bold"
      style={{
        textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
      }}
    >
      {`${pieChartData[index].name} (${(percent * 100).toFixed(1)}%)`}
    </text>
  );
};


  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Public Dashboard</h1>
          <p className="text-muted-foreground mt-2 text-gray-600 dark:text-gray-400">
            Explore and analyze civic issues in your community
          </p>
        </div>

        {loading ? (
          <p>Loading reports...</p>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-4">
                <h2 className="text-gray-600 dark:text-gray-300">Total Reports</h2>
                <p className="text-3xl font-bold">{reports.length}</p>
              </div>
              {Object.keys(statusCounts).map((status) => (
                <div key={status} className="bg-white dark:bg-gray-800 shadow rounded-xl p-4">
                  <h2 className="text-gray-600 dark:text-gray-300">{status}</h2>
                  <p className="text-3xl font-bold">{statusCounts[status]}</p>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pie Chart */}
              <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-6 flex flex-col items-center">
                <h2 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-200">Report Status Distribution</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      labelLine={false}
                      label={renderLabel}
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={statusColors[entry.name] || '#ccc'}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <ul className="mt-4 space-y-1 text-sm text-gray-600 dark:text-gray-300">
                  {pieChartData.map((entry, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <span
                        className="w-3 h-3 rounded-full inline-block"
                        style={{ backgroundColor: statusColors[entry.name] || '#ccc' }}
                      ></span>
                      <span>{entry.name}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bar Chart (by Category) */}
              <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-6">
                <h2 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-200">Reports by Category</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={barChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Reports */}
            <div className="mt-10">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Recent Reports</h2>
              <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-4 max-h-64 overflow-y-auto">
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {reports
                    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                    .slice(0, 10)
                    .map((report) => (
                      <li
                        key={report.id}
                        className="py-4 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition px-2"
                      >
                        <Link to={`/report/${report.id}`} className="block">
                          <p className="text-gray-800 dark:text-gray-200 font-medium">
                            {report.category} - {report.status}
                          </p>
                          <p className="text-sm text-gray-500">{report.address}</p>
                        </Link>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
