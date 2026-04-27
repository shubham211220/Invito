'use client';

import { useState, useRef, useEffect, useImperativeHandle, forwardRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface MusicPlayerRef {
  /** Start playback with fade-in (called externally by scratch reveal) */
  startPlayback: () => Promise<void>;
}

interface MusicPlayerProps {
  accentColor?: string;
  /** If true, hides the button until showPlayer() is called (controlled by parent) */
  hidden?: boolean;
  trackUrl?: string;
  category?: string;
}

const defaultTracks: Record<string, string> = {
  wedding: 'https://cdn.pixabay.com/audio/2022/03/15/audio_79bfb2c45e.mp3', // Romantic piano
  birthday: 'https://cdn.pixabay.com/audio/2022/01/18/audio_d0a13f69d2.mp3', // Upbeat pop
  party: 'https://cdn.pixabay.com/audio/2021/08/04/audio_12b0c7443c.mp3', // Electronic dance
  engagement: 'https://cdn.pixabay.com/audio/2022/02/07/audio_d214ed0952.mp3', // Acoustic love
  corporate: 'https://cdn.pixabay.com/audio/2021/11/25/audio_91b32e02f9.mp3', // Ambient corporate
  default: 'https://cdn.pixabay.com/audio/2024/11/29/audio_8b0152cac9.mp3', // Chill ambient
};

    const MusicPlayer = forwardRef<MusicPlayerRef, MusicPlayerProps>(
      ({ accentColor = '#d4a574', hidden = false, trackUrl, category }, ref) => {
        const [playing, setPlaying] = useState(false);
        const [visible, setVisible] = useState(!hidden);
        const audioRef = useRef<HTMLAudioElement | null>(null);
        const fadeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

        useEffect(() => {
          const audio = new Audio();
          audio.loop = true;
          audio.volume = 0;
          audio.preload = 'auto';
          audio.crossOrigin = 'anonymous';

          const src = trackUrl || (category ? defaultTracks[category] : null) || defaultTracks.default;
          audio.src = src;
      audioRef.current = audio;

      return () => {
        if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
        audio.pause();
        audio.src = '';
      };
    }, []);

    // When hidden prop changes to false, show the button
    useEffect(() => {
      if (!hidden) setVisible(true);
    }, [hidden]);

    const fadeIn = useCallback((targetVol: number = 0.35, durationMs: number = 1500) => {
      const audio = audioRef.current;
      if (!audio) return;

      if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);

      const steps = durationMs / 50;
      const increment = targetVol / steps;
      audio.volume = 0;

      fadeIntervalRef.current = setInterval(() => {
        const newVol = Math.min(audio.volume + increment, targetVol);
        audio.volume = newVol;
        if (newVol >= targetVol) {
          if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
        }
      }, 50);
    }, []);

    const fadeOut = useCallback((durationMs: number = 500) => {
      const audio = audioRef.current;
      if (!audio) return;

      if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);

      const steps = durationMs / 50;
      const decrement = audio.volume / steps;

      fadeIntervalRef.current = setInterval(() => {
        const newVol = Math.max(audio.volume - decrement, 0);
        audio.volume = newVol;
        if (newVol <= 0) {
          audio.pause();
          if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
        }
      }, 50);
    }, []);

    const startPlayback = useCallback(async () => {
      const audio = audioRef.current;
      if (!audio || playing) return;

      try {
        audio.volume = 0;
        await audio.play();
        fadeIn(0.35, 1500);
        setPlaying(true);
        setVisible(true);
      } catch {
        // Browser blocked — will be available via toggle
        setVisible(true);
      }
    }, [playing, fadeIn]);

    const toggle = useCallback(async () => {
      const audio = audioRef.current;
      if (!audio) return;

      if (playing) {
        fadeOut(500);
        setPlaying(false);
      } else {
        try {
          audio.volume = 0;
          await audio.play();
          fadeIn(0.35, 800);
          setPlaying(true);
        } catch {
          // Autoplay blocked
        }
      }
    }, [playing, fadeIn, fadeOut]);

    useImperativeHandle(ref, () => ({ startPlayback }), [startPlayback]);

    // Parse accent color for rgba
    const r = parseInt(accentColor.slice(1, 3), 16);
    const g = parseInt(accentColor.slice(3, 5), 16);
    const b = parseInt(accentColor.slice(5, 7), 16);

    return (
      <AnimatePresence>
        {visible && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="music-player-btn"
            onClick={toggle}
            aria-label={playing ? 'Pause music' : 'Play music'}
            style={{
              background: playing
                ? `rgba(${r},${g},${b},0.18)`
                : 'rgba(255,255,255,0.08)',
              backdropFilter: 'blur(20px)',
              boxShadow: playing
                ? `0 0 25px rgba(${r},${g},${b},0.2)`
                : '0 4px 15px rgba(0,0,0,0.2)',
            }}
            title={playing ? 'Pause music' : 'Play music'}
          >
            {playing ? (
              <>
                <span className="eq-bar playing" style={{ height: '14px', background: accentColor }} />
                <span className="eq-bar playing" style={{ height: '20px', background: accentColor }} />
                <span className="eq-bar playing" style={{ height: '10px', background: accentColor }} />
              </>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18V5l12-2v13" />
                <circle cx="6" cy="18" r="3" fill={accentColor} opacity="0.3" />
                <circle cx="18" cy="16" r="3" fill={accentColor} opacity="0.3" />
              </svg>
            )}
          </motion.button>
        )}
      </AnimatePresence>
    );
  }
);

MusicPlayer.displayName = 'MusicPlayer';
export default MusicPlayer;
