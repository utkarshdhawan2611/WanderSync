
import React, { useState, useCallback } from 'react';
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from './ui/command';
import { Place } from '../types';
import { Search } from 'lucide-react';

interface PlaceSearchProps {
  onPlaceSelect: (place: Place) => void;
}

const PlaceSearch: React.FC<PlaceSearchProps> = ({ onPlaceSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Debounced search to avoid too many API calls
  const searchPlaces = useCallback(async (query: string) => {
    if (!query || query.length < 3) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      
      // Ensure we always set an array, even if the API returns something unexpected
      setResults(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error searching places:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setShowResults(!!value && value.length > 0);
    
    if (value && value.length >= 3) {
      searchPlaces(value);
    } else {
      setResults([]);
    }
  };

  const handleSelect = (result: any) => {
    if (!result) return;
    
    try {
      const newPlace: Place = {
        id: result.place_id?.toString() || `custom-${Date.now()}`,
        name: result.display_name?.split(',')[0] || 'Unknown Place',
        description: result.display_name || '',
        coordinates: [
          parseFloat(result.lon) || 0, 
          parseFloat(result.lat) || 0
        ],
        type: 'custom'
      };
      onPlaceSelect(newPlace);
      setSearchTerm('');
      setResults([]);
      setShowResults(false);
    } catch (error) {
      console.error('Error selecting place:', error, result);
    }
  };

  return (
    <Command className="rounded-lg border shadow-md">
      <CommandInput
        placeholder="Search places..."
        value={searchTerm}
        onValueChange={handleSearch}
        onFocus={() => searchTerm.length > 0 && setShowResults(true)}
      />
      {showResults && (
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {Array.isArray(results) && results.length > 0 && (
            <CommandGroup heading="Results">
              {isLoading ? (
                <CommandItem disabled value="loading">
                  Searching...
                </CommandItem>
              ) : (
                results.map((result) => (
                  <CommandItem
                    key={result.place_id || `result-${Math.random()}`}
                    onSelect={() => handleSelect(result)}
                    value={result.display_name || String(result.place_id) || `place-${Math.random()}`}
                  >
                    <Search className="mr-2 h-4 w-4" />
                    <span>{result.display_name || 'Unknown place'}</span>
                  </CommandItem>
                ))
              )}
            </CommandGroup>
          )}
        </CommandList>
      )}
    </Command>
  );
};

export default PlaceSearch;
