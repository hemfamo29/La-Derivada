import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lightbulb, Info, X, ChevronRight, BookOpen } from 'lucide-react';
import { FUN_FACTS } from '../constants';

export default function InfoCard() {
  const [factIdx, setFactIdx] = useState(0);

  const rotateFact = () => {
    setFactIdx(prev => (prev + 1) % FUN_FACTS.length);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col gap-5">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-orange-500 rounded-full" />
        <h3 className="text-xs font-bold uppercase text-slate-500 tracking-tighter">Geometric Interpretation</h3>
      </div>

      <div className="bg-slate-900 text-slate-100 p-4 rounded-lg font-mono text-xs leading-relaxed border-l-4 border-orange-500">
        f'(x) = lim <span className="opacity-60">h→0</span> 
        <div className="inline-block text-center align-middle ml-2">
          <span className="border-b border-white/30 block px-1">f(x+h) - f(x)</span>
          <span>h</span>
        </div>
      </div>

      <p className="text-xs text-slate-600 leading-relaxed">
        La derivada es la <strong className="text-slate-900">pendiente de la recta tangente</strong> a la curva en un punto dado. 
        A medida que el punto <span className="text-red-500 font-bold italic">Q</span> se acerca a <span className="text-blue-500 font-bold italic">P</span>, la recta secante transiciona hacia la tangente exacta.
      </p>

      <div className="bg-orange-50 p-4 rounded-lg border border-orange-100 relative overflow-hidden group">
        <div className="flex items-center gap-2 text-orange-800 mb-2">
          <Lightbulb size={14} className="text-orange-500" />
          <span className="text-[10px] font-black uppercase tracking-widest">Calculus Insight</span>
        </div>
        <AnimatePresence mode="wait">
          <motion.p
            key={factIdx}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="text-[11px] text-slate-700 font-medium leading-normal mb-3"
          >
            {FUN_FACTS[factIdx]}
          </motion.p>
        </AnimatePresence>
        <button 
          onClick={rotateFact}
          className="text-[9px] font-bold text-orange-600 flex items-center gap-1 hover:text-orange-800 transition-colors"
        >
          SIGUIENTE DATO <ChevronRight size={10} />
        </button>
      </div>
    </div>
  );
}
