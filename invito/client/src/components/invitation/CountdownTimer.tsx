'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface CountdownTimerProps {
  targetDate: string;
  accentColor?: string;
  cardBg?: string;
}

function useCountdown(targetDate: string) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: false });

  useEffect(() => {
    const calc = () => {
      const now = Date.now();
      const target = new Date(targetDate).getTime();
      const diff = target - now;
      if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
        expired: false,
      };
    };
    setTimeLeft(calc());
    const timer = setInterval(() => setTimeLeft(calc()), 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return timeLeft;
}

function FlipDigit({ value, label, accentColor, cardBg }: { value: number; label: string; accentColor: string; cardBg: string }) {
  const prevRef = useRef(value);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (prevRef.current !== value) {
      setAnimate(true);
      prevRef.current = value;
      const t = setTimeout(() => setAnimate(false), 400);
      return () => clearTimeout(t);
    }
  }, [value]);

  const display = String(value).padStart(2, '0');

  return (
    <div style={{ textAlign: 'center' }}>
      <motion.div
        animate={animate ? { rotateX: [0, -15, 0], scale: [1, 1.05, 1] } : {}}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        style={{
          padding: '1rem 0.5rem',
          borderRadius: '16px',
          background: cardBg,
          border: `1px solid ${accentColor}20`,
          position: 'relative',
          overflow: 'hidden',
          minWidth: '70px',
          boxShadow: `0 4px 20px rgba(0,0,0,0.2), inset 0 1px 0 ${accentColor}10`,
        }}
      >
        {/* Shine line */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: 0,
          right: 0,
          height: '1px',
          background: `${accentColor}10`,
        }} />
        <p style={{
          fontSize: 'clamp(1.5rem, 5vw, 2.25rem)',
          fontWeight: 800,
          color: accentColor,
          fontFamily: 'var(--font-poppins), system-ui, sans-serif',
          lineHeight: 1,
        }}>
          {display}
        </p>
      </motion.div>
      <p style={{
        fontSize: '0.65rem',
        color: `${accentColor}99`,
        textTransform: 'uppercase',
        letterSpacing: '0.15em',
        marginTop: '0.5rem',
        fontWeight: 600,
      }}>
        {label}
      </p>
    </div>
  );
}

export default function CountdownTimer({
  targetDate,
  accentColor = '#d4a574',
  cardBg = 'rgba(212,165,116,0.06)',
}: CountdownTimerProps) {
  const countdown = useCountdown(targetDate);

  if (countdown.expired) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          textAlign: 'center',
          padding: '2rem',
          borderRadius: '20px',
          background: cardBg,
          border: `1px solid ${accentColor}15`,
        }}
      >
        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🎊</div>
        <p style={{ fontSize: '1.1rem', fontWeight: 700, color: accentColor }}>The celebration has begun!</p>
      </motion.div>
    );
  }

  const items = [
    { val: countdown.days, label: 'Days' },
    { val: countdown.hours, label: 'Hours' },
    { val: countdown.minutes, label: 'Minutes' },
    { val: countdown.seconds, label: 'Seconds' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
    >
      <p style={{
        textAlign: 'center',
        fontSize: '0.8rem',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.2em',
        color: `${accentColor}99`,
        marginBottom: '1rem',
      }}>
        Counting Down To
      </p>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '0.75rem',
        maxWidth: '440px',
        margin: '0 auto',
      }}>
        {items.map((item) => (
          <FlipDigit key={item.label} value={item.val} label={item.label} accentColor={accentColor} cardBg={cardBg} />
        ))}
      </div>
    </motion.div>
  );
}
