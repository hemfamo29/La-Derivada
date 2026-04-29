import Header from './components/Header';
import DerivativeSimulator from './components/DerivativeSimulator';
import InfoCard from './components/InfoCard';
import Quiz from './components/Quiz';
import { useState } from 'react';
import { Play, Pause, Tags, BookOpen } from 'lucide-react';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export default function App() {
  const [isPaused, setIsPaused] = useState(false);
  const [showLabels, setShowLabels] = useState(true);

  return (
    <div className="h-screen bg-slate-50 font-sans text-slate-900 flex flex-col selection:bg-orange-100 selection:text-orange-900 overflow-hidden border-8 border-slate-200">
      <Header />

      <main className="flex-1 flex flex-col lg:flex-row p-6 gap-6 overflow-hidden">
        {/* Simulator Visualization */}
        <div className="flex-[2] flex flex-col gap-4 overflow-hidden">
          <div className="flex justify-between items-center bg-slate-50/50 p-3 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex gap-2">
              <button 
                onClick={() => setIsPaused(!isPaused)}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all active:scale-95 ${
                  isPaused 
                  ? 'bg-orange-500 text-slate-900 hover:bg-orange-400' 
                  : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
              >
                {isPaused ? <Play size={14} fill="currentColor" /> : <Pause size={14} fill="currentColor" />}
                {isPaused ? 'Reanudar' : 'Pausar'}
              </button>
              <button 
                onClick={() => setShowLabels(!showLabels)}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border transition-all active:scale-95 ${
                  showLabels 
                  ? 'bg-white border-slate-300 text-slate-800' 
                  : 'bg-slate-100 border-transparent text-slate-400'
                }`}
              >
                <Tags size={14} />
                Etiquetas {showLabels ? 'ON' : 'OFF'}
              </button>
            </div>
            <div className="px-3 py-1 bg-white border border-slate-200 text-[10px] font-mono text-slate-400 rounded uppercase tracking-tighter hidden sm:block">
              Sistema de Coordenadas Tiempo Real
            </div>
          </div>

          <div className="flex-1 relative bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <DerivativeSimulator isPaused={isPaused} showLabels={showLabels} />
          </div>
          
          <div className="flex justify-between items-center px-2">
            <p className="text-[10px] text-slate-400 font-mono uppercase tracking-widest italic">
              * Arrastra horizontalmente para variar h
            </p>
            <div className="flex gap-4 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
              <span>F(X) = X²</span>
              <span className="text-orange-600 font-bold">Tangente Activa</span>
            </div>
          </div>
        </div>

        {/* Sidebar Space */}
        <aside className="flex-1 flex flex-col gap-6 overflow-y-auto pr-1">
          <InfoCard />
          <div className="pt-2">
             <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-4 bg-orange-500 rounded-full" />
              <h2 className="text-xs font-bold uppercase text-slate-500 tracking-widest">Desafío</h2>
            </div>
            <Quiz />
          </div>
        </aside>
      </main>

      {/* Status Bar / Footer */}
      <footer className="h-12 bg-slate-100 border-t border-slate-200 flex items-center justify-between px-8 text-[10px] font-mono text-slate-500 uppercase tracking-widest shrink-0">
        <div className="flex gap-6">
          <span>Precisión: 99.8%</span>
          <span className="text-orange-600">Tangent Analysis: Stable</span>
        </div>
        <div className="hidden sm:block">
          USUARIO: CALCULUS_EXPLORER_01
        </div>
      </footer>
    </div>
  );
}
