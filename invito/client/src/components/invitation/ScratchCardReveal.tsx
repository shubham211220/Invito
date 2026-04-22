'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── State Machine ──────────────────────────────────────────
type RevealPhase = 'scratch' | 'transitioning' | 'revealed';

interface ScratchCardRevealProps {
  children: React.ReactNode;
  accentColor?: string;
  /** Called at the exact moment of reveal — use this to trigger music + confetti */
  onReveal?: () => void;
  /** Called when transition animation finishes and content is fully visible */
  onTransitionComplete?: () => void;
}

export default function ScratchCardReveal({
  children,
  accentColor = '#d4a574',
  onReveal,
  onTransitionComplete,
}: ScratchCardRevealProps) {
  // ─── State ──────────────────────────────────────────────
  const [phase, setPhase] = useState<RevealPhase>('scratch');
  const [isScratching, setIsScratching] = useState(false);
  const [scratchProgress, setScratchProgress] = useState(0);
  const [showSkip, setShowSkip] = useState(false);
  const [showHint, setShowHint] = useState(true);

  // ─── Refs ───────────────────────────────────────────────
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const revealLockRef = useRef(false); // prevents double-trigger
  const checkIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // ─── Canvas Setup ───────────────────────────────────────
  useEffect(() => {
    if (phase !== 'scratch') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const setSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setSize();

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;
    ctxRef.current = ctx;

    // Paint the cover
    const grd = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grd.addColorStop(0, '#08080f');
    grd.addColorStop(0.3, '#12101e');
    grd.addColorStop(0.7, '#150d1a');
    grd.addColorStop(1, '#08080f');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle accent orbs
    const orbs = [
      { x: 0.2, y: 0.3, r: 120 },
      { x: 0.8, y: 0.2, r: 100 },
      { x: 0.5, y: 0.7, r: 140 },
      { x: 0.3, y: 0.8, r: 90 },
    ];
    orbs.forEach(o => {
      ctx.beginPath();
      ctx.arc(canvas.width * o.x, canvas.height * o.y, o.r, 0, Math.PI * 2);
      ctx.fillStyle = `${accentColor}06`;
      ctx.fill();
    });

    // Stars / sparkle dots
    for (let i = 0; i < 60; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const size = Math.random() * 1.5 + 0.5;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.15 + 0.03})`;
      ctx.fill();
    }

    // Switch to eraser mode
    ctx.globalCompositeOperation = 'destination-out';

    // ─── Scratch Progress Detection (optimized sampling) ─────
    checkIntervalRef.current = setInterval(() => {
      if (revealLockRef.current) return;

      // Sample instead of reading entire canvas (perf optimization)
      const sampleSize = 100;
      const stepX = Math.floor(canvas.width / sampleSize);
      const stepY = Math.floor(canvas.height / sampleSize);
      let transparent = 0;
      let total = 0;

      for (let x = 0; x < canvas.width; x += stepX) {
        for (let y = 0; y < canvas.height; y += stepY) {
          const pixel = ctx.getImageData(x, y, 1, 1).data;
          if (pixel[3] === 0) transparent++;
          total++;
        }
      }

      const pct = transparent / total;
      setScratchProgress(pct);

      if (pct > 0.40) {
        triggerReveal();
      }
    }, 400);

    const onResize = () => setSize();
    window.addEventListener('resize', onResize);

    return () => {
      if (checkIntervalRef.current) clearInterval(checkIntervalRef.current);
      window.removeEventListener('resize', onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, accentColor]);

  // ─── Skip button after 3s ───────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => setShowSkip(true), 3000);
    return () => clearTimeout(t);
  }, []);

  // ─── Hide hint after first scratch ──────────────────────
  useEffect(() => {
    if (isScratching && showHint) setShowHint(false);
  }, [isScratching, showHint]);

  // ─── Scratch Drawing ───────────────────────────────────
  const scratch = useCallback((x: number, y: number) => {
    const ctx = ctxRef.current;
    if (!ctx || revealLockRef.current) return;

    // Larger brush with soft edge for natural feel
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, 45);
    gradient.addColorStop(0, 'rgba(0,0,0,1)');
    gradient.addColorStop(0.7, 'rgba(0,0,0,0.8)');
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, 45, 0, Math.PI * 2);
    ctx.fill();
  }, []);

  const getPos = useCallback((e: React.PointerEvent | React.TouchEvent, touch?: { clientX: number; clientY: number }) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return null;
    const clientX = touch ? touch.clientX : (e as React.PointerEvent).clientX;
    const clientY = touch ? touch.clientY : (e as React.PointerEvent).clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    setIsScratching(true);
    const pos = getPos(e);
    if (pos) scratch(pos.x, pos.y);
  }, [getPos, scratch]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isScratching) return;
    const pos = getPos(e);
    if (pos) scratch(pos.x, pos.y);
  }, [isScratching, getPos, scratch]);

  const handlePointerUp = useCallback(() => setIsScratching(false), []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setIsScratching(true);
    const pos = getPos(e, e.touches[0]);
    if (pos) scratch(pos.x, pos.y);
  }, [getPos, scratch]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    const pos = getPos(e, e.touches[0]);
    if (pos) scratch(pos.x, pos.y);
  }, [getPos, scratch]);

  const handleTouchEnd = useCallback(() => setIsScratching(false), []);

  // ─── Reveal Trigger (with lock) ─────────────────────────
  const triggerReveal = useCallback(() => {
    if (revealLockRef.current) return;
    revealLockRef.current = true;

    if (checkIntervalRef.current) clearInterval(checkIntervalRef.current);

    // Step 1: Fire callbacks immediately (music + confetti)
    onReveal?.();

    // Step 2: Begin cinematic transition
    setPhase('transitioning');

    // Mobile haptic feedback
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try { navigator.vibrate([50, 30, 80]); } catch {}
    }
  }, [onReveal]);

  // ─── When transition animation ends ─────────────────────
  const handleTransitionEnd = useCallback(() => {
    setPhase('revealed');
    onTransitionComplete?.();
    // Smooth scroll to top of invitation
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [onTransitionComplete]);

  // ─── Progress bar width ─────────────────────────────────
  const progressPct = Math.min(scratchProgress / 0.40 * 100, 100);

  // ═══════════════════════════════════════════════════════════
  //  PHASE: REVEALED — just show children
  // ═══════════════════════════════════════════════════════════
  if (phase === 'revealed') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {children}
      </motion.div>
    );
  }

  // ═══════════════════════════════════════════════════════════
  //  PHASE: TRANSITIONING — cinematic crossfade
  // ═══════════════════════════════════════════════════════════
  if (phase === 'transitioning') {
    return (
      <>
        {/* Scratch layer fading out with zoom + blur */}
        <motion.div
          ref={overlayRef}
          initial={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          animate={{ opacity: 0, scale: 0.92, filter: 'blur(12px)' }}
          transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
          onAnimationComplete={handleTransitionEnd}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            pointerEvents: 'none',
          }}
        >
          <canvas
            ref={canvasRef}
            style={{ position: 'absolute', inset: 0 }}
          />
        </motion.div>

        {/* Content rising from below with blur-to-clear */}
        <motion.div
          initial={{ opacity: 0, y: 60, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{
            duration: 1.2,
            delay: 0.15, // slight stagger after overlay starts fading
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          {children}
        </motion.div>
      </>
    );
  }

  // ═══════════════════════════════════════════════════════════
  //  PHASE: SCRATCH — interactive scratch card
  // ═══════════════════════════════════════════════════════════
  return (
    <>
      {/* Invitation content hidden underneath */}
      <div style={{ visibility: 'hidden', position: 'absolute', pointerEvents: 'none' }}>
        {children}
      </div>

      {/* Scratch overlay */}
      <div
        className="scratch-overlay"
        style={{
          background: '#08080f',
          cursor: 'crosshair',
        }}
      >
        {/* Canvas */}
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 2,
            touchAction: 'none',
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />

        {/* ─── Center Content ──────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, type: 'spring', bounce: 0.3 }}
          style={{
            zIndex: 1,
            textAlign: 'center',
            pointerEvents: 'none',
            userSelect: 'none',
            maxWidth: '400px',
            padding: '0 2rem',
          }}
        >
          {/* Envelope icon with glow */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              fontSize: '4.5rem',
              marginBottom: '1.5rem',
              filter: `drop-shadow(0 0 30px ${accentColor}40)`,
            }}
          >
            💌
          </motion.div>

          <h1 style={{
            fontSize: 'clamp(1.6rem, 5vw, 2.8rem)',
            fontWeight: 800,
            fontFamily: 'var(--font-display), Georgia, serif',
            marginBottom: '0.5rem',
            color: '#f5f0eb',
            lineHeight: 1.2,
          }}>
            You&apos;re Invited!
          </h1>

          <p style={{
            fontSize: '0.95rem',
            color: `${accentColor}bb`,
            marginBottom: '2rem',
            lineHeight: 1.6,
          }}>
            A special moment awaits you
          </p>

          {/* Scratch hint with shimmer */}
          <AnimatePresence>
            {showHint && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="scratch-hint"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.6rem 1.5rem',
                  borderRadius: '100px',
                  background: `${accentColor}12`,
                  border: `1px solid ${accentColor}25`,
                  color: accentColor,
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  marginBottom: '1.5rem',
                }}
              >
                <motion.span
                  animate={{ x: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ✨
                </motion.span>
                Scratch to reveal
                <motion.span
                  animate={{ x: [0, -5, 5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ✨
                </motion.span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Decorative rings */}
          <div style={{ position: 'relative', width: '130px', height: '130px', margin: '0 auto' }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              style={{
                position: 'absolute', inset: 0,
                borderRadius: '50%',
                border: `1px solid ${accentColor}20`,
                borderTopColor: `${accentColor}60`,
              }}
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
              style={{
                position: 'absolute', inset: '10px',
                borderRadius: '50%',
                border: `1px solid ${accentColor}15`,
                borderBottomColor: `${accentColor}40`,
              }}
            />
            <div style={{
              position: 'absolute', inset: '20px',
              borderRadius: '50%',
              background: `${accentColor}08`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2.5rem',
            }}>
              🎉
            </div>
          </div>

          {/* Progress bar */}
          {scratchProgress > 0.02 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                marginTop: '2rem',
                width: '200px',
                height: '3px',
                borderRadius: '4px',
                background: `${accentColor}15`,
                margin: '2rem auto 0',
                overflow: 'hidden',
              }}
            >
              <motion.div
                style={{
                  height: '100%',
                  borderRadius: '4px',
                  background: `linear-gradient(90deg, ${accentColor}60, ${accentColor})`,
                  width: `${progressPct}%`,
                  transition: 'width 0.3s ease-out',
                  boxShadow: `0 0 10px ${accentColor}40`,
                }}
              />
            </motion.div>
          )}
        </motion.div>

        {/* ─── Skip Button ─────────────────────────────────── */}
        <AnimatePresence>
          {showSkip && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.2 }}
              onClick={() => triggerReveal()}
              style={{
                position: 'absolute',
                bottom: '2.5rem',
                zIndex: 10,
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: '#868e96',
                padding: '0.6rem 1.5rem',
                borderRadius: '100px',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: 500,
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s',
              }}
            >
              Skip → View Invitation
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
