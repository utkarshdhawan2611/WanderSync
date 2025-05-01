import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import MapComponent from '../components/Map';
import PlaceCard from '../components/PlaceCard';
import RouteDetails from '../components/RouteDetails';
import SaveItineraryDialog from '../components/SaveItineraryDialog';
import { Place, Route, RouteEdge, Itinerary } from '../types';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Separator } from '../components/ui/separator';
import { findBestRoute, generateEdges } from '../lib/algorithms';
import { samplePlaces, sampleEdges } from '../lib/sample-data';
import { addItinerary } from '../lib/storage';
import { useToast } from '../hooks/use-toast';
import { Route as RouteIcon, MapPin, Navigation } from 'lucide-react';
import { DirectionsService } from '../services/DirectionsService';

const PlannerPage: React.FC = () => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [selectedPlaces, setSelectedPlaces] = useState<Place[]>([]);
  const [currentRoute, setCurrentRoute] = useState<Route | null>(null);
  const [algorithm, setAlgorithm] = useState<'dfs' | 'ucs' | 'dls'>('dfs');
  const [optimizeFor, setOptimizeFor] = useState<'distance' | 'duration'>('distance');
  const [travelMode, setTravelMode] = useState<'driving' | 'walking' | 'cycling'>('driving');
  const [edges, setEdges] = useState<RouteEdge[]>(sampleEdges);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setPlaces(samplePlaces);

    const savedItinerary = localStorage.getItem('selected-itinerary');
    if (savedItinerary) {
      try {
        const itinerary: Itinerary = JSON.parse(savedItinerary);
        setSelectedPlaces(itinerary.route.places);
        setCurrentRoute(itinerary.route);
        setAlgorithm(itinerary.route.algorithm);
        
        toast({
          title: "Itinerary loaded",
          description: `"${itinerary.name}" has been loaded successfully.`,
        });
        
        localStorage.removeItem('selected-itinerary');
      } catch (error) {
        console.error("Error loading saved itinerary:", error);
        toast({
          title: "Error loading itinerary",
          description: "There was a problem loading the saved itinerary.",
          variant: "destructive"
        });
      }
    }
  }, [toast]);

  const handleTogglePlaceSelection = (place: Place) => {
    setSelectedPlaces(prev => {
      const isSelected = prev.some(p => p.id === place.id);
      
      if (isSelected) {
        return prev.filter(p => p.id !== place.id);
      } else {
        return [...prev, place];
      }
    });
    
    setCurrentRoute(null);
  };

  const generateRouteEdges = async () => {
    if (selectedPlaces.length < 2) {
      toast({
        title: "Not enough places selected",
        description: "Please select at least 2 places to generate edges.",
        variant: "destructive"
      });
      return [];
    }

    try {
      return await DirectionsService.generateEdgesForPlaces(selectedPlaces, travelMode);
    } catch (error) {
      console.error("Error generating edges:", error);
      toast({
        title: "Error generating edges",
        description: "There was an error generating the edges. Using estimated distances instead.",
        variant: "destructive"
      });
      return await generateEdges(selectedPlaces, travelMode);
    }
  };

  const handleFindRoute = async () => {
    if (selectedPlaces.length < 2) {
      toast({
        title: "Not enough places selected",
        description: "Please select at least 2 places to find a route.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const routeEdges = await generateRouteEdges();
      
      if (routeEdges.length > 0) {
        const route = findBestRoute(
          JSON.parse(JSON.stringify(selectedPlaces)), 
          routeEdges,
          algorithm,
          optimizeFor,
          algorithm === 'dls' ? 5 : undefined
        );

        if (route) {
          setCurrentRoute(route);
          toast({
            title: "Route found!",
            description: `Found a route visiting ${route.places.length} places using ${algorithm.toUpperCase()}.`,
          });
        } else {
          toast({
            title: "Could not find a route",
            description: "Try selecting different places or changing the algorithm.",
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      console.error("Error finding route:", error);
      toast({
        title: "Error finding route",
        description: "There was an error finding the route. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveItinerary = (data: Omit<Itinerary, 'id' | 'createdAt'>) => {
    if (!currentRoute) return;
    
    const newItinerary = addItinerary({
      ...data,
      route: currentRoute
    });
    
    toast({
      title: "Itinerary saved",
      description: `"${newItinerary.name}" has been saved to your itineraries.`,
    });
  };

  return (
    <Layout>
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Plan Your Trip</h1>
            <p className="text-muted-foreground">Select destinations, find optimal routes, and save your itinerary.</p>
          </div>
          
          <div className="flex items-center space-x-2">
            {currentRoute && (
              <SaveItineraryDialog 
                route={currentRoute} 
                onSave={handleSaveItinerary} 
                trigger={
                  <Button variant="outline">
                    Save Itinerary
                  </Button>
                }
              />
            )}
            
            <Button 
              onClick={handleFindRoute}
              disabled={selectedPlaces.length < 2 || isLoading}
            >
              {isLoading ? (
                <span className="mr-2">Loading...</span>
              ) : (
                <RouteIcon className="h-4 w-4 mr-2" />
              )}
              Find Best Route
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Options</CardTitle>
                <CardDescription>Configure your route settings</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Algorithm</label>
                  <Tabs 
                    defaultValue={algorithm} 
                    value={algorithm}
                    onValueChange={(val) => setAlgorithm(val as 'dfs' | 'ucs' | 'dls')}
                    className="w-full"
                  >
                    <TabsList className="w-full">
                      <TabsTrigger value="dfs" className="w-1/3">DFS</TabsTrigger>
                      <TabsTrigger value="dls" className="w-1/3">DLS</TabsTrigger>
                      <TabsTrigger value="ucs" className="w-1/3">UCS</TabsTrigger>
                    </TabsList>
                    <TabsContent value="dfs">
                      <p className="text-sm text-muted-foreground pt-2">
                        Depth-First Search: Explores as far as possible along each branch before backtracking.
                      </p>
                    </TabsContent>
                    <TabsContent value="dls">
                      <p className="text-sm text-muted-foreground pt-2">
                        Depth-Limited Search: Like DFS, but with a maximum depth limit (5 in this case).
                      </p>
                    </TabsContent>
                    <TabsContent value="ucs">
                      <p className="text-sm text-muted-foreground pt-2">
                        Uniform Cost Search: Finds the path with the lowest total cost.
                      </p>
                    </TabsContent>
                  </Tabs>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Optimize For</label>
                  <Tabs 
                    defaultValue={optimizeFor} 
                    value={optimizeFor}
                    onValueChange={(val) => setOptimizeFor(val as 'distance' | 'duration')}
                    className="w-full"
                  >
                    <TabsList className="w-full">
                      <TabsTrigger value="distance" className="w-1/2">Distance</TabsTrigger>
                      <TabsTrigger value="duration" className="w-1/2">Duration</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Travel Mode</label>
                  <Tabs 
                    defaultValue={travelMode} 
                    value={travelMode}
                    onValueChange={(val) => setTravelMode(val as 'driving' | 'walking' | 'cycling')}
                    className="w-full"
                  >
                    <TabsList className="w-full">
                      <TabsTrigger value="driving" className="w-1/3">
                        <RouteIcon className="h-4 w-4 mr-2" />
                        Driving
                      </TabsTrigger>
                      <TabsTrigger value="walking" className="w-1/3">
                        <Navigation className="h-4 w-4 mr-2" />
                        Walking
                      </TabsTrigger>
                      <TabsTrigger value="cycling" className="w-1/3">
                        <MapPin className="h-4 w-4 mr-2" />
                        Cycling
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium">Selected Places</label>
                    <span className="text-sm text-muted-foreground">{selectedPlaces.length} selected</span>
                  </div>
                  
                  {selectedPlaces.length > 0 ? (
                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                      {selectedPlaces.map((place, index) => (
                        <div 
                          key={place.id} 
                          className="flex items-center justify-between p-2 bg-muted rounded-md"
                        >
                          <div className="flex items-center">
                            <div className="bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2">
                              {index + 1}
                            </div>
                            <span className="font-medium">{place.name}</span>
                          </div>
                          
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleTogglePlaceSelection(place)}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-sm text-muted-foreground">
                      No places selected yet. Select places from the map or gallery.
                    </div>
                  )}
                </div>
                
                {currentRoute && (
                  <>
                    <Separator />
                    <RouteDetails route={currentRoute} />
                  </>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="col-span-1 lg:col-span-2">
            <div className="space-y-6">
              <Card className="h-[400px]">
                <CardContent className="p-0 h-full">
                  <MapComponent 
                    places={places} 
                    selectedPlaces={selectedPlaces} 
                    currentRoute={currentRoute} 
                    onPlaceSelect={handleTogglePlaceSelection}
                  />
                </CardContent>
              </Card>
              
              <div>
                <h2 className="text-xl font-bold mb-4">Available Destinations</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {places.map(place => (
                    <PlaceCard 
                      key={place.id} 
                      place={place} 
                      isSelected={selectedPlaces.some(p => p.id === place.id)}
                      order={selectedPlaces.findIndex(p => p.id === place.id)}
                      onToggleSelect={handleTogglePlaceSelection}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PlannerPage;
