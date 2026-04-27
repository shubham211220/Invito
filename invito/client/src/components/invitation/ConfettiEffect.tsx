'use client';

import { useCallback, useImperativeHandle, forwardRef } from 'react';
import confetti from 'canvas-confetti';

export interface ConfettiRef {
  fire: (type?: 'confetti' | 'fireworks' | 'stars' | 'continuous' | 'celebration') => void;
}

const ConfettiEffect = forwardRef<ConfettiRef, { accentColor?: string }>(
  ({ accentColor = '#d4a574' }, ref) => {
    const fireConfetti = useCallback((type: 'confetti' | 'fireworks' | 'stars' | 'continuous' | 'celebration' = 'confetti') => {
      const colors = [accentColor, '#ffd700', '#ff6b9d', '#c084fc', '#60a5fa'];

      if (type === 'fireworks') {
        const duration = 3000;
        const end = Date.now() + duration;
        const frame = () => {
          confetti({
            particleCount: 3,
            angle: 60,
            spread: 55,
            origin: { x: 0, y: 0.7 },
            colors,
          });
          confetti({
            particleCount: 3,
            angle: 120,
            spread: 55,
            origin: { x: 1, y: 0.7 },
            colors,
          });
          if (Date.now() < end) requestAnimationFrame(frame);
        };
        frame();
      } else if (type === 'stars') {
        confetti({
          particleCount: 80,
          spread: 100,
          origin: { y: 0.6 },
          shapes: ['star'],
          colors,
          scalar: 1.2,
        });
      } else if (type === 'continuous') {
        const duration = 15 * 1000;
        const animationEnd = Date.now() + duration;
        let skew = 1;

        (function frame() {
          const timeLeft = animationEnd - Date.now();
          const ticks = Math.max(200, 500 * (timeLeft / duration));
          skew = Math.max(0.8, skew - 0.001);

          confetti({
            particleCount: 1,
            startVelocity: 0,
            ticks: ticks,
            origin: {
              x: Math.random(),
              y: (Math.random() * skew) - 0.2
            },
            colors,
            shapes: ['circle'],
            gravity: 0.5,
            scalar: Math.random() * 0.5 + 0.5,
            disableForReducedMotion: true
          });

          if (timeLeft > 0) {
            requestAnimationFrame(frame);
          }
        }());
      } else if (type === 'celebration') {
        // Sequential bursts
        const count = 200;
        const defaults = { origin: { y: 0.7 }, colors };

        function fire(particleRatio: number, opts: any) {
          confetti(Object.assign({}, defaults, opts, {
            particleCount: Math.floor(count * particleRatio)
          }));
        }

        fire(0.25, { spread: 26, startVelocity: 55 });
        fire(0.2, { spread: 60 });
        fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
        fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
        fire(0.1, { spread: 120, startVelocity: 45 });
      } else {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors,
          gravity: 0.8,
          ticks: 200,
        });
        setTimeout(() => {
          confetti({
            particleCount: 60,
            angle: 60,
            spread: 50,
            origin: { x: 0.2, y: 0.7 },
            colors,
          });
          confetti({
            particleCount: 60,
            angle: 120,
            spread: 50,
            origin: { x: 0.8, y: 0.7 },
            colors,
          });
        }, 300);
      }
    }, [accentColor]);

    useImperativeHandle(ref, () => ({ fire: fireConfetti }), [fireConfetti]);

    return null;
  }
);

ConfettiEffect.displayName = 'ConfettiEffect';
export default ConfettiEffect;
