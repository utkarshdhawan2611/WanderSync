
import mapboxgl from 'mapbox-gl';
import { Place, RouteEdge } from '../types';

export interface DirectionsResponse {
  routes: {
    distance: number;
    duration: number;
    geometry: GeoJSON.LineString;
  }[];
}

export class MapboxDirectionsService {
  private static accessToken: string = '';

  static setAccessToken(token: string) {
    this.accessToken = token;
    mapboxgl.accessToken = token;
  }

  static async getDirections(
    origin: Place,
    destination: Place,
    mode: 'driving' | 'walking' | 'cycling' = 'driving'
  ): Promise<RouteEdge | null> {
    try {
      if (!this.accessToken) {
        throw new Error('Mapbox access token is not set');
      }

      const originCoords = origin.coordinates.join(',');
      const destCoords = destination.coordinates.join(',');
      
      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/${mode}/${originCoords};${destCoords}?steps=false&geometries=geojson&access_token=${this.accessToken}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: DirectionsResponse = await response.json();
      
      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        
        return {
          from: origin.id,
          to: destination.id,
          distance: route.distance / 1000, // Convert to kilometers
          duration: route.duration / 60, // Convert to minutes
          mode,
          geometry: route.geometry
        };
      }
    } catch (error) {
      console.error('Error fetching directions:', error);
    }
    
    // If the API call fails, return a default edge
    return {
      from: origin.id,
      to: destination.id,
      distance: calculateHaversineDistance(origin.coordinates, destination.coordinates),
      duration: calculateHaversineDistance(origin.coordinates, destination.coordinates) * 1.5,
      mode,
    };
  }
  
  static async getMultiPointDirections(
    places: Place[],
    mode: 'driving' | 'walking' | 'cycling' = 'driving'
  ): Promise<{ route: GeoJSON.LineString, distance: number, duration: number } | null> {
    if (places.length < 2) return null;
    
    try {
      if (!this.accessToken) {
        throw new Error('Mapbox access token is not set');
      }

      const coordinates = places.map(place => place.coordinates.join(',')).join(';');
      
      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/${mode}/${coordinates}?steps=false&geometries=geojson&access_token=${this.accessToken}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: DirectionsResponse = await response.json();
      
      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        
        return {
          route: route.geometry,
          distance: route.distance / 1000, // Convert to kilometers
          duration: route.duration / 60 // Convert to minutes
        };
      }
    } catch (error) {
      console.error('Error fetching multi-point directions:', error);
    }
    
    return null;
  }
  
  static async generateEdgesForPlaces(
    places: Place[],
    mode: 'driving' | 'walking' | 'cycling' = 'driving'
  ): Promise<RouteEdge[]> {
    const edges: RouteEdge[] = [];
    
    for (let i = 0; i < places.length; i++) {
      for (let j = 0; j < places.length; j++) {
        if (i !== j) {
          const edge = await this.getDirections(places[i], places[j], mode);
          if (edge) edges.push(edge);
        }
      }
    }
    
    return edges;
  }
}

// Haversine formula to calculate distance between coordinates in kilometers
function calculateHaversineDistance(
  coords1: [number, number],
  coords2: [number, number]
): number {
  const [lon1, lat1] = coords1;
  const [lon2, lat2] = coords2;
  
  const R = 6371; // Earth radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
    
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  
  return distance;
}
