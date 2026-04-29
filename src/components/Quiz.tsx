import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, RotateCcw, ChevronRight } from 'lucide-react';
import { QUIZ_DATA } from '../constants';

export default function Quiz() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const handleAnswer = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);
    if (idx === QUIZ_DATA[currentIdx].c) {
      setScore(s => s + 1);
    }
  };

  const nextQuestion = () => {
    if (currentIdx + 1 < QUIZ_DATA.length) {
      setCurrentIdx(c => c + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
    }
  };

  const resetQuiz = () => {
    setCurrentIdx(0);
    setScore(0);
    setShowResult(false);
    setSelectedOption(null);
    setIsAnswered(false);
  };

  if (showResult) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center p-8 bg-slate-900 text-white rounded-xl shadow-xl border border-slate-800"
      >
        <h3 className="text-xl font-bold uppercase tracking-widest mb-2 text-orange-500">Misión Completada</h3>
        <p className="text-slate-400 mb-6 font-mono text-sm tracking-tighter">Puntaje Final: {score} / {QUIZ_DATA.length}</p>
        <button 
          onClick={resetQuiz}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg font-bold hover:bg-orange-500 transition-colors uppercase text-xs tracking-widest"
        >
          <RotateCcw size={16} />
          Reiniciar Sistema
        </button>
      </motion.div>
    );
  }

  const currentQ = QUIZ_DATA[currentIdx];

  return (
    <div className="w-full p-5 bg-orange-50 rounded-xl border border-orange-200 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xs font-bold uppercase text-orange-800 tracking-wider italic">Knowledge Challenge</h3>
        <span className="text-[10px] font-bold text-orange-600 bg-orange-100 px-2 py-0.5 rounded uppercase font-mono">TASK 0{currentIdx + 1}/10</span>
      </div>

      <p className="text-sm font-medium text-slate-800 mb-6 leading-relaxed">{currentQ.q}</p>

      <div className="space-y-2 mb-6">
        {currentQ.a.map((option, i) => {
          const isCorrect = i === currentQ.c;
          const isSelected = i === selectedOption;
          
          let btnClass = "w-full text-left px-4 py-3 rounded-lg text-xs transition-all flex items-center justify-between group ";
          
          if (!isAnswered) {
             btnClass += "bg-white border border-orange-200 text-slate-700 hover:bg-orange-100";
          } else if (isCorrect) {
             btnClass += "bg-green-600 border-green-700 text-white font-bold";
          } else if (isSelected && !isCorrect) {
             btnClass += "bg-red-600 border-red-700 text-white font-bold";
          } else {
             btnClass += "bg-white border border-orange-100 text-slate-300 opacity-60";
          }

          return (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              disabled={isAnswered}
              className={btnClass}
            >
              <span>{String.fromCharCode(65 + i)}) {option}</span>
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                isAnswered && isCorrect ? 'bg-white border-green-800' : 'border-orange-300'
              }`}>
                {isAnswered && isCorrect && <div className="w-1.5 h-1.5 bg-green-600 rounded-full" />}
                {isAnswered && isSelected && !isCorrect && <div className="w-1.5 h-1.5 bg-white rounded-full opacity-50" />}
              </div>
            </button>
          )
        })}
      </div>

      <div className="flex justify-end">
        <button
          onClick={nextQuestion}
          disabled={!isAnswered}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
            isAnswered 
            ? "bg-slate-900 text-white hover:bg-slate-800" 
            : "bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300"
          }`}
        >
          {currentIdx + 1 === QUIZ_DATA.length ? "Finalizar" : "Siguiente"}
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
