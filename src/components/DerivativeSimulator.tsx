import { useEffect, useRef, useState, MouseEvent } from 'react';

interface DerivativeSimulatorProps {
  isPaused: boolean;
  showLabels: boolean;
}

export default function DerivativeSimulator({ isPaused, showLabels }: DerivativeSimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouseX, setMouseX] = useState<number | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Handle Resize
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setDimensions({ width, height });
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Drawing Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = dimensions;
    canvas.width = width;
    canvas.height = height;

    // Mathematical configuration
    // f(x) = 0.005 * (x - width/2)^2 + 100
    const f = (x: number) => 0.005 * Math.pow(x - width / 2, 2) + 100;
    const df = (x: number) => 0.01 * (x - width / 2); // f'(x)

    let animationId: number;

    const draw = () => {
      if (isPaused) {
        animationId = requestAnimationFrame(draw);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // 1. Draw Grid
      ctx.strokeStyle = '#f1f1f1';
      ctx.lineWidth = 1;
      for (let i = 0; i < width; i += 50) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, height); ctx.stroke();
      }
      for (let i = 0; i < height; i += 50) {
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(width, i); ctx.stroke();
      }

      // 2. Draw Axes
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(width / 2, 0); ctx.lineTo(width / 2, height); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, height - 50); ctx.lineTo(width, height - 50); ctx.stroke();

      // 3. Draw Main Function Curve
      ctx.strokeStyle = '#1e293b'; // Slate 800
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let x = 0; x < width; x++) {
        ctx.lineTo(x, height - f(x));
      }
      ctx.stroke();

      // 4. Points & Lines
      const pX = width / 2 + 80;
      const pY = height - f(pX);
      const qX = mouseX !== null ? mouseX : pX + 100;
      const qY = height - f(qX);

      // Secant Line
      ctx.setLineDash([8, 8]);
      ctx.strokeStyle = '#94a3b8'; // Slate 400
      const mSec = (qY - pY) / (qX - pX || 0.001);
      ctx.beginPath();
      ctx.moveTo(pX - width, pY - mSec * width);
      ctx.lineTo(pX + width, pY + mSec * width);
      ctx.stroke();
      ctx.setLineDash([]);

      // Tangent Line
      const mTan = -df(pX); // Negated because Y points down in canvas
      ctx.strokeStyle = '#f97316'; // Orange 500
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(pX - 150, pY - mTan * 150);
      ctx.lineTo(pX + 150, pY + mTan * 150);
      ctx.stroke();

      // Points P and Q
      // P (Fixed position for demonstration)
      ctx.fillStyle = '#3b82f6'; // Blue 500
      ctx.beginPath(); ctx.arc(pX, pY, 7, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = 'white'; ctx.lineWidth = 2; ctx.stroke();

      // Q (Interactive)
      ctx.fillStyle = '#ef4444'; // Red 500
      ctx.beginPath(); ctx.arc(qX, qY, 7, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = 'white'; ctx.lineWidth = 2; ctx.stroke();

      if (showLabels) {
        // Annotation Overlay Style
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(0,0,0,0.1)';
        ctx.fillRect(30, 30, 140, 75);
        ctx.shadowBlur = 0;
        
        ctx.strokeStyle = '#e2e8f0';
        ctx.strokeRect(30, 30, 140, 75);

        ctx.fillStyle = '#94a3b8';
        ctx.font = 'bold 9px font-mono, monospace';
        ctx.fillText('PENDIENTE CALCULADA', 40, 50);

        ctx.fillStyle = '#f97316';
        ctx.font = 'bold 22px Inter, sans-serif';
        ctx.fillText(`m = ${(-mTan).toFixed(2)}`, 40, 78);
        
        ctx.fillStyle = '#94a3b8';
        ctx.font = 'italic 8px Inter, sans-serif';
        ctx.fillText('lim h → 0', 40, 92);

        // Point Labels
        ctx.font = 'bold 10px Inter, sans-serif';
        ctx.fillStyle = '#3b82f6';
        ctx.fillText('P (Fijo)', pX + 12, pY);
        ctx.fillStyle = '#ef4444';
        ctx.fillText('Q (Variable)', qX + 12, qY);
      }

      animationId = requestAnimationFrame(draw);
    };

    animationId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animationId);
  }, [dimensions, mouseX, isPaused, showLabels]);

  const handleMouseMove = (e: MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      setMouseX(e.clientX - rect.left);
    }
  };

  return (
    <div ref={containerRef} className="w-full h-full relative bg-white overflow-hidden rounded-xl shadow-inner border border-slate-200">
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setMouseX(null)}
        className="cursor-crosshair w-full h-full block"
      />
    </div>
  );
}
