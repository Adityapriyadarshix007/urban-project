
import { Report, ReportCategory, ReportStatus } from "../types";

// Helper function to generate random location near a center point
const getRandomLocation = (
  centerLat: number = 40.7128,
  centerLng: number = -74.006,
  radiusKm: number = 5
) => {
  // Earth's radius in kilometers
  const earthRadius = 6371;
  
  // Convert radius from kilometers to radians
  const radiusInRadian = radiusKm / earthRadius;
  
  // Generate a random distance within the radius
  const randomDistance = Math.random() * radiusInRadian;
  
  // Generate a random angle in radians
  const randomAngle = Math.random() * Math.PI * 2;
  
  // Calculate the new position
  const lat = Math.asin(
    Math.sin(centerLat * (Math.PI / 180)) * Math.cos(randomDistance) +
    Math.cos(centerLat * (Math.PI / 180)) * Math.sin(randomDistance) * Math.cos(randomAngle)
  ) * (180 / Math.PI);
  
  const lng = ((centerLng * (Math.PI / 180) + 
    Math.atan2(
      Math.sin(randomAngle) * Math.sin(randomDistance) * Math.cos(centerLat * (Math.PI / 180)),
      Math.cos(randomDistance) - Math.sin(centerLat * (Math.PI / 180)) * Math.sin(lat * (Math.PI / 180))
    )) * (180 / Math.PI)) % 360;
  
  return { lat, lng };
};

// Sample addresses
const addresses = [
  "123 Main St",
  "456 Elm Ave",
  "789 Oak Blvd",
  "321 Pine Rd",
  "654 Maple Dr",
  "987 Cedar Ln",
  "741 Birch Way",
  "852 Spruce Ct",
  "963 Willow Pl",
  "159 Aspen Ter"
];

// Generate a mock report
const generateMockReport = (index: number): Report => {
  const categories: ReportCategory[] = ['Waste', 'Pothole', 'Leak', 'Streetlight'];
  const statuses: ReportStatus[] = ['Pending', 'In Progress', 'Fixed'];
  const randomLocation = getRandomLocation();
  
  // Generate a random date within the last 30 days
  const randomDate = new Date();
  randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 30));
  
  const category = categories[Math.floor(Math.random() * categories.length)];
  
  // Images related to the category
  let photoUrl = '/placeholder.svg';
  
  return {
    id: `report-${index}`,
    userId: `user-${Math.floor(Math.random() * 10) + 1}`,
    category,
    location: {
      ...randomLocation,
      address: addresses[Math.floor(Math.random() * addresses.length)]
    },
    photo: photoUrl,
    description: `This ${category.toLowerCase()} issue requires attention. It's causing problems in the area.`,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    timestamp: randomDate.toISOString(),
    updatedAt: new Date().toISOString(),
    assignedTo: Math.random() > 0.5 ? `worker-${Math.floor(Math.random() * 5) + 1}` : undefined
  };
};

// Generate multiple mock reports
export const mockReports: Report[] = Array.from({ length: 20 }, (_, i) => 
  generateMockReport(i)
);
