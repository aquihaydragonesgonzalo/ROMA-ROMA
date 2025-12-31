import React, { useState } from 'react';
import { PRONUNCIATIONS } from '../constants';
import { Volume2, Camera, Utensils, Ticket, Info, Map as MapIcon } from 'lucide-react';

const Guide: React.FC = () => {
  const [playing, setPlaying] = useState<string | null>(null);

  const playSimulatedAudio = (word: string) => {
    setPlaying(word);
    setTimeout(() => setPlaying(null), 1000);
  };

  return (
    <div className="pb-24 px-4 pt-6 max-w-lg mx-auto h-full overflow-y-auto">
      <h2 className="text-2xl font-bold text-imperial-900 mb-6">Guía de Supervivencia</h2>

      {/* Survival Tips */}
      <div className="space-y-4 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center mb-3 text-imperial-800 font-bold">
             <Camera size={20} className="mr-2 text-imperial-600"/> Fontana di Trevi
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            Aforo máximo de 400 personas. El flujo es circular y está <span className="font-bold text-red-600">prohibido comer o beber</span> cerca de la fuente. 
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center mb-3 text-imperial-800 font-bold">
             <Utensils size={20} className="mr-2 text-imperial-600"/> Comer "Al Banco"
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            El café y los bocadillos son mucho más baratos si los consumes <span className="font-bold italic">de pie en la barra</span>. Sentarse en una mesa suele duplicar el precio por el servicio.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center mb-3 text-imperial-800 font-bold">
             <Ticket size={20} className="mr-2 text-imperial-600"/> Ticket BIRG
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            No olvides escribir tu nombre y fecha en el ticket. <span className="font-bold">Valídalo</span> en las máquinas verdes antes de subir al tren para evitar multas de hasta 50€.
          </p>
        </div>
      </div>

      {/* Map Tip */}
      <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl flex items-start mb-8">
        <MapIcon className="text-blue-600 mt-1 mr-3 flex-shrink-0" size={20} />
        <div>
          <h4 className="font-bold text-blue-800 text-sm">Atajo Regreso</h4>
          <p className="text-xs text-blue-700 mt-1">
            Usa la estación de <span className="font-bold">Roma San Pietro</span> para el regreso. Es mucho más pequeña y menos caótica que Termini.
          </p>
        </div>
      </div>

      {/* Pronunciation Table */}
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
        <Info size={18} className="mr-2 text-imperial-600"/> Italiano Exprés
      </h3>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden divide-y divide-gray-100">
        {PRONUNCIATIONS.map((item, idx) => (
          <div key={item.word} className="p-4 flex justify-between items-center hover:bg-slate-50 transition-colors">
            <div>
              <div className="flex items-baseline space-x-2">
                <span className="font-bold text-lg text-imperial-800">{item.word}</span>
                <span className="text-[10px] text-gray-400 font-mono tracking-tighter uppercase">{item.phonetic}</span>
              </div>
              <div className="text-xs font-medium text-gray-600 mt-0.5 italic">
                "{item.simplified}"
              </div>
              <p className="text-sm text-slate-500 mt-1">{item.meaning}</p>
            </div>
            <button 
              onClick={() => playSimulatedAudio(item.word)}
              className={`p-3 rounded-full transition-all ${playing === item.word ? 'bg-imperial-100 text-imperial-600 scale-110 shadow-inner' : 'bg-slate-100 text-slate-400 hover:text-imperial-500 hover:bg-imperial-50'}`}
            >
              <Volume2 size={20} className={playing === item.word ? 'animate-pulse' : ''} />
            </button>
          </div>
        ))}
      </div>
      
      <div className="mt-8 text-center text-[10px] text-slate-400 uppercase tracking-widest pb-8">
        Guía de Escala Roma 2026
      </div>
    </div>
  );
};

export default Guide;
