
import React from 'react';
import { Route as RouteModel } from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Route } from 'lucide-react';
import { Separator } from './ui/separator';

interface RouteDetailsProps {
  route: RouteModel;
}

const RouteDetails: React.FC<RouteDetailsProps> = ({ route }) => {
  // Format duration to hours and minutes
  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    if (hours === 0) return `${mins} min`;
    return `${hours}h ${mins}m`;
  };
  
  // Format distance to kilometers with 1 decimal
  const formatDistance = (km: number): string => {
    return `${km.toFixed(1)} km`;
  };

  // Get algorithm display name
  const getAlgorithmName = (algorithm: string): string => {
    switch (algorithm) {
      case 'dfs':
        return 'Depth-First Search';
      case 'dls':
        return 'Depth-Limited Search';
      case 'ucs':
        return 'Uniform Cost Search';
      default:
        return 'Unknown Algorithm';
    }
  };

  // Get algorithm color
  const getAlgorithmColor = (algorithm: string): string => {
    switch (algorithm) {
      case 'dfs':
        return 'bg-blue-100 text-blue-700';
      case 'dls':
        return 'bg-green-100 text-green-700';
      case 'ucs':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Route Details</CardTitle>
            <CardDescription className="flex items-center">
              <span className={`px-2 py-1 rounded-full text-xs font-medium mr-2 ${getAlgorithmColor(route.algorithm)}`}>
                {getAlgorithmName(route.algorithm)}
              </span>
              <span className="text-xs text-muted-foreground">
                {route.places.length} places • {formatDistance(route.totalDistance)} • {formatDuration(route.totalDuration)}
              </span>
            </CardDescription>
          </div>
          <div className="p-2 rounded-full bg-travel-light">
            <Route className="w-5 h-5 text-primary" />
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total Distance:</span>
            <span className="font-medium">{formatDistance(route.totalDistance)}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total Duration:</span>
            <span className="font-medium">{formatDuration(route.totalDuration)}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Places to visit:</span>
            <span className="font-medium">{route.places.length}</span>
          </div>
          
          <Separator />
          
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Route Path:</h4>
            <div className="relative">
              {route.places.map((place, index) => (
                <div key={place.id} className="flex items-start mb-4">
                  <div className="mr-3 flex flex-col items-center">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                      index === 0 ? 'bg-travel-green text-white' : 
                      index === route.places.length - 1 ? 'bg-travel-orange text-white' : 
                      'bg-primary text-white'
                    }`}>
                      {index + 1}
                    </div>
                    {index < route.places.length - 1 && (
                      <div className="h-12 w-0.5 bg-gray-200 my-1"></div>
                    )}
                  </div>
                  <div>
                    <h5 className="font-medium">{place.name}</h5>
                    {index < route.places.length - 1 && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {formatDistance(route.edges[index].distance)} • {formatDuration(route.edges[index].duration)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RouteDetails;
