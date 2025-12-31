import React, { useState, useEffect, useMemo } from 'react';
import { Activity, AppTab, Coordinates } from './types';
import { INITIAL_ITINERARY, SHIP_DEPARTURE_TIME } from './constants';
import Timeline from './components/Timeline';
import Budget from './components/Budget';
import Guide from './components/Guide';
import MapComponent from './components/Map';
import { CalendarClock, Map as MapIcon, Wallet, BookOpen, Anchor, Bell } from 'lucide-react';
import { calculateDistance } from './services/utils';

// Helper to save/load from LocalStorage
const STORAGE_KEY = 'flam_itinerary_v1';

const App: React.FC = () => {
  const [itinerary, setItinerary] = useState<Activity[]>(INITIAL_ITINERARY);
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.TIMELINE);
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [mapFocus, setMapFocus] = useState<Coordinates | null>(null);
  const [countdown, setCountdown] = useState<string>('');

  // Load from storage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Merge saved completed status with initial structure (in case code updates)
        const merged = INITIAL_ITINERARY.map(initItem => {
          const savedItem = parsed.find((p: Activity) => p.id === initItem.id);
          return savedItem ? { ...initItem, completed: savedItem.completed } : initItem;
        });
        setItinerary(merged);
      } catch (e) {
        console.error("Failed to load itinerary", e);
      }
    }
  }, []);

  // Persist checks
  const handleToggleComplete = (id: string) => {
    const newItinerary = itinerary.map(act => 
      act.id === id ? { ...act, completed: !act.completed } : act
    );
    setItinerary(newItinerary);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newItinerary));
  };

  // Geo-tracking
  useEffect(() => {
    if ('geolocation' in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.log("Geo denied or error", err),
        { enableHighAccuracy: true, maximumAge: 10000 }
      );
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, []);

  // Global Countdown Timer to Ship Departure
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const [hours, minutes] = SHIP_DEPARTURE_TIME.split(':').map(Number);
      const departure = new Date();
      departure.setHours(hours, minutes, 0);

      // Simple logic assuming same day usage
      const diff = departure.getTime() - now.getTime();
      if (diff <= 0) {
        setCountdown("¡BARCO ZARPANDO!");
      } else {
        const h = Math.floor(diff / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);
        setCountdown(`${h}h ${m}m ${s}s`);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Handle "Show in Map" from Timeline
  const handleLocate = (coords: Coordinates) => {
    setMapFocus(coords);
    setActiveTab(AppTab.MAP);
  };

  // Find next activity for sticky footer context
  const nextActivity = useMemo(() => {
    return itinerary.find(a => !a.completed);
  }, [itinerary]);

  return (
    <div className="flex flex-col h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">
      
      {/* Header: Ship Countdown (Always visible) */}
      <header className="bg-fjord-900 text-white p-3 shadow-md z-20 flex justify-between items-center">
        <div className="flex items-center">
          <Anchor className="mr-2 text-sunset-500" size={20} />
          <div>
            <h1 className="font-bold text-sm leading-none">Salida: {SHIP_DEPARTURE_TIME}</h1>
            <p className="text-xs text-fjord-200">Todos a bordo 17:00</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xl font-mono font-bold text-sunset-500 tabular-nums">{countdown}</div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative">
        {activeTab === AppTab.TIMELINE && (
          <div className="h-full overflow-y-auto scroll-smooth">
             <Timeline 
               itinerary={itinerary} 
               onToggleComplete={handleToggleComplete}
               onLocate={handleLocate}
               userLocation={userLocation}
             />
          </div>
        )}
        
        {activeTab === AppTab.MAP && (
          <div className="h-full w-full">
            <MapComponent 
              activities={itinerary} 
              userLocation={userLocation}
              focusedLocation={mapFocus}
            />
             {/* Map Legend Overlay */}
             <div className="absolute top-4 right-4 bg-white/90 p-3 rounded shadow-lg z-[400] text-xs max-w-[150px]">
               <h4 className="font-bold mb-1">Mapa Offline</h4>
               <p className="mb-2">GPS activo. Los puntos azules son actividades.</p>
               {userLocation && nextActivity && (
                 <p className="text-fjord-600 font-bold">
                   Distancia al sig.: {Math.round(calculateDistance(userLocation, nextActivity.coords))}m
                 </p>
               )}
             </div>
          </div>
        )}

        {activeTab === AppTab.BUDGET && <Budget itinerary={itinerary} />}
        
        {activeTab === AppTab.GUIDE && <Guide />}
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-white border-t border-slate-200 shadow-lg z-30 pb-safe">
        <div className="flex justify-around items-center h-16">
          <button 
            onClick={() => setActiveTab(AppTab.TIMELINE)}
            className={`flex flex-col items-center w-full h-full justify-center ${activeTab === AppTab.TIMELINE ? 'text-fjord-600' : 'text-slate-400'}`}
          >
            <CalendarClock size={24} />
            <span className="text-[10px] mt-1 font-medium">Itinerario</span>
          </button>
          
          <button 
            onClick={() => setActiveTab(AppTab.MAP)}
            className={`flex flex-col items-center w-full h-full justify-center ${activeTab === AppTab.MAP ? 'text-fjord-600' : 'text-slate-400'}`}
          >
            <MapIcon size={24} />
            <span className="text-[10px] mt-1 font-medium">Mapa</span>
          </button>
          
          <button 
            onClick={() => setActiveTab(AppTab.BUDGET)}
            className={`flex flex-col items-center w-full h-full justify-center ${activeTab === AppTab.BUDGET ? 'text-fjord-600' : 'text-slate-400'}`}
          >
            <Wallet size={24} />
            <span className="text-[10px] mt-1 font-medium">Gastos</span>
          </button>
          
          <button 
            onClick={() => setActiveTab(AppTab.GUIDE)}
            className={`flex flex-col items-center w-full h-full justify-center ${activeTab === AppTab.GUIDE ? 'text-fjord-600' : 'text-slate-400'}`}
          >
            <BookOpen size={24} />
            <span className="text-[10px] mt-1 font-medium">Guía</span>
          </button>
        </div>
      </nav>

    </div>
  );
};

export default App;
