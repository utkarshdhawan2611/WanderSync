
export interface Place {
  id: string;
  name: string;
  description: string;
  coordinates: [number, number]; // [longitude, latitude]
  type: 'attraction' | 'restaurant' | 'hotel' | 'transport' | 'custom';
  address?: string;
  image?: string;
  placeId?: string; // For storing API-specific place IDs
}

export interface RouteEdge {
  from: string;
  to: string;
  distance: number; // in kilometers
  duration: number; // in minutes
  mode: 'driving' | 'walking' | 'cycling' | 'transit';
  geometry?: GeoJSON.LineString; // Store the actual route geometry from the API
}

export interface Route {
  places: Place[];
  edges: RouteEdge[];
  totalDistance: number;
  totalDuration: number;
  algorithm: 'dfs' | 'ucs' | 'dls';
}

export interface Itinerary {
  id: string;
  name: string;
  description: string;
  date: string;
  route: Route;
  createdAt: string;
}
