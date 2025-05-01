
import { Place, RouteEdge } from '../types';

export class DirectionsService {
  static async getDirections(
    origin: Place,
    destination: Place,
    mode: 'driving' | 'walking' | 'cycling' = 'driving'
  ): Promise<RouteEdge> {
    // Calculate distance using Haversine formula
    const distance = calculateHaversineDistance(origin.coordinates, destination.coordinates);
    
    // Calculate duration based on mode with more realistic speeds
    // Average speeds: driving ~60 km/h, cycling ~15 km/h, walking ~5 km/h
    let duration = 0;
    switch (mode) {
      case 'driving':
        duration = (distance / 60) * 60; // 60 km/h = 1 km per minute
        break;
      case 'cycling':
        duration = (distance / 15) * 60; // 15 km/h = 0.25 km per minute
        break;
      case 'walking':
        duration = (distance / 5) * 60; // 5 km/h = 0.083 km per minute
        break;
    }
    
    return {
      from: origin.id,
      to: destination.id,
      distance: distance,
      duration: Math.round(duration), // Round to whole minutes
      mode,
    };
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
          edges.push(edge);
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
  
  return Number(distance.toFixed(2)); // Round to 2 decimal places
}
