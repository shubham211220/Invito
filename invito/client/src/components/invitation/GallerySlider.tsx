'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface GallerySliderProps {
  images: string[];
  accentColor?: string;
  interval?: number;
}

export default function GallerySlider({ images, accentColor = '#d4a574', interval = 5000 }: GallerySliderProps) {
  const [current, setCurrent] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (images.length <= 1) return;
    timerRef.current = setInterval(() => {
      setCurrent((p) => (p + 1) % images.length);
    }, interval);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [images.length, interval]);

  const goTo = (idx: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setCurrent(idx);
    timerRef.current = setInterval(() => {
      setCurrent((p) => (p + 1) % images.length);
    }, interval);
  };

  if (!images.length) return null;

  return (
    <>
      {/* Slideshow */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        style={{ position: 'relative', borderRadius: '20px', overflow: 'hidden', aspectRatio: '16/10' }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1, transition: { duration: 0.8 } }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.5 } }}
            style={{
              position: 'absolute',
              inset: 0,
              cursor: 'pointer',
              animation: 'ken-burns 12s ease-in-out infinite',
            }}
            onClick={() => setLightbox(current)}
          >
            <Image
              src={images[current]}
              alt={`Gallery image ${current + 1}`}
              fill
              style={{ objectFit: 'cover' }}
              unoptimized
            />
          </motion.div>
        </AnimatePresence>

        {/* Gradient overlay */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '80px',
          background: 'linear-gradient(transparent, rgba(0,0,0,0.5))',
          pointerEvents: 'none',
        }} />

        {/* Dots */}
        {images.length > 1 && (
          <div style={{
            position: 'absolute',
            bottom: '1rem',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '0.4rem',
            zIndex: 5,
          }}>
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                style={{
                  width: i === current ? '24px' : '8px',
                  height: '8px',
                  borderRadius: '100px',
                  border: 'none',
                  background: i === current ? accentColor : 'rgba(255,255,255,0.4)',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                }}
              />
            ))}
          </div>
        )}

        {/* Nav arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => goTo((current - 1 + images.length) % images.length)}
              style={{
                position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)',
                width: '36px', height: '36px', borderRadius: '50%',
                background: 'rgba(0,0,0,0.4)', border: 'none', color: '#fff',
                cursor: 'pointer', fontSize: '1.2rem', display: 'flex',
                alignItems: 'center', justifyContent: 'center', zIndex: 5,
                backdropFilter: 'blur(10px)',
              }}
            >
              ‹
            </button>
            <button
              onClick={() => goTo((current + 1) % images.length)}
              style={{
                position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)',
                width: '36px', height: '36px', borderRadius: '50%',
                background: 'rgba(0,0,0,0.4)', border: 'none', color: '#fff',
                cursor: 'pointer', fontSize: '1.2rem', display: 'flex',
                alignItems: 'center', justifyContent: 'center', zIndex: 5,
                backdropFilter: 'blur(10px)',
              }}
            >
              ›
            </button>
          </>
        )}
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lightbox-overlay"
            onClick={() => setLightbox(null)}
          >
            <motion.div
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.85 }}
              style={{ position: 'relative', maxWidth: '90vw', maxHeight: '85vh', borderRadius: '16px', overflow: 'hidden' }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[lightbox]}
                alt={`Gallery image ${lightbox + 1}`}
                width={1200}
                height={800}
                style={{ width: '100%', height: 'auto', maxHeight: '85vh', objectFit: 'contain' }}
                unoptimized
              />
              <button
                onClick={() => setLightbox(null)}
                style={{
                  position: 'absolute', top: '1rem', right: '1rem',
                  width: '40px', height: '40px', borderRadius: '50%',
                  background: 'rgba(0,0,0,0.6)', border: 'none', color: '#fff',
                  cursor: 'pointer', fontSize: '1.25rem', backdropFilter: 'blur(10px)',
                }}
              >
                ×
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
