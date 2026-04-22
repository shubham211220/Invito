'use client';

import { useEffect, useRef, useMemo } from 'react';

type ParticleType = 'petals' | 'sparkles' | 'confetti' | 'bubbles';

interface FloatingParticlesProps {
  type?: ParticleType;
  color?: string;
  count?: number;
}

interface Particle {
  x: number; y: number; size: number;
  speedX: number; speedY: number; rotation: number; rotSpeed: number;
  opacity: number; hue: number; life: number; maxLife: number;
}

const CONFIGS: Record<ParticleType, { baseSize: number; speed: number; rotates: boolean }> = {
  petals:   { baseSize: 12, speed: 0.6, rotates: true },
  sparkles: { baseSize: 4,  speed: 0.3, rotates: false },
  confetti: { baseSize: 8,  speed: 0.8, rotates: true },
  bubbles:  { baseSize: 6,  speed: 0.4, rotates: false },
};

export default function FloatingParticles({ type = 'petals', color = '#d4a574', count = 25 }: FloatingParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const reducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  useEffect(() => {
    if (reducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const cfg = CONFIGS[type];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const hexToRgb = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return { r, g, b };
    };
    const rgb = hexToRgb(color);

    const createParticle = (): Particle => ({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * canvas.height,
      size: cfg.baseSize * (0.5 + Math.random() * 0.8),
      speedX: (Math.random() - 0.5) * 1.2,
      speedY: cfg.speed * (0.5 + Math.random()),
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.03,
      opacity: 0.2 + Math.random() * 0.5,
      hue: Math.random() * 30 - 15,
      life: 0,
      maxLife: 400 + Math.random() * 600,
    });

    const particles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      const p = createParticle();
      p.y = Math.random() * canvas.height;
      p.life = Math.random() * p.maxLife;
      particles.push(p);
    }

    const drawPetal = (p: Particle) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.globalAlpha = p.opacity * Math.min(1, p.life / 60) * Math.min(1, (p.maxLife - p.life) / 60);
      ctx.fillStyle = `rgba(${rgb.r + p.hue}, ${rgb.g + p.hue}, ${rgb.b}, 1)`;
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size, p.size * 0.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const drawSparkle = (p: Particle) => {
      const alpha = p.opacity * (0.5 + 0.5 * Math.sin(p.life * 0.05)) * Math.min(1, p.life / 40) * Math.min(1, (p.maxLife - p.life) / 40);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`;
      ctx.shadowBlur = p.size * 3;
      ctx.shadowColor = color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const drawConfetti = (p: Particle) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.globalAlpha = p.opacity * Math.min(1, p.life / 40) * Math.min(1, (p.maxLife - p.life) / 40);
      const colors = [color, '#ffd700', '#ff6b9d', '#60a5fa'];
      ctx.fillStyle = colors[Math.floor(p.hue + 15) % colors.length];
      ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      ctx.restore();
    };

    const drawBubble = (p: Particle) => {
      const alpha = p.opacity * 0.4 * Math.min(1, p.life / 60) * Math.min(1, (p.maxLife - p.life) / 60);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.6)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    };

    const drawFn = { petals: drawPetal, sparkles: drawSparkle, confetti: drawConfetti, bubbles: drawBubble }[type];

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.speedX + Math.sin(p.life * 0.01) * 0.3;
        p.y += p.speedY;
        if (cfg.rotates) p.rotation += p.rotSpeed;
        p.life++;
        if (p.life >= p.maxLife || p.y > canvas.height + 20) {
          particles[i] = createParticle();
        }
        drawFn(p);
      }
      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [type, color, count, reducedMotion]);

  if (reducedMotion) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2,
        pointerEvents: 'none',
      }}
    />
  );
}
