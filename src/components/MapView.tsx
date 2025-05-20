'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Report } from '@/types';
import { Card } from '@/components/ui/card';

// Fix marker icon issue with Leaflet in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapViewProps {
  reports: Report[];
  selectedReport?: Report | null;
  onReportSelect?: (report: Report) => void;
}

// Component to zoom map to a position with optional zoom level
function ZoomToPosition({ lat, lng, zoom }: { lat: number; lng: number; zoom?: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], zoom ?? map.getZoom());
  }, [lat, lng, zoom, map]);
  return null;
}

// Component to zoom map to fit bounds
function ZoomToBounds({ bounds }: { bounds: L.LatLngBoundsExpression }) {
  const map = useMap();
  useEffect(() => {
    map.fitBounds(bounds, { padding: [50, 50] });
  }, [bounds, map]);
  return null;
}

export function MapView({ reports, selectedReport, onReportSelect }: MapViewProps) {
  const indiaCenter: [number, number] = [20.5937, 78.9629]; // Center on India
  const [userPosition, setUserPosition] = useState<[number, number] | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [viewAll, setViewAll] = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      setUserPosition(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserPosition([position.coords.latitude, position.coords.longitude]);
      },
      () => {
        setLocationError('Unable to retrieve your location');
        setUserPosition(null);
      }
    );
  }, []);

  // Calculate bounds including user position + all reports (for zooming out)
  const boundsPoints = [
    ...(userPosition ? [userPosition] : []),
    ...reports.map((r) => [r.location.lat, r.location.lng] as [number, number]),
  ];

  const hasBounds = boundsPoints.length > 0;
  const bounds = hasBounds ? L.latLngBounds(boundsPoints) : null;

  return (
    <Card className="relative overflow-hidden rounded-lg border shadow-sm h-[400px] md:h-[500px] lg:h-[600px] w-full bg-muted/50">
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={() => {
            if (viewAll) {
              // Going from "View All Complaints" to "Focus on My Location"
              onReportSelect?.(null);  // Clear selected report
            }
            setViewAll(!viewAll);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded shadow"
          aria-label="Toggle map view"
        >
          {viewAll ? 'Focus on My Location' : 'View All Complaints'}
        </button>
      </div>

      <MapContainer
        center={userPosition ?? indiaCenter}
        zoom={userPosition && !viewAll ? 13 : 5}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%', zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* User location marker */}
        {userPosition && (
          <Marker position={userPosition} icon={new L.Icon.Default()}>
            <Popup>Your current location</Popup>
          </Marker>
        )}

        {/* Report markers */}
        {reports.map((report) => (
          <Marker
            key={report.id}
            position={[report.location.lat, report.location.lng]}
            eventHandlers={{
              click: () => {
                onReportSelect?.(report);
              },
            }}
          >
            <Popup>
              <div className="font-medium">{report.category} Issue</div>
              <div className="text-xs mt-1">
                {report.location.address ||
                  `${report.location.lat.toFixed(4)}, ${report.location.lng.toFixed(4)}`}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Zoom behavior based on toggle and selected report */}
        {selectedReport ? (
          <ZoomToPosition
            lat={selectedReport.location.lat}
            lng={selectedReport.location.lng}
            zoom={13}
          />
        ) : viewAll && bounds ? (
          <ZoomToBounds bounds={bounds} />
        ) : userPosition ? (
          <ZoomToPosition lat={userPosition[0]} lng={userPosition[1]} zoom={13} />
        ) : null}
      </MapContainer>

      {/* Location error message */}
      {locationError && (
        <div className="absolute top-14 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-red-200 text-red-800 rounded z-20">
          {locationError}
        </div>
      )}

      {/* Selected report info overlay */}
      {selectedReport && (
        <div className="absolute bottom-4 left-0 right-0 mx-4 glass-card p-3 rounded-lg text-sm bg-white/80 backdrop-blur-sm shadow animate-fade-up z-10">
          <div className="font-medium">{selectedReport.category} Issue</div>
          <div className="text-xs text-muted-foreground mt-1">
            {selectedReport.location.address ||
              `${selectedReport.location.lat.toFixed(4)}, ${selectedReport.location.lng.toFixed(4)}`}
          </div>
        </div>
      )}
    </Card>
  );
}
