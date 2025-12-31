export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Activity {
  id: string;
  title: string;
  startTime: string; // "HH:MM"
  endTime: string;   // "HH:MM"
  locationName: string;
  endLocationName?: string; // Optional: Destination name
  coords: Coordinates;
  endCoords?: Coordinates;  // Optional: Destination coordinates
  description: string;
  keyDetails: string;
  priceNOK: number;
  priceEUR: number;
  type: 'transport' | 'food' | 'sightseeing' | 'shopping' | 'logistics';
  completed: boolean;
  notes?: string;
}

export interface Pronunciation {
  word: string;
  phonetic: string;
  simplified: string;
  meaning: string;
}

export enum AppTab {
  TIMELINE = 'timeline',
  MAP = 'map',
  BUDGET = 'budget',
  GUIDE = 'guide'
}