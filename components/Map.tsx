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

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

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

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    layersRef.current.forEach(layer => layer.remove());
    layersRef.current = [];

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

    // Draw Walking Track (Line)
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

    // Major Itinerary Markers
    activities.forEach(act => {
      const marker = L.marker([act.coords.lat, act.coords.lng], { icon: poiIcon })
        .addTo(map)
        .bindPopup(`<b>${act.title}</b><br/>${act.locationName}`);
      layersRef.current.push(marker);
    });

    // POIs from GPX
    Object.entries(COORDS).forEach(([key, coord]) => {
      if (key !== 'CIVITAVECCHIA_DOCK' && key !== 'CIVITAVECCHIA_STATION') {
        const marker = L.marker([coord.lat, coord.lng], { icon: waypointIcon })
          .addTo(map)
          .bindPopup(`POI: ${key.replace('_', ' ')}`);
        layersRef.current.push(marker);
      }
    });

    // User Location
    if (userLocation) {
      const userIcon = L.divIcon({
        className: 'user-marker',
        html: '<div style="background-color: #3b82f6; width: 14px; height: 14px; border-radius: 50%; border: 2.5px solid white; box-shadow: 0 0 8px rgba(0,0,0,0.4);"></div>',
        iconSize: [14, 14]
      });
      const marker = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon, zIndexOffset: 1000 })
        .addTo(map)
        .bindPopup("Tu ubicación");
      layersRef.current.push(marker);
    }
  }, [activities, userLocation]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !focusedLocation) return;
    map.flyTo([focusedLocation.lat, focusedLocation.lng], 16, { duration: 1.2 });
  }, [focusedLocation]);

  return <div ref={mapContainerRef} className="w-full h-full z-0" />;
};

export default MapComponent;