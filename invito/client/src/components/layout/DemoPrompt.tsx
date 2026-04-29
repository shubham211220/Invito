'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { HiOutlineSparkles, HiXMark } from 'react-icons/hi2';

const STORAGE_KEY = 'invito_demo_seen';

/**
 * A floating prompt that appears for first-time visitors on the homepage,
 * encouraging them to try the live demo invitation.
 * 
 * - Appears after 3 seconds on first visit
 * - Auto-dismisses after 12 seconds
 * - Once dismissed, never shown again (localStorage flag)
 */
export default function DemoPrompt() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Don't show if already seen
    if (typeof window === 'undefined') return;
    if (localStorage.getItem(STORAGE_KEY)) return;

    const showTimer = setTimeout(() => {
      setVisible(true);
    }, 3000);

    return () => clearTimeout(showTimer);
  }, []);

  // Auto-dismiss after 12 seconds of being visible
  useEffect(() => {
    if (!visible) return;

    const autoDismiss = setTimeout(() => {
      handleDismiss();
    }, 12000);

    return () => clearTimeout(autoDismiss);
  }, [visible]);

  const handleDismiss = () => {
    setVisible(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, 'true');
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 80, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          style={{
            position: 'fixed',
            bottom: '1.25rem',
            right: '1.25rem',
            left: 'auto',
            zIndex: 1000,
            maxWidth: '360px',
            width: 'calc(100vw - 2.5rem)',
            padding: '1.5rem',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, rgba(15,15,30,0.95), rgba(25,20,40,0.95))',
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(30px)',
            WebkitBackdropFilter: 'blur(30px)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(92,124,250,0.1)',
          }}
        >
          {/* Close button */}
          <button
            onClick={handleDismiss}
            aria-label="Dismiss demo prompt"
            style={{
              position: 'absolute',
              top: '0.75rem',
              right: '0.75rem',
              background: 'rgba(255,255,255,0.08)',
              border: 'none',
              borderRadius: '50%',
              width: '28px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#868e96',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
              e.currentTarget.style.color = '#f1f3f5';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
              e.currentTarget.style.color = '#868e96';
            }}
          >
            <HiXMark size={16} />
          </button>

          {/* Emoji wave */}
          <motion.div
            animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
            transition={{ duration: 2.5, ease: 'easeInOut', delay: 0.3 }}
            style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}
          >
            👋
          </motion.div>

          {/* Text */}
          <h3 style={{
            fontSize: '1.05rem',
            fontWeight: 700,
            color: '#f1f3f5',
            marginBottom: '0.4rem',
            lineHeight: 1.3,
          }}>
            Want to see how invitations work?
          </h3>
          <p style={{
            fontSize: '0.85rem',
            color: '#868e96',
            marginBottom: '1.25rem',
            lineHeight: 1.5,
          }}>
            Preview a fully interactive invitation with animations, music, and more.
          </p>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <motion.div
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              style={{ flex: 1 }}
            >
              <Link
                href="/invite/demo-invite"
                onClick={handleDismiss}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  padding: '0.7rem 1rem',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #4c6ef5, #7c3aed)',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  textDecoration: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                }}
              >
                <HiOutlineSparkles />
                View Demo
              </Link>
            </motion.div>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleDismiss}
              style={{
                padding: '0.7rem 1.25rem',
                borderRadius: '12px',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#adb5bd',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'all 0.3s',
              }}
            >
              Skip
            </motion.button>
          </div>

          {/* Subtle progress bar for auto-dismiss */}
          <motion.div
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{ duration: 12, ease: 'linear' }}
            style={{
              position: 'absolute',
              bottom: 0,
              left: '1rem',
              right: '1rem',
              height: '2px',
              borderRadius: '1px',
              background: 'linear-gradient(90deg, #4c6ef5, #7c3aed)',
              transformOrigin: 'left',
              opacity: 0.5,
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
