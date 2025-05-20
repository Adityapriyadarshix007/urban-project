import {
  Clock,
  MapPin,
  CheckCircle,
  AlertCircle,
  Loader,
  Trash2,
  Droplet,
  LampFloor
} from 'lucide-react';
import { format } from 'date-fns';
import { Report } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

interface ReportCardProps {
  report: Report;
  viewMode?: 'compact' | 'full';
  onClick?: () => void;
}

export function ReportCard({ report, viewMode = 'full', onClick }: ReportCardProps) {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Waste':
        return <Trash2 className="h-5 w-5" />;
      case 'Pothole':
        return <AlertCircle className="h-5 w-5" />;
      case 'Leak':
        return <Droplet className="h-5 w-5" />;
      case 'Streetlight':
        return <LampFloor className="h-5 w-5" />;
      default:
        return <AlertCircle className="h-5 w-5" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending':
        return (
          <Badge className="status-pending flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>Pending</span>
          </Badge>
        );
      case 'In Progress':
        return (
          <Badge className="status-in-progress flex items-center gap-1">
            <Loader className="h-3 w-3" />
            <span>In Progress</span>
          </Badge>
        );
      case 'Fixed':
        return (
          <Badge className="status-fixed flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            <span>Fixed</span>
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getFormattedDate = (value: any): string => {
    try {
      const date = value?.toDate?.() || new Date(value);
      return isNaN(date.getTime()) ? 'Unknown' : format(date, 'MMM d, yyyy');
    } catch {
      return 'Unknown';
    }
  };

  const getLocationText = () => {
    if (report.location?.address) return report.location.address;
    if (report.location?.lat && report.location?.lng) {
      return `${report.location.lat.toFixed(4)}, ${report.location.lng.toFixed(4)}`;
    }
    return 'Unknown location';
  };

  return (
    <Card
      className={`overflow-hidden transition-all duration-300 ${onClick ? 'cursor-pointer hover:shadow-md' : ''}`}
      onClick={onClick}
    >
      <div className="flex flex-col sm:flex-row">
        {viewMode === 'full' && (
          <div className="relative w-full sm:w-1/3 min-h-[10rem] bg-muted">
            <img
              src={report.photo || '/placeholder.svg'}
              alt={`${report.category} issue`}
              className="w-20 h-20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            />
            <div className="absolute top-2 left-2">
              {report.status && getStatusBadge(report.status)}
            </div>
          </div>
        )}

        <div className="flex flex-col flex-1">
          <CardHeader className="flex flex-row items-center justify-between p-4">
            <div className="flex items-center space-x-2">
              <div className="p-1 bg-muted/80 rounded-full">
                {getCategoryIcon(report.category)}
              </div>
              <div>
                <h4 className="font-medium text-base">{report.category} Issue</h4>
                {viewMode === 'compact' && report.status && (
                  <div className="mt-1">
                    {getStatusBadge(report.status)}
                  </div>
                )}
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              {getFormattedDate(report.timestamp)}
            </div>
          </CardHeader>

          <CardContent className="p-4 pt-0">
            {report.description && viewMode === 'full' && (
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {report.description}
              </p>
            )}

            <div className="flex items-center text-xs text-muted-foreground">
              <MapPin className="h-3 w-3 mr-1" />
              <span className="truncate">{getLocationText()}</span>
            </div>
          </CardContent>

          {viewMode === 'full' && (
            <CardFooter className="p-4 pt-0 flex items-center justify-between">
              <div className="text-xs text-muted-foreground">
                Updated: {getFormattedDate(report.updatedAt || report.timestamp)}
              </div>
              {report.assignedTo && (
                <Badge variant="outline" className="text-xs">
                  Assigned
                </Badge>
              )}
            </CardFooter>
          )}
        </div>
      </div>
    </Card>
  );
}
