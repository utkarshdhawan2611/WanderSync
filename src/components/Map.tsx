
import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Place, Route } from '../types';
import { Button } from './ui/button';
import L from 'leaflet';

// Fix Leaflet default icon path issues
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Use a proper map controller to handle bounds and centering
const SetViewOnPlaces = ({ places }: { places: Place[] }) => {
  const map = useMap();
  
  useEffect(() => {
    if (places.length > 0) {
      const bounds = L.latLngBounds(places.map(place => [place.coordinates[1], place.coordinates[0]]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [places, map]);
  
  return null;
};

interface MapProps {
  places: Place[];
  selectedPlaces: Place[];
  currentRoute: Route | null;
  onPlaceSelect: (place: Place) => void;
}

const MapComponent: React.FC<MapProps> = ({ places, selectedPlaces, currentRoute, onPlaceSelect }) => {
  const defaultCenter: [number, number] = [48.8566, 2.3522]; // Paris coordinates
  
  // Create route coordinates for the polyline
  const routeCoordinates = currentRoute?.places.map(place => [place.coordinates[1], place.coordinates[0]]) || [];
  
  // Create outline coordinates (including closing the loop)
  const outlineCoordinates = selectedPlaces.length > 0 
    ? [...selectedPlaces.map(place => [place.coordinates[1], place.coordinates[0]]), 
       [selectedPlaces[0].coordinates[1], selectedPlaces[0].coordinates[0]]]
    : [];

  // Get route style based on algorithm
  const getRouteStyle = (algorithm: string) => {
    switch (algorithm) {
      case 'dfs':
        return { color: '#1a73e8', weight: 4, opacity: 0.8 };
      case 'dls':
        return { color: '#34a853', weight: 4, opacity: 0.8 };
      case 'ucs':
        return { color: '#ea4335', weight: 4, opacity: 0.8, dashArray: '10,5' };
      default:
        return { color: '#1a73e8', weight: 4, opacity: 0.8 };
    }
  };

  return (
    <div className="w-full h-full">
      <MapContainer
        className="w-full h-full rounded-lg"
        defaultCenter={defaultCenter}
        zoom={5}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <SetViewOnPlaces places={places.length > 0 ? places : [{ coordinates: [defaultCenter[1], defaultCenter[0]] } as Place]} />
        
        {/* Display all places as markers */}
        {places.map((place) => {
          const isSelected = selectedPlaces.some(p => p.id === place.id);
          
          return (
            <Marker 
              key={place.id}
              position={[place.coordinates[1], place.coordinates[0]]}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-bold text-base mb-1">{place.name}</h3>
                  <p className="text-sm text-gray-600">{place.description}</p>
                  <Button 
                    onClick={() => onPlaceSelect(place)}
                    className="mt-2"
                    variant="outline"
                    size="sm"
                  >
                    {isSelected ? 'Remove from Route' : 'Add to Route'}
                  </Button>
                </div>
              </Popup>
            </Marker>
          );
        })}
        
        {/* Display the route if it exists with algorithm-specific styling */}
        {currentRoute && routeCoordinates.length > 1 && (
          <Polyline
            positions={routeCoordinates as [number, number][]}
            pathOptions={getRouteStyle(currentRoute.algorithm)}
          />
        )}
        
        {/* Display the outline for selected places */}
        {outlineCoordinates.length > 0 && (
          <Polyline
            positions={outlineCoordinates as [number, number][]}
            pathOptions={{ color: '#6E59A5', weight: 2, opacity: 0.7, dashArray: '5,10' }}
          />
        )}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
