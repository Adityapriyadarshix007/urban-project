import { useState } from 'react';
import { ChevronDown, ChevronUp, CheckCircle, Clock, Loader } from 'lucide-react';
import { format } from 'date-fns';
import { Report, ReportStatus } from '@/types';
import { ReportList } from '@/components/ReportList';
import { MapView } from '@/components/MapView';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

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
  
  const pendingPercentage = calculatePercentage(pendingReports);
  const inProgressPercentage = calculatePercentage(inProgressReports);
  const fixedPercentage = calculatePercentage(fixedReports);
  
  // Group reports by category
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
  
  // Calculate category counts
  const categoryData = Object.entries(reportsByCategory).map(([category, items]) => ({
    category,
    count: items.length,
    percentage: calculatePercentage(items.length),
  }));
  
  // Get recent reports
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
              <h3 className="font-medium">{selectedReport.category} Issue at {selectedReport.location.address}</h3>
              <div className="text-sm text-muted-foreground mt-1">
                Status: {selectedReport.status} | Reported: {format(new Date(selectedReport.timestamp), 'PP')}
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="list">
          <ReportList reports={reports} />
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-5">
          <Card>
            <CardHeader>
              <CardTitle>Report Status Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <StatusProgressBar
                  label="Pending"
                  value={pendingPercentage}
                  color="bg-urban-warning"
                  count={pendingReports}
                />
                
                <StatusProgressBar
                  label="In Progress"
                  value={inProgressPercentage}
                  color="bg-urban-info"
                  count={inProgressReports}
                />
                
                <StatusProgressBar
                  label="Fixed"
                  value={fixedPercentage}
                  color="bg-urban-success"
                  count={fixedReports}
                />
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Reports by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categoryData.map(({ category, count, percentage }) => (
                    <StatusProgressBar
                      key={category}
                      label={category}
                      value={percentage}
                      color={getCategoryColor(category)}
                      count={count}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {recentReports.map((report) => (
                    <div
                      key={report.id}
                      className="flex items-center justify-between p-2 rounded-md hover:bg-muted/60"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`h-2 w-2 rounded-full ${getStatusColor(report.status)}`} />
                        <div>
                          <div className="font-medium text-sm">{report.category} Issue</div>
                          <div className="text-xs text-muted-foreground">
                            {report.location.address || 'No address'}
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-right">
                        {format(new Date(report.timestamp), 'MMM d')}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Helper Components
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
            <span
              className={
                trend.direction === 'up' ? 'text-urban-success' : 'text-urban-danger'
              }
            >
              {trend.value}%
            </span>
            <span className="text-muted-foreground ml-1">from last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface StatusProgressBarProps {
  label: string;
  value: number;
  color: string;
  count: number;
}

function StatusProgressBar({ label, value, color, count }: StatusProgressBarProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span className="text-muted-foreground">
          {count} ({value}%)
        </span>
      </div>
      <Progress value={value} className={`h-2 ${color}`} />
    </div>
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