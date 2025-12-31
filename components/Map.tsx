import React, { useEffect, useRef } from 'react';
import { Activity } from '../types';
import L from 'leaflet';
import { WALKING_TRACK_COORDS, COORDS } from '../constants';

// Fix for default Leaflet markers in React
const iconUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';
const iconRetinaUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png';
const shadowUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png';

interface MapProps {
  activities: Activity[];
  userLocation: { lat: number, lng: number } | null;
  focusedLocation: { lat: number, lng: number } | null;
}

const MapComponent: React.FC<MapProps> = ({ activities, userLocation, focusedLocation }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layersRef = useRef<L.Layer[]>([]);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Center on Rome center by default
    const map = L.map(mapContainerRef.current, { zoomControl: false }).setView([41.895, 12.48], 14);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; CARTO &copy; OpenStreetMap',
      maxZoom: 18,
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Markers and Routes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing layers
    layersRef.current.forEach(layer => layer.remove());
    layersRef.current = [];

    // Define icons
    const poiIcon = L.divIcon({
      className: 'poi-marker',
      html: '<div style="background-color: #8B0000; width: 8px; height: 8px; border-radius: 50%; border: 1.5px solid white; box-shadow: 0 0 3px rgba(0,0,0,0.3);"></div>',
      iconSize: [8, 8]
    });

    const waypointIcon = L.divIcon({
      className: 'waypoint-marker',
      html: '<div style="background-color: #D4AF37; width: 6px; height: 6px; border-radius: 50%; border: 1px solid white;"></div>',
      iconSize: [6, 6]
    });

    // Draw Walking Track from GPX data
    if (WALKING_TRACK_COORDS.length > 0) {
      const walkingTrack = L.polyline(WALKING_TRACK_COORDS, {
        color: '#D4AF37',
        weight: 4,
        opacity: 0.7,
        dashArray: '8, 8',
        lineCap: 'round'
      }).addTo(map);
      layersRef.current.push(walkingTrack);
    }

    // Add Key Activity Markers
    activities.forEach(act => {
      const marker = L.marker([act.coords.lat, act.coords.lng], { icon: poiIcon })
        .addTo(map)
        .bindPopup(`<b>${act.title}</b><br/>${act.locationName}`);
      layersRef.current.push(marker);
    });

    // Add all POIs from the GPX waypoints list for context
    Object.entries(COORDS).forEach(([key, coord]) => {
      // Avoid duplicating main activity locations
      const name = key.replace(/_/g, ' ');
      const marker = L.marker([coord.lat, coord.lng], { icon: waypointIcon })
        .addTo(map)
        .bindPopup(`<span style="font-size: 10px; font-weight: bold; color: #8b0000;">${name}</span>`);
      layersRef.current.push(marker);
    });

    // User Location Marker
    if (userLocation) {
      const userIcon = L.divIcon({
        className: 'user-marker',
        html: '<div style="background-color: #3b82f6; width: 14px; height: 14px; border-radius: 50%; border: 2.5px solid white; box-shadow: 0 0 8px rgba(0,0,0,0.4);"></div>',
        iconSize: [14, 14]
      });
      const marker = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon, zIndexOffset: 1000 })
        .addTo(map)
        .bindPopup("Estás aquí");
      layersRef.current.push(marker);
    }
  }, [activities, userLocation]);

  // Focus Logic
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !focusedLocation) return;

    map.flyTo([focusedLocation.lat, focusedLocation.lng], 16, {
      duration: 1.2
    });
  }, [focusedLocation]);

  return <div ref={mapContainerRef} className="w-full h-full z-0" />;
};

export default MapComponent;
