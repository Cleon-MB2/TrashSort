import { useEffect, useRef } from 'react';

interface ConfettiBurstProps {
  triggerKey: number;
  origin?: { x: number; y: number } | null;
  mode?: 'bin' | 'victory';
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  tiltAngle: number;
  tiltSpeed: number;
  shape: 'rect' | 'leaf' | 'circle';
  opacity: number;
}

const GREEN_PALETTE = [
  '#059669', // Emerald 600
  '#10B981', // Emerald 500
  '#22C55E', // Green 500
  '#4ADE80', // Green 400
  '#84CC16', // Lime 500
  '#A3E635', // Lime 400
  '#047857', // Emerald 700
  '#34D399', // Emerald 400
];

export function ConfettiBurst({ triggerKey, origin, mode = 'bin' }: ConfettiBurstProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (triggerKey <= 0) return;
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const spawnX = origin ? origin.x : width * 0.5;
    const spawnY = origin ? origin.y : mode === 'victory' ? height * 0.25 : height * 0.55;
    const count = mode === 'victory' ? 120 : 80;
    const shapes: Array<'rect' | 'leaf' | 'circle'> = ['rect', 'rect', 'leaf', 'circle'];

    for (let i = 0; i < count; i++) {
      const spreadAngle =
        mode === 'victory'
          ? -Math.PI / 2 + (Math.random() - 0.5) * 2.2
          : -Math.PI / 2 + (Math.random() - 0.5) * 1.65;
      const speed =
        mode === 'victory'
          ? 7 + Math.random() * 14
          : 8 + Math.random() * 13;

      particlesRef.current.push({
        x: mode === 'victory' ? Math.random() * width : spawnX + (Math.random() - 0.5) * 40,
        y: mode === 'victory' ? -20 + Math.random() * 60 : spawnY,
        vx: Math.cos(spreadAngle) * speed + (Math.random() - 0.5) * 3,
        vy: mode === 'victory' ? 2 + Math.random() * 6 : Math.sin(spreadAngle) * speed - 2,
        size: 7 + Math.random() * 8,
        color: GREEN_PALETTE[Math.floor(Math.random() * GREEN_PALETTE.length)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.24,
        tiltAngle: Math.random() * Math.PI * 2,
        tiltSpeed: 0.08 + Math.random() * 0.12,
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        opacity: 1,
      });
    }

    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      const list = particlesRef.current;
      for (let i = list.length - 1; i >= 0; i--) {
        const p = list[i];
        p.vy += 0.36; // Gravity
        p.vx *= 0.985; // Air resistance
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        p.tiltAngle += p.tiltSpeed;

        if (p.y > height * 0.85) {
          p.opacity -= 0.04;
        }

        if (p.opacity <= 0 || p.y > height + 40) {
          list.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        const flutterScaleX = Math.cos(p.tiltAngle);
        ctx.scale(flutterScaleX, 1);
        ctx.fillStyle = p.color;

        if (p.shape === 'rect') {
          ctx.fillRect(-p.size / 2, -p.size * 0.35, p.size, p.size * 0.7);
        } else if (p.shape === 'leaf') {
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size * 0.65, p.size * 0.35, 0, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.38, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      if (list.length > 0) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, width, height);
        rafRef.current = null;
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [triggerKey, origin, mode]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 z-50 pointer-events-none w-full h-full"
    />
  );
}
