
import { Itinerary } from '../types';

const STORAGE_KEY = 'smart-travel-planner-itineraries';

// Load itineraries from localStorage
export const loadItineraries = (): Itinerary[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error loading itineraries from localStorage:', error);
    return [];
  }
};

// Save itineraries to localStorage
export const saveItineraries = (itineraries: Itinerary[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(itineraries));
  } catch (error) {
    console.error('Error saving itineraries to localStorage:', error);
  }
};

// Add a new itinerary
export const addItinerary = (itinerary: Omit<Itinerary, 'id' | 'createdAt'>): Itinerary => {
  const itineraries = loadItineraries();
  
  const newItinerary: Itinerary = {
    ...itinerary,
    id: `itinerary-${Date.now()}`,
    createdAt: new Date().toISOString()
  };
  
  itineraries.push(newItinerary);
  saveItineraries(itineraries);
  
  return newItinerary;
};

// Delete an itinerary by id
export const deleteItinerary = (id: string): void => {
  const itineraries = loadItineraries();
  const filtered = itineraries.filter(itinerary => itinerary.id !== id);
  saveItineraries(filtered);
};

// Get an itinerary by id
export const getItinerary = (id: string): Itinerary | undefined => {
  const itineraries = loadItineraries();
  return itineraries.find(itinerary => itinerary.id === id);
};
