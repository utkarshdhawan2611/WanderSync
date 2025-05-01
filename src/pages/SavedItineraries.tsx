
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import SavedItineraryCard from '../components/SavedItineraryCard';
import { Itinerary } from '../types';
import { loadItineraries, deleteItinerary } from '../lib/storage';
import { Button } from '../components/ui/button';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog';
import { useToast } from '../hooks/use-toast';

const SavedItinerariesPage: React.FC = () => {
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itineraryToDelete, setItineraryToDelete] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Load itineraries on mount
  useEffect(() => {
    const loaded = loadItineraries();
    setItineraries(loaded);
  }, []);

  const handleDeleteConfirm = () => {
    if (itineraryToDelete) {
      deleteItinerary(itineraryToDelete);
      setItineraries(prev => prev.filter(it => it.id !== itineraryToDelete));
      toast({
        title: "Itinerary deleted",
        description: "The itinerary has been removed from your saved itineraries."
      });
    }
    setIsDeleteDialogOpen(false);
    setItineraryToDelete(null);
  };

  const handleDeleteRequest = (id: string) => {
    setItineraryToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleSelectItinerary = (itinerary: Itinerary) => {
    // Store the selected itinerary in localStorage to load it in the planner page
    localStorage.setItem('selected-itinerary', JSON.stringify(itinerary));
    
    // Navigate to the planner page
    navigate('/');
    
    toast({
      title: "Itinerary loaded",
      description: `"${itinerary.name}" has been loaded.`
    });
  };

  return (
    <Layout>
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Saved Itineraries</h1>
            <p className="text-muted-foreground">View and manage your saved travel plans.</p>
          </div>
          
          <Button onClick={() => navigate('/')}>
            Create New Itinerary
          </Button>
        </div>
        
        {itineraries.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {itineraries.map(itinerary => (
              <SavedItineraryCard
                key={itinerary.id}
                itinerary={itinerary}
                onSelect={handleSelectItinerary}
                onDelete={handleDeleteRequest}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 space-y-4 bg-muted/30 rounded-lg">
            <div className="text-center max-w-md">
              <h3 className="text-lg font-semibold">No saved itineraries yet</h3>
              <p className="text-muted-foreground">
                Create and save itineraries to access them later. Your itineraries will be stored locally on this device.
              </p>
            </div>
            <Button onClick={() => navigate('/')}>
              Create Your First Itinerary
            </Button>
          </div>
        )}
      </div>
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this itinerary.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

export default SavedItinerariesPage;
