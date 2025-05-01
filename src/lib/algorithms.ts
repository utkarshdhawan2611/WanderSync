
import { Place, RouteEdge, Route } from '../types';

// Helper to get all edges from a specific place
const getEdgesFromPlace = (placeId: string, edges: RouteEdge[]): RouteEdge[] => {
  return edges.filter(edge => edge.from === placeId);
};

// Depth-First Search (DFS) algorithm - Focuses on exploring deep paths first
export const dfs = (
  startPlaceId: string,
  places: Place[],
  edges: RouteEdge[],
  maxDepth: number = Infinity
): Route | null => {
  // Create deep copies to prevent state issues
  const allPlaces = new Map<string, Place>();
  places.forEach(place => allPlaces.set(place.id, JSON.parse(JSON.stringify(place))));
  
  const placesToVisit = new Set<string>(places.map(place => place.id));
  const path: string[] = [];
  const routeEdges: RouteEdge[] = [];
  
  // Reset visit state each time the function is called
  const visited = new Set<string>();
  
  const dfsVisit = (currentId: string, depth: number): boolean => {
    if (depth > maxDepth) return false;
    
    path.push(currentId);
    placesToVisit.delete(currentId);
    visited.add(currentId);
    
    if (placesToVisit.size === 0) return true;
    
    // Get all outgoing edges from current place
    const outgoingEdges = getEdgesFromPlace(currentId, edges)
      .filter(edge => placesToVisit.has(edge.to))
      .sort((a, b) => a.distance - b.distance);
    
    // DFS prioritizes depth, so take the first valid edge and go deeper
    for (const edge of outgoingEdges) {
      routeEdges.push(JSON.parse(JSON.stringify(edge)));
      if (dfsVisit(edge.to, depth + 1)) return true;
      routeEdges.pop();
    }
    
    // Backtrack: add place back and remove from path
    placesToVisit.add(currentId);
    path.pop();
    visited.delete(currentId);
    return false;
  };
  
  // Start the search
  if (dfsVisit(startPlaceId, 0)) {
    const routePlaces = path.map(id => allPlaces.get(id)!);
    let totalDistance = 0;
    let totalDuration = 0;
    
    for (const edge of routeEdges) {
      totalDistance += edge.distance;
      totalDuration += edge.duration;
    }
    
    return { 
      places: routePlaces, 
      edges: routeEdges, 
      totalDistance: Number(totalDistance.toFixed(2)), 
      totalDuration: Math.round(totalDuration), 
      algorithm: 'dfs' 
    };
  }
  
  return null;
};

// Depth-Limited Search (DLS) - Limits the exploration depth
export const dls = (
  startPlaceId: string,
  places: Place[],
  edges: RouteEdge[],
  depthLimit: number
): Route | null => {
  // Create deep copies to prevent state issues
  const placesCopy = JSON.parse(JSON.stringify(places)) as Place[];
  const edgesCopy = JSON.parse(JSON.stringify(edges)) as RouteEdge[];
  
  // Custom implementation for DLS
  const allPlaces = new Map<string, Place>();
  placesCopy.forEach(place => allPlaces.set(place.id, place));
  
  const placesToVisit = new Set<string>(placesCopy.map(place => place.id));
  const path: string[] = [];
  const routeEdges: RouteEdge[] = [];
  
  // Reset visit state each time the function is called
  const visited = new Set<string>();
  
  const dlsVisit = (currentId: string, depth: number): boolean => {
    if (depth >= depthLimit) return placesToVisit.size === 0;
    
    path.push(currentId);
    placesToVisit.delete(currentId);
    visited.add(currentId);
    
    if (placesToVisit.size === 0) return true;
    
    // Get all outgoing edges from current place - for DLS we prioritize shortest paths
    const outgoingEdges = getEdgesFromPlace(currentId, edgesCopy)
      .filter(edge => placesToVisit.has(edge.to))
      .sort((a, b) => b.distance - a.distance); // Deliberately different from DFS (reversed sort)
    
    for (const edge of outgoingEdges) {
      routeEdges.push(edge);
      if (dlsVisit(edge.to, depth + 1)) return true;
      routeEdges.pop();
    }
    
    // Backtrack: add place back and remove from path
    placesToVisit.add(currentId);
    path.pop();
    visited.delete(currentId);
    return false;
  };
  
  // Start the search
  if (dlsVisit(startPlaceId, 0)) {
    const routePlaces = path.map(id => allPlaces.get(id)!);
    let totalDistance = 0;
    let totalDuration = 0;
    
    for (const edge of routeEdges) {
      totalDistance += edge.distance;
      totalDuration += edge.duration;
    }
    
    return { 
      places: routePlaces, 
      edges: routeEdges, 
      totalDistance: Number(totalDistance.toFixed(2)), 
      totalDuration: Math.round(totalDuration), 
      algorithm: 'dls' 
    };
  }
  
  return null;
};

// Uniform Cost Search (UCS) - Finds the optimal path based on total cost
export const ucs = (
  startPlaceId: string,
  places: Place[],
  edges: RouteEdge[],
  useDuration: boolean = false
): Route | null => {
  // Create deep copies to prevent state issues
  const placesCopy = JSON.parse(JSON.stringify(places)) as Place[];
  const edgesCopy = JSON.parse(JSON.stringify(edges)) as RouteEdge[];
  
  const allPlaces = new Map<string, Place>();
  placesCopy.forEach(place => allPlaces.set(place.id, place));
  
  // Priority queue for UCS
  interface QueueItem {
    placeId: string;
    pathCost: number;
    visited: Set<string>;
    path: string[];
    pathEdges: RouteEdge[];
  }
  
  // Initialize queue with start place
  const queue: QueueItem[] = [{
    placeId: startPlaceId,
    pathCost: 0,
    visited: new Set([startPlaceId]),
    path: [startPlaceId],
    pathEdges: []
  }];
  
  // Track explored states
  const explored = new Map<string, number>();
  
  while (queue.length > 0) {
    // Sort by path cost and get the lowest cost item
    queue.sort((a, b) => a.pathCost - b.pathCost);
    const current = queue.shift()!;
    
    // Check if we've found a complete tour (visited all places)
    if (current.visited.size === places.length) {
      const routePlaces = current.path.map(id => allPlaces.get(id)!);
      
      return {
        places: routePlaces,
        edges: current.pathEdges,
        totalDistance: Number(current.pathEdges.reduce((sum, edge) => sum + edge.distance, 0).toFixed(2)),
        totalDuration: Math.round(current.pathEdges.reduce((sum, edge) => sum + edge.duration, 0)),
        algorithm: 'ucs'
      };
    }
    
    // Generate a state key for the current state
    const stateKey = `${current.placeId}:${[...current.visited].sort().join(',')}`;
    
    // Skip if we've already explored this state with lower cost
    if (explored.has(stateKey) && explored.get(stateKey)! <= current.pathCost) {
      continue;
    }
    
    // Mark the current state as explored
    explored.set(stateKey, current.pathCost);
    
    // Get outgoing edges
    const outgoingEdges = edgesCopy.filter(edge => 
      edge.from === current.placeId && !current.visited.has(edge.to)
    );
    
    // Add each possibility to the queue
    for (const edge of outgoingEdges) {
      const cost = useDuration ? edge.duration : edge.distance;
      const newPathCost = current.pathCost + cost;
      
      // Create new Sets and arrays to avoid mutation issues
      const newVisited = new Set(current.visited);
      newVisited.add(edge.to);
      
      queue.push({
        placeId: edge.to,
        pathCost: newPathCost,
        visited: newVisited,
        path: [...current.path, edge.to],
        pathEdges: [...current.pathEdges, JSON.parse(JSON.stringify(edge))]
      });
    }
  }
  
  return null;
};

// Function to find the best route between selected places
export const findBestRoute = (
  selectedPlaces: Place[],
  allEdges: RouteEdge[],
  algorithm: 'dfs' | 'ucs' | 'dls',
  optimizeFor: 'distance' | 'duration' = 'distance',
  depthLimit?: number
): Route | null => {
  if (selectedPlaces.length < 2) return null;
  
  console.log(`Finding route using algorithm: ${algorithm}`);
  
  // Always create a deep copy to prevent state mutations
  const startPlace = selectedPlaces[0];
  
  // Filter edges to only include those between selected places
  const selectedPlaceIds = new Set(selectedPlaces.map(p => p.id));
  const filteredEdges = allEdges.filter(
    edge => selectedPlaceIds.has(edge.from) && selectedPlaceIds.has(edge.to)
  );
  
  // Using deep clones to ensure we don't have state issues between algorithm runs
  const placesCopy = JSON.parse(JSON.stringify(selectedPlaces)) as Place[];
  const edgesCopy = JSON.parse(JSON.stringify(filteredEdges)) as RouteEdge[];
  
  let result: Route | null = null;
  
  // Using deep clones to ensure we don't have state issues between algorithm runs
  if (algorithm === 'dfs') {
    result = dfs(startPlace.id, placesCopy, edgesCopy);
  } else if (algorithm === 'dls') {
    result = dls(startPlace.id, placesCopy, edgesCopy, depthLimit || 3);
  } else {
    result = ucs(startPlace.id, placesCopy, edgesCopy, optimizeFor === 'duration');
  }
  
  if (result) {
    console.log(`Route found with algorithm ${algorithm}:`, 
      {
        places: result.places.map(p => p.name),
        totalDistance: result.totalDistance,
        totalDuration: result.totalDuration
      }
    );
  }
  
  return result;
};

// Function to generate edges between all places
export const generateEdges = async (places: Place[], mode: 'driving' | 'walking' | 'cycling' = 'driving'): Promise<RouteEdge[]> => {
  const edges: RouteEdge[] = [];
  
  if (places.length < 2) return edges;
  
  // Generate all possible pairs of places
  for (let i = 0; i < places.length; i++) {
    for (let j = 0; j < places.length; j++) {
      if (i !== j) {
        const fromPlace = places[i];
        const toPlace = places[j];
        
        // Create edge with estimated values based on the mode
        const distance = calculateHaversineDistance(fromPlace.coordinates, toPlace.coordinates);
        let duration = 0;
        
        // Calculate duration based on mode with more realistic values
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
        
        const edge: RouteEdge = {
          from: fromPlace.id,
          to: toPlace.id,
          distance: Number(distance.toFixed(2)),
          duration: Math.round(duration),
          mode: mode,
        };
        
        edges.push(edge);
      }
    }
  }
  
  return edges;
};

// Haversine formula to calculate distance between coordinates in kilometers
const calculateHaversineDistance = (
  coords1: [number, number],
  coords2: [number, number]
): number => {
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
};
