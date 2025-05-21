import { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Clock,
  Loader,
} from 'lucide-react';
import { format } from 'date-fns';
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer,
} from 'recharts';
import { Report, ReportStatus } from '@/types';
import { ReportList } from '@/components/ReportList';
import { MapView } from '@/components/MapView';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

interface AdminDashboardProps {
  reports: Report[];
}

export function AdminDashboard({ reports }: AdminDashboardProps) {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  const totalReports = reports.length;
  const pendingReports = reports.filter((r) => r.status === 'Pending').length;
  const inProgressReports = reports.filter((r) => r.status === 'In Progress').length;
  const fixedReports = reports.filter((r) => r.status === 'Fixed').length;

  const calculatePercentage = (value: number) => {
    return totalReports > 0 ? Math.round((value / totalReports) * 100) : 0;
  };

  const reportsByCategory = reports.reduce(
    (acc, report) => {
      const { category } = report;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(report);
      return acc;
    },
    {} as Record<string, Report[]>
  );

  const categoryData = Object.entries(reportsByCategory).map(([category, items]) => ({
    category,
    count: items.length,
    percentage: calculatePercentage(items.length),
  }));

  const recentReports = [...reports]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Reports"
          value={totalReports}
          trend={{ value: 12, direction: 'up' }}
        />
        <StatCard
          title="Pending"
          value={pendingReports}
          iconColor="text-urban-warning"
          icon={<Clock className="h-4 w-4" />}
          trend={{ value: 5, direction: 'up' }}
        />
        <StatCard
          title="In Progress"
          value={inProgressReports}
          iconColor="text-urban-info"
          icon={<Loader className="h-4 w-4" />}
          trend={{ value: 8, direction: 'up' }}
        />
        <StatCard
          title="Fixed"
          value={fixedReports}
          iconColor="text-urban-success"
          icon={<CheckCircle className="h-4 w-4" />}
          trend={{ value: 3, direction: 'up' }}
        />
      </div>

      <Tabs defaultValue="map" className="space-y-4">
        <TabsList>
          <TabsTrigger value="map">Map View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="map" className="space-y-4">
          <MapView
            reports={reports}
            selectedReport={selectedReport}
            onReportSelect={setSelectedReport}
          />
          {selectedReport && (
            <div className="bg-muted/40 p-3 rounded-md animate-fade-in">
              <h3 className="font-medium">
                {selectedReport.category} Issue at {selectedReport.location.address}
              </h3>
              <div className="text-sm text-muted-foreground mt-1">
                Status: {selectedReport.status} | Reported:{' '}
                {format(new Date(selectedReport.timestamp), 'PP')}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="list">
          <ReportList reports={reports} />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Pie Chart for Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Report Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Pending', value: pendingReports },
                        { name: 'In Progress', value: inProgressReports },
                        { name: 'Fixed', value: fixedReports },
                      ]}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      fill="#8884d8"
                      label
                    >
                      <Cell fill="#facc15" />
                      <Cell fill="#3b82f6" />
                      <Cell fill="#22c55e" />
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Bar Chart for Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Reports by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={categoryData}>
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#6366f1" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Stat Card Component
interface StatCardProps {
  title: string;
  value: number;
  iconColor?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
}

function StatCard({ title, value, iconColor, icon, trend }: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h2 className="text-3xl font-bold mt-2">{value}</h2>
          </div>
          {icon && (
            <div className={`p-2 rounded-full bg-muted/60 ${iconColor}`}>
              {icon}
            </div>
          )}
        </div>
        {trend && (
          <div className="mt-4 flex items-center text-xs">
            {trend.direction === 'up' ? (
              <ChevronUp className="h-3 w-3 text-urban-success mr-1" />
            ) : (
              <ChevronDown className="h-3 w-3 text-urban-danger mr-1" />
            )}
            <span className={trend.direction === 'up' ? 'text-urban-success' : 'text-urban-danger'}>
              {trend.value}%
            </span>
            <span className="text-muted-foreground ml-1">from last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Helper functions
function getStatusColor(status: ReportStatus): string {
  switch (status) {
    case 'Pending':
      return 'bg-urban-warning';
    case 'In Progress':
      return 'bg-urban-info';
    case 'Fixed':
      return 'bg-urban-success';
    default:
      return 'bg-muted-foreground';
  }
}

function getCategoryColor(category: string): string {
  switch (category) {
    case 'Waste':
      return 'bg-amber-500';
    case 'Pothole':
      return 'bg-red-500';
    case 'Leak':
      return 'bg-blue-500';
    case 'Streetlight':
      return 'bg-yellow-400';
    default:
      return 'bg-gray-500';
  }
}
