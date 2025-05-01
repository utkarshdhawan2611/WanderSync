
import React from 'react';
import { Itinerary } from '../types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { format } from 'date-fns';

interface SavedItineraryCardProps {
  itinerary: Itinerary;
  onSelect: (itinerary: Itinerary) => void;
  onDelete: (id: string) => void;
}

const SavedItineraryCard: React.FC<SavedItineraryCardProps> = ({ itinerary, onSelect, onDelete }) => {
  // Format date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'PP');
    } catch (e) {
      return dateString;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex justify-between">
          <span>{itinerary.name}</span>
          <span className="text-sm font-normal text-muted-foreground">
            {formatDate(itinerary.date)}
          </span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="py-2">
        <p className="text-sm text-gray-600 line-clamp-2">{itinerary.description}</p>
        
        <div className="mt-2 flex items-center space-x-1 text-xs text-gray-500">
          <span className="font-semibold">{itinerary.route.places.length} places</span>
          <span>•</span>
          <span>{itinerary.route.totalDistance.toFixed(1)} km</span>
          <span>•</span>
          <span>
            {Math.floor(itinerary.route.totalDuration / 60)}h {Math.round(itinerary.route.totalDuration % 60)}m
          </span>
        </div>
      </CardContent>
      
      <CardFooter className="pt-2 flex justify-between">
        <Button 
          onClick={() => onSelect(itinerary)} 
          variant="secondary"
          size="sm"
        >
          Load Route
        </Button>
        <Button 
          onClick={() => onDelete(itinerary.id)} 
          variant="ghost"
          size="sm"
          className="text-destructive hover:text-destructive"
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SavedItineraryCard;
