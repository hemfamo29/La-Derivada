import { Target } from 'lucide-react';

export default function Header() {
  return (
    <header className="h-16 bg-slate-900 text-white flex items-center justify-between px-8 border-b-4 border-orange-500 shrink-0">
      <div className="flex items-center gap-4">
        <div className="w-8 h-8 bg-orange-500 rounded-sm flex items-center justify-center font-bold text-slate-900">
          <Target size={18} />
        </div>
        <h1 className="text-xl font-bold tracking-tight uppercase">
          NAVEGADOR DE LA DERIVADA <span className="font-light opacity-60 hidden sm:inline">// MISIÓN CÁLCULO</span>
        </h1>
      </div>
      
      <div className="flex gap-6 text-[10px] font-mono uppercase tracking-widest text-slate-400">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span>Sesión: Activa</span>
        </div>
        <span className="hidden md:block">Tópico: 2.1 Puntos Tangentes</span>
      </div>
    </header>
  );
}
