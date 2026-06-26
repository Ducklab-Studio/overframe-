'use client';

import { useEffect, useRef } from 'react';

interface Line {
  points: { x: number; y: number }[];
  offset: number;
  speed: number;
  opacity: number;
  width: number;
}

function generateOrganicLine(canvasW: number, canvasH: number, seed: number, count: number): Line {
  const points: { x: number; y: number }[] = [];
  const startY = (seed / count) * canvasH;
  const segments = 12 + Math.floor(Math.sin(seed) * 4);

  let x = 0;
  let y = startY + Math.sin(seed * 1.3) * canvasH * 0.12;
  points.push({ x, y });

  for (let i = 1; i <= segments; i++) {
    x = (canvasW / segments) * i;
    const wave1 = Math.sin(seed * 0.7 + i * 0.6) * canvasH * 0.08;
    const wave2 = Math.cos(seed * 1.1 + i * 0.4) * canvasH * 0.05;
    y = startY + wave1 + wave2;
    points.push({ x, y });
  }

  return {
    points,
    offset: 0,
    speed: 0.3 + Math.abs(Math.sin(seed)) * 0.5,
    opacity: 0.08 + Math.abs(Math.sin(seed * 2.1)) * 0.18,
    width: 0.6 + Math.abs(Math.cos(seed)) * 0.8,
  };
}

export const CircuitLines = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let lines: Line[] = [];
    let visible = true;

    const isMobile = () => window.innerWidth < 768;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      const count = isMobile() ? 8 : 18;
      lines = Array.from({ length: count }, (_, i) =>
        generateOrganicLine(canvas.width, canvas.height, i * (18 / count) * 1.1, count)
      );
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });

    const draw = () => {
      if (!visible) {
        animId = requestAnimationFrame(draw);
        return;
      }

      const mobile = isMobile();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const line of lines) {
        line.offset += line.speed;

        const dashLen = 80 + line.width * 30;
        const gapLen = 200 + line.width * 60;

        ctx.save();
        ctx.beginPath();

        for (let i = 0; i < line.points.length - 1; i++) {
          const p0 = line.points[Math.max(0, i - 1)];
          const p1 = line.points[i];
          const p2 = line.points[i + 1];
          const p3 = line.points[Math.min(line.points.length - 1, i + 2)];

          const cp1x = p1.x + (p2.x - p0.x) / 6;
          const cp1y = p1.y + (p2.y - p0.y) / 6;
          const cp2x = p2.x - (p3.x - p1.x) / 6;
          const cp2y = p2.y - (p3.y - p1.y) / 6;

          if (i === 0) ctx.moveTo(p1.x, p1.y);
          ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
        }

        if (!mobile) {
          ctx.shadowColor = '#E10600';
          ctx.shadowBlur = 4;
        }
        ctx.strokeStyle = `rgba(225, 6, 0, ${line.opacity})`;
        ctx.lineWidth = line.width;
        ctx.setLineDash([dashLen, gapLen]);
        ctx.lineDashOffset = -line.offset;
        ctx.stroke();
        ctx.shadowBlur = 0;

        ctx.restore();
      }

      animId = requestAnimationFrame(draw);
    };

    const observer = new IntersectionObserver(
      ([entry]) => { visible = entry.isIntersecting; },
      { threshold: 0 }
    );
    observer.observe(canvas);

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
      style={{ willChange: 'transform' }}
    />
  );
};
