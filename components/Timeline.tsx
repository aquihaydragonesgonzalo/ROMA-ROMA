import React from 'react';
import { Activity } from '../types';
import { CheckCircle2, Circle, MapPin, AlertTriangle, Clock, ArrowRight, Info } from 'lucide-react';
import { calculateDuration } from '../services/utils';

interface TimelineProps {
  itinerary: Activity[];
  onToggleComplete: (id: string) => void;
  onLocate: (coords: { lat: number, lng: number }, endCoords?: { lat: number, lng: number }) => void;
  userLocation: { lat: number, lng: number } | null;
}

const Timeline: React.FC<TimelineProps> = ({ itinerary, onToggleComplete, onLocate, userLocation }) => {
  
  const getStatusColor = (act: Activity) => {
    if (act.completed) return 'border-emerald-200 bg-emerald-50 opacity-75';
    if (act.notes?.includes('Aviso') || act.notes?.includes('CRITICAL')) return 'border-red-200 bg-red-50';
    return 'border-slate-200 bg-white';
  };

  return (
    <div className="pb-24 px-4 pt-4 max-w-lg mx-auto overflow-y-auto h-full no-scrollbar">
      <div className="mb-6">
        <h2 className="text-2xl font-black text-imperial-900 tracking-tight">Roma Imperial 2026</h2>
        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Escala: 16 de Abril</p>
      </div>
      
      <div className="relative border-l-2 border-imperial-100 ml-3 space-y-8">
        {itinerary.map((act) => {
          const isCritical = act.notes?.includes('CRITICAL') || act.notes?.includes('Aviso');
          const duration = calculateDuration(act.startTime, act.endTime);
          
          return (
            <div key={act.id} className="mb-8 ml-6 relative">
              {/* Timeline Dot */}
              <div 
                className={`absolute -left-[31px] top-0 rounded-full bg-white border-2 cursor-pointer transition-all z-10 ${
                  act.completed ? 'border-emerald-500 text-emerald-500 scale-90' : 'border-imperial-600 text-imperial-600 scale-100 shadow-md'
                }`}
                onClick={() => onToggleComplete(act.id)}
              >
                {act.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
              </div>

              {/* Card */}
              <div className={`p-5 rounded-2xl border shadow-sm transition-all ${getStatusColor(act)}`}>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center space-x-2 mb-1.5">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black bg-imperial-900 text-white uppercase">
                        {act.startTime}
                        </span>
                        {act.endTime !== act.startTime && (
                          <span className="text-[10px] font-bold text-slate-400 uppercase">HASTA {act.endTime} ({duration})</span>
                        )}
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 leading-tight">{act.title}</h3>
                  </div>
                  {isCritical && <AlertTriangle className="text-red-500 animate-pulse" size={20} />}
                </div>

                {/* Location Info */}
                <div className="mb-4 text-[11px] text-slate-500 flex items-center flex-wrap gap-y-1 font-bold uppercase tracking-tighter">
                    <span className="flex items-center bg-slate-100 px-2 py-0.5 rounded mr-2">
                        <MapPin size={12} className="mr-1 text-imperial-600"/> 
                        {act.locationName}
                    </span>
                    {act.endLocationName && (
                        <>
                            <ArrowRight size={12} className="text-slate-300 mx-1" />
                            <span className="flex items-center bg-slate-100 px-2 py-0.5 rounded ml-1">
                                <MapPin size={12} className="mr-1 text-emerald-600"/>
                                {act.endLocationName}
                            </span>
                        </>
                    )}
                </div>

                <p className="text-sm text-gray-700 mb-4 leading-relaxed">{act.description}</p>
                
                {/* Details Box */}
                <div className="bg-white/60 border border-imperial-100/50 p-3 rounded-xl text-xs text-imperial-900 italic font-medium mb-4 relative overflow-hidden">
                  <div className="absolute top-0 left-0 bottom-0 w-1 bg-imperial-600"></div>
                  "{act.keyDetails}"
                </div>

                {/* Warnings / Notes */}
                {act.notes && (
                  <div className="mb-4 p-2.5 rounded-lg bg-orange-100/50 border border-orange-200 text-[11px] font-bold text-orange-800 flex items-start">
                    <Info size={14} className="mr-2 flex-shrink-0 mt-0.5"/>
                    {act.notes}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between mt-2 pt-3 border-t border-slate-100">
                  <button 
                    onClick={() => onLocate(act.coords, act.endCoords)}
                    className="flex items-center text-[10px] font-black text-imperial-700 bg-white border border-imperial-100 hover:bg-imperial-50 px-3 py-1.5 rounded-lg shadow-sm uppercase tracking-tight"
                  >
                    <MapPin size={12} className="mr-1.5" />
                    Ver Mapa
                  </button>
                  
                  <button
                    onClick={() => onToggleComplete(act.id)}
                    className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tighter transition-all ${
                      act.completed 
                        ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                        : 'bg-imperial-900 text-white shadow-lg active:scale-95'
                    }`}
                  >
                    {act.completed ? '✓ HECHO' : '✓ MARCAR'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-8 mb-12 p-4 bg-slate-900 rounded-2xl text-white text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-imperial-400 mb-1">Onboard Time</p>
        <p className="text-3xl font-black">17:30</p>
        <p className="text-[9px] opacity-50 mt-1 italic">Todos a bordo. Se retira la pasarela.</p>
      </div>
    </div>
  );
};

export default Timeline;