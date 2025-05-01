
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogClose, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Route, Itinerary } from '../types';

interface SaveItineraryDialogProps {
  route: Route;
  onSave: (itinerary: Omit<Itinerary, 'id' | 'createdAt'>) => void;
  trigger?: React.ReactNode;
}

const SaveItineraryDialog: React.FC<SaveItineraryDialogProps> = ({ route, onSave, trigger }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // YYYY-MM-DD format
  const [open, setOpen] = useState(false);

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!name.trim()) return;
    
    onSave({
      name,
      description,
      date,
      route
    });
    
    // Reset form
    setName('');
    setDescription('');
    setDate(new Date().toISOString().split('T')[0]);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button>Save Itinerary</Button>}
      </DialogTrigger>
      <DialogContent className="z-[1000]"> {/* Increased z-index to be higher than the map */}
        <DialogHeader>
          <DialogTitle>Save Itinerary</DialogTitle>
          <DialogDescription>
            Give your itinerary a name and description to save it for later.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input 
              id="name" 
              placeholder="My awesome trip" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              placeholder="A brief description of your trip" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input 
              id="date" 
              type="date"
              value={date} 
              onChange={(e) => setDate(e.target.value)} 
            />
          </div>
        </div>
        
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </DialogClose>
          <Button type="button" onClick={handleSave} disabled={!name.trim()}>
            Save Itinerary
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SaveItineraryDialog;
