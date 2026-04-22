'use client';

import { useCallback, useImperativeHandle, forwardRef } from 'react';
import confetti from 'canvas-confetti';

export interface ConfettiRef {
  fire: (type?: 'confetti' | 'fireworks' | 'stars') => void;
}

const ConfettiEffect = forwardRef<ConfettiRef, { accentColor?: string }>(
  ({ accentColor = '#d4a574' }, ref) => {
    const fireConfetti = useCallback((type: 'confetti' | 'fireworks' | 'stars' = 'confetti') => {
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
