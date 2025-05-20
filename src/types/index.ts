
export type ReportStatus = 'Pending' | 'In Progress' | 'Fixed';

export type ReportCategory = 'Waste' | 'Pothole' | 'Leak' | 'Streetlight';

export interface Report {
  id: string;
  userId: string;
  category: ReportCategory;
  location: {
    lat: number;
    lng: number;
    address?: string;
  };
  photo: string;
  description?: string;
  status: ReportStatus;
  timestamp: string;
  updatedAt?: string;
  assignedTo?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}
