
import React from 'react';
import { Place } from '../types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { MapPin } from 'lucide-react';

interface PlaceCardProps {
  place: Place;
  isSelected: boolean;
  order?: number;
  onToggleSelect: (place: Place) => void;
}

const PlaceCard: React.FC<PlaceCardProps> = ({ place, isSelected, order, onToggleSelect }) => {
  return (
    <Card className={`transition-all duration-200 ${isSelected ? 'border-primary shadow-md' : ''}`}>
      {place.image && (
        <div className="h-32 overflow-hidden rounded-t-lg">
          <img 
            src={place.image} 
            alt={place.name} 
            className="w-full h-full object-cover transition-all duration-500 hover:scale-105"
          />
        </div>
      )}
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{place.name}</CardTitle>
            <CardDescription className="text-sm">{place.type}</CardDescription>
          </div>
          {isSelected && order !== undefined && (
            <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
              {order + 1}
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pb-2">
        <p className="text-sm text-gray-600 line-clamp-2">{place.description}</p>
        
        {place.address && (
          <div className="flex items-start mt-2 text-xs text-gray-500">
            <MapPin className="h-3 w-3 mr-1 mt-0.5" />
            <span>{place.address}</span>
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={() => onToggleSelect(place)} 
          variant={isSelected ? "outline" : "default"}
          className="w-full"
        >
          {isSelected ? 'Remove from Route' : 'Add to Route'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PlaceCard;
