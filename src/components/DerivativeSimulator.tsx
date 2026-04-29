import { useEffect, useRef, useState, MouseEvent } from 'react';
import * as math from 'mathjs';

interface DerivativeSimulatorProps {
  isPaused: boolean;
  showLabels: boolean;
  expression: string;
}

export default function DerivativeSimulator({ isPaused, showLabels, expression }: DerivativeSimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  
  // State for points in mathematical coordinates
  const [pX, setPX] = useState(1);
  const [qX, setQX] = useState(2);
  const [dragTarget, setDragTarget] = useState<'P' | 'Q' | null>(null);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  // Constants for scaling
  const SCALE_X = 50; 
  const SCALE_Y = 50;

  // Handle Resize
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setDimensions({ width: entry.contentRect.width, height: entry.contentRect.height });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Drawing Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || dimensions.width === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = dimensions;
    canvas.width = width;
    canvas.height = height;

    const centerX = width / 2;
    const centerY = height / 2;

    let compiledExpr: math.EvalFunction;
    try {
      compiledExpr = math.compile(expression);
      setErrorStatus(null);
    } catch {
      setErrorStatus("Error en la expresión");
      return;
    }

    const f = (x: number) => {
      try {
        const val = compiledExpr.evaluate({ x });
        return typeof val === 'number' ? val : NaN;
      } catch { return NaN; }
    };

    // Numerical Derivative Check for Differentiability
    const checkDifferentiability = (x: number) => {
      const epsilon = 0.0001;
      const y1 = f(x - epsilon);
      const y2 = f(x);
      const y3 = f(x + epsilon);

      if (isNaN(y2) || !isFinite(y2)) return { status: 'undefined', msg: 'Función no definida aquí' };
      
      const leftD = (y2 - y1) / epsilon;
      const rightD = (y3 - y2) / epsilon;

      if (Math.abs(leftD - rightD) > 0.5) return { status: 'non-diff', msg: 'Pico o esquina (No derivable)' };
      if (Math.abs(leftD) > 1000) return { status: 'vertical', msg: 'Tangente vertical' };
      
      return { status: 'ok', value: (leftD + rightD) / 2 };
    };

    let animationId: number;
    const draw = () => {
      if (isPaused) {
        animationId = requestAnimationFrame(draw);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // 1. Grid & Axes
      ctx.strokeStyle = '#f1f1f1';
      ctx.lineWidth = 1;
      for (let i = 0; i < width; i += 50) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, height); ctx.stroke();
      }
      for (let i = 0; i < height; i += 50) {
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(width, i); ctx.stroke();
      }

      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(centerX, 0); ctx.lineTo(centerX, height); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, centerY); ctx.lineTo(width, centerY); ctx.stroke();

      // 2. Curve
      ctx.strokeStyle = '#0f172a'; 
      ctx.lineWidth = 3;
      ctx.beginPath();
      let first = true;
      for (let screenX = 0; screenX < width; screenX++) {
        const mathX = (screenX - centerX) / SCALE_X;
        const mathY = f(mathX);
        if (!isNaN(mathY) && isFinite(mathY)) {
          const screenY = centerY - (mathY * SCALE_Y);
          if (first) ctx.moveTo(screenX, screenY);
          else ctx.lineTo(screenX, screenY);
          first = false;
        } else {
          first = true;
        }
      }
      ctx.stroke();

      const screenPX = centerX + pX * SCALE_X;
      const screenPY = centerY - f(pX) * SCALE_Y;
      const screenQX = centerX + qX * SCALE_X;
      const screenQY = centerY - f(qX) * SCALE_Y;

      // 3. Secant
      if (!isNaN(screenPY) && !isNaN(screenQY)) {
        ctx.setLineDash([8, 4]);
        ctx.strokeStyle = '#94a3b8';
        const mSec = (f(qX) - f(pX)) / (qX - pX || 0.0001);
        ctx.beginPath();
        ctx.moveTo(screenPX - width, screenPY + mSec * width);
        ctx.lineTo(screenPX + width, screenPY - mSec * width);
        ctx.stroke();
        ctx.setLineDash([]);

        // 4. Tangent
        const diffInfo = checkDifferentiability(pX);
        if (diffInfo.status === 'ok') {
          const mTan = diffInfo.value as number;
          ctx.strokeStyle = '#f97316';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(screenPX - 150, screenPY + mTan * 150);
          ctx.lineTo(screenPX + 150, screenPY - mTan * 150);
          ctx.stroke();
        }

        // 5. Points
        ctx.fillStyle = '#3b82f6'; // P
        ctx.beginPath(); ctx.arc(screenPX, screenPY, 8, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = 'white'; ctx.lineWidth = 2; ctx.stroke();

        ctx.fillStyle = '#ef4444'; // Q
        ctx.beginPath(); ctx.arc(screenQX, screenQY, 8, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = 'white'; ctx.lineWidth = 2; ctx.stroke();

        if (showLabels) {
          // Info Panel
          ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
          ctx.fillRect(20, 20, 220, 100);
          ctx.strokeStyle = '#e2e8f0';
          ctx.strokeRect(20, 20, 220, 100);

          ctx.fillStyle = '#94a3b8';
          ctx.font = 'bold 9px Inter';
          ctx.fillText('ANÁLISIS DE PENDIENTE', 35, 40);

          ctx.fillStyle = '#1e293b';
          const slopeText = Math.abs(qX - pX) < 0.01 ? 'TANGENTE' : 'SECANTE';
          ctx.fillText(`${slopeText} m = ${( (f(qX)-f(pX))/(qX-pX) ).toFixed(3)}`, 35, 60);

          if (diffInfo.status !== 'ok') {
             ctx.fillStyle = '#ef4444';
             ctx.font = 'bold 11px Inter';
             ctx.fillText(`! ${diffInfo.msg}`, 35, 85);
          } else {
             ctx.fillStyle = '#f97316';
             ctx.font = 'bold 11px Inter';
             ctx.fillText(`DERIVADA f'(P) ≈ ${diffInfo.value?.toFixed(3)}`, 35, 85);
          }

          ctx.fillStyle = '#64748b';
          ctx.font = '10px Inter';
          ctx.fillText(`h (distancia Q-P) = ${Math.abs(qX-pX).toFixed(3)}`, 35, 105);
        }
      }

      animationId = requestAnimationFrame(draw);
    };

    animationId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animationId);
  }, [dimensions, pX, qX, isPaused, showLabels, expression]);

  const handleMouseDown = (e: MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    const screenPX = dimensions.width / 2 + pX * SCALE_X;
    const screenPY = dimensions.height / 2 - (math.evaluate(expression, { x: pX }) ) * SCALE_Y;
    const screenQX = dimensions.width / 2 + qX * SCALE_X;
    const screenQY = dimensions.height / 2 - (math.evaluate(expression, { x: qX }) ) * SCALE_Y;

    const distP = Math.sqrt((mx - screenPX)**2 + (my - screenPY)**2);
    const distQ = Math.sqrt((mx - screenQX)**2 + (my - screenQY)**2);

    if (distP < 20) setDragTarget('P');
    else if (distQ < 20) setDragTarget('Q');
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!dragTarget) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const mx = e.clientX - rect.left;
    const newMathX = (mx - dimensions.width / 2) / SCALE_X;

    if (dragTarget === 'P') setPX(newMathX);
    else setQX(newMathX);
  };

  return (
    <div ref={containerRef} className="w-full h-full relative bg-white overflow-hidden rounded-xl shadow-inner border border-slate-200">
      {errorStatus && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-600 text-white px-4 py-1 rounded-full text-xs font-bold z-10">
          {errorStatus}
        </div>
      )}
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={() => setDragTarget(null)}
        onMouseLeave={() => setDragTarget(null)}
        className="cursor-crosshair w-full h-full block"
      />
    </div>
  );
}
