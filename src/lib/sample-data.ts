
import { Place, RouteEdge } from '../types';

export const samplePlaces: Place[] = [
  {
    id: 'place-1',
    name: 'Eiffel Tower',
    description: 'Iconic iron lattice tower in Paris',
    coordinates: [2.2945, 48.8584],
    type: 'attraction',
    address: 'Champ de Mars, 5 Avenue Anatole France, 75007 Paris, France',
    image: 'https://thumbs.dreamstime.com/b/generated-image-360463306.jpg'
  },
  {
    id: 'place-2',
    name: 'Louvre Museum',
    description: 'World\'s largest art museum',
    coordinates: [2.3376, 48.8606],
    type: 'attraction',
    address: 'Rue de Rivoli, 75001 Paris, France',
    image: 'https://images.unsplash.com/photo-1565099824688-e93eb20fe622?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: 'place-3',
    name: 'Notre-Dame Cathedral',
    description: 'Medieval Catholic cathedral',
    coordinates: [2.3499, 48.8530],
    type: 'attraction',
    address: '6 Parvis Notre-Dame - Pl. Jean-Paul II, 75004 Paris, France',
    image: 'https://images.unsplash.com/photo-1478391679764-b2d8b3cd1e94?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: 'place-4',
    name: 'Montmartre',
    description: 'Historic hill in Paris\'s 18th arrondissement',
    coordinates: [2.3431, 48.8867],
    type: 'attraction',
    address: 'Montmartre, 75018 Paris, France',
    image: 'https://images.unsplash.com/photo-1551634979-2b11f8c946fe?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: 'place-5',
    name: 'Arc de Triomphe',
    description: 'Monument honoring those who fought for France',
    coordinates: [2.2950, 48.8738],
    type: 'attraction',
    address: 'Place Charles de Gaulle, 75008 Paris, France',
    image: 'https://images.unsplash.com/photo-1509439581779-6298f75bf6e5?q=80&w=2072&auto=format&fit=crop'
  },
  {
    id: 'place-6',
    name: 'Champs-Élysées',
    description: 'Famous avenue known for luxury shops',
    coordinates: [2.3089, 48.8698],
    type: 'attraction',
    address: 'Champs-Élysées, 75008 Paris, France',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2073&auto=format&fit=crop'
  },
  {
    id: 'place-7',
    name: 'Palace of Versailles',
    description: 'Former royal residence',
    coordinates: [2.1204, 48.8049],
    type: 'attraction',
    address: 'Place d\'Armes, 78000 Versailles, France',
    image: 'https://worldinparis.com/wp-content/uploads/2019/08/Versailles-Palace-1024x683.jpg'
  },
  {
    id: 'place-8',
    name: 'Centre Pompidou',
    description: 'Complex building housing the largest museum for modern art in Europe',
    coordinates: [2.3522, 48.8606],
    type: 'attraction',
    address: 'Place Georges-Pompidou, 75004 Paris, France',
    image: 'https://www.familinparis.fr/wp-content/uploads/photos-familinparis-2021/mus%C3%A9e/centre-pompidou-beaubourg-%C2%A9familinparis.jpg'
  }
];

const createEdge = (from: string, to: string, distance: number, duration: number, mode: 'driving' | 'walking' | 'cycling' | 'transit'): RouteEdge => ({
  from,
  to,
  distance,
  duration,
  mode
});

export const sampleEdges: RouteEdge[] = [
  // From Eiffel Tower
  createEdge('place-1', 'place-2', 4.5, 25, 'driving'), // To Louvre
  createEdge('place-1', 'place-3', 5.1, 30, 'driving'), // To Notre-Dame
  createEdge('place-1', 'place-4', 7.2, 35, 'driving'), // To Montmartre
  createEdge('place-1', 'place-5', 2.8, 15, 'driving'), // To Arc de Triomphe
  createEdge('place-1', 'place-6', 3.5, 20, 'driving'), // To Champs-Élysées
  createEdge('place-1', 'place-7', 22.0, 45, 'driving'), // To Versailles
  createEdge('place-1', 'place-8', 5.0, 28, 'driving'), // To Centre Pompidou
  
  // From Louvre
  createEdge('place-2', 'place-1', 4.5, 25, 'driving'), // To Eiffel Tower
  createEdge('place-2', 'place-3', 1.8, 12, 'driving'), // To Notre-Dame
  createEdge('place-2', 'place-4', 6.1, 30, 'driving'), // To Montmartre
  createEdge('place-2', 'place-5', 4.2, 22, 'driving'), // To Arc de Triomphe
  createEdge('place-2', 'place-6', 2.9, 18, 'driving'), // To Champs-Élysées
  createEdge('place-2', 'place-7', 23.0, 50, 'driving'), // To Versailles
  createEdge('place-2', 'place-8', 1.5, 10, 'driving'), // To Centre Pompidou
  
  // From Notre-Dame
  createEdge('place-3', 'place-1', 5.1, 30, 'driving'), // To Eiffel Tower
  createEdge('place-3', 'place-2', 1.8, 12, 'driving'), // To Louvre
  createEdge('place-3', 'place-4', 5.8, 28, 'driving'), // To Montmartre
  createEdge('place-3', 'place-5', 6.0, 32, 'driving'), // To Arc de Triomphe
  createEdge('place-3', 'place-6', 4.5, 26, 'driving'), // To Champs-Élysées
  createEdge('place-3', 'place-7', 24.0, 55, 'driving'), // To Versailles
  createEdge('place-3', 'place-8', 1.0, 8, 'driving'), // To Centre Pompidou
  
  // From Montmartre
  createEdge('place-4', 'place-1', 7.2, 35, 'driving'), // To Eiffel Tower
  createEdge('place-4', 'place-2', 6.1, 30, 'driving'), // To Louvre
  createEdge('place-4', 'place-3', 5.8, 28, 'driving'), // To Notre-Dame
  createEdge('place-4', 'place-5', 4.8, 25, 'driving'), // To Arc de Triomphe
  createEdge('place-4', 'place-6', 4.0, 22, 'driving'), // To Champs-Élysées
  createEdge('place-4', 'place-7', 29.0, 60, 'driving'), // To Versailles
  createEdge('place-4', 'place-8', 5.5, 26, 'driving'), // To Centre Pompidou
  
  // From Arc de Triomphe
  createEdge('place-5', 'place-1', 2.8, 15, 'driving'), // To Eiffel Tower
  createEdge('place-5', 'place-2', 4.2, 22, 'driving'), // To Louvre
  createEdge('place-5', 'place-3', 6.0, 32, 'driving'), // To Notre-Dame
  createEdge('place-5', 'place-4', 4.8, 25, 'driving'), // To Montmartre
  createEdge('place-5', 'place-6', 1.2, 8, 'driving'), // To Champs-Élysées
  createEdge('place-5', 'place-7', 21.0, 40, 'driving'), // To Versailles
  createEdge('place-5', 'place-8', 5.1, 27, 'driving'), // To Centre Pompidou
  
  // From Champs-Élysées
  createEdge('place-6', 'place-1', 3.5, 20, 'driving'), // To Eiffel Tower
  createEdge('place-6', 'place-2', 2.9, 18, 'driving'), // To Louvre
  createEdge('place-6', 'place-3', 4.5, 26, 'driving'), // To Notre-Dame
  createEdge('place-6', 'place-4', 4.0, 22, 'driving'), // To Montmartre
  createEdge('place-6', 'place-5', 1.2, 8, 'driving'), // To Arc de Triomphe
  createEdge('place-6', 'place-7', 22.0, 42, 'driving'), // To Versailles
  createEdge('place-6', 'place-8', 4.0, 24, 'driving'), // To Centre Pompidou
  
  // From Versailles
  createEdge('place-7', 'place-1', 22.0, 45, 'driving'), // To Eiffel Tower
  createEdge('place-7', 'place-2', 23.0, 50, 'driving'), // To Louvre
  createEdge('place-7', 'place-3', 24.0, 55, 'driving'), // To Notre-Dame
  createEdge('place-7', 'place-4', 29.0, 60, 'driving'), // To Montmartre
  createEdge('place-7', 'place-5', 21.0, 40, 'driving'), // To Arc de Triomphe
  createEdge('place-7', 'place-6', 22.0, 42, 'driving'), // To Champs-Élysées
  createEdge('place-7', 'place-8', 22.5, 52, 'driving'), // To Centre Pompidou
  
  // From Centre Pompidou
  createEdge('place-8', 'place-1', 5.0, 28, 'driving'), // To Eiffel Tower
  createEdge('place-8', 'place-2', 1.5, 10, 'driving'), // To Louvre
  createEdge('place-8', 'place-3', 1.0, 8, 'driving'), // To Notre-Dame
  createEdge('place-8', 'place-4', 5.5, 26, 'driving'), // To Montmartre
  createEdge('place-8', 'place-5', 5.1, 27, 'driving'), // To Arc de Triomphe
  createEdge('place-8', 'place-6', 4.0, 24, 'driving'), // To Champs-Élysées
  createEdge('place-8', 'place-7', 22.5, 52, 'driving'), // To Versailles
];
