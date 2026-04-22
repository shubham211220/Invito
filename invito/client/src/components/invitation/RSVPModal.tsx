'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ConfettiEffect, { ConfettiRef } from './ConfettiEffect';

interface RSVPModalProps {
  slug: string;
  accentColor?: string;
  cardBg?: string;
  textColor?: string;
  mutedColor?: string;
  apiPost: (url: string, data: unknown) => Promise<unknown>;
}

export default function RSVPModal({
  slug,
  accentColor = '#d4a574',
  cardBg = 'rgba(212,165,116,0.06)',
  textColor = '#f5f0eb',
  mutedColor = '#a09080',
  apiPost,
}: RSVPModalProps) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ guestName: '', attending: true, message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const confettiRef = useRef<ConfettiRef>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.guestName.trim()) return;
    setSubmitting(true);
    try {
      await apiPost(`/rsvp/${slug}`, form);
      setSubmitted(true);
      confettiRef.current?.fire('confetti');
      setTimeout(() => confettiRef.current?.fire('stars'), 500);
    } catch {
      // error handled by parent
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.85rem 1rem',
    borderRadius: '12px',
    background: `${accentColor}08`,
    border: `1px solid ${accentColor}20`,
    color: textColor,
    fontSize: '0.95rem',
    outline: 'none',
    fontFamily: 'inherit',
    transition: 'all 0.3s',
  };

  return (
    <>
      <ConfettiEffect ref={confettiRef} accentColor={accentColor} />

      {/* RSVP Trigger Button */}
      {!submitted ? (
        <motion.button
          whileHover={{ scale: 1.03, boxShadow: `0 0 40px ${accentColor}30` }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setOpen(true)}
          className="btn-glow"
          style={{
            background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`,
            color: '#000',
            width: '100%',
            maxWidth: '320px',
            margin: '0 auto',
            display: 'flex',
            fontSize: '1.05rem',
          }}
        >
          💌 RSVP Now
        </motion.button>
      ) : (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          style={{
            textAlign: 'center',
            padding: '2rem',
            borderRadius: '20px',
            background: cardBg,
            border: `1px solid ${accentColor}15`,
          }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎊</div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.5rem', color: textColor }}>
            Thank You!
          </h3>
          <p style={{ color: mutedColor }}>Your response has been recorded. See you there! 💕</p>
        </motion.div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {open && !submitted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 300,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(0,0,0,0.7)',
              backdropFilter: 'blur(8px)',
              padding: '1rem',
            }}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 40 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-premium"
              style={{
                borderRadius: '24px',
                padding: '2.5rem 2rem',
                maxWidth: '440px',
                width: '100%',
                position: 'relative',
              }}
            >
              {/* Close */}
              <button
                onClick={() => setOpen(false)}
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: 'none',
                  border: 'none',
                  color: mutedColor,
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  lineHeight: 1,
                }}
              >
                ×
              </button>

              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                style={{ textAlign: 'center', marginBottom: '2rem' }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>💌</div>
                <h2 style={{
                  fontSize: '1.5rem',
                  fontWeight: 800,
                  color: textColor,
                  fontFamily: 'var(--font-display), Georgia, serif',
                  marginBottom: '0.25rem',
                }}>
                  RSVP
                </h2>
                <p style={{ color: mutedColor, fontSize: '0.9rem' }}>Will you be joining us?</p>
              </motion.div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* Name */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: mutedColor, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Your Name *
                  </label>
                  <input
                    value={form.guestName}
                    onChange={(e) => setForm(p => ({ ...p, guestName: e.target.value }))}
                    placeholder="Enter your full name"
                    required
                    style={inputStyle}
                  />
                </motion.div>

                {/* Attending */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: mutedColor, marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Will you attend?
                  </label>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    {[true, false].map((val) => (
                      <button
                        key={String(val)}
                        type="button"
                        onClick={() => setForm(p => ({ ...p, attending: val }))}
                        style={{
                          flex: 1,
                          padding: '0.85rem',
                          borderRadius: '12px',
                          cursor: 'pointer',
                          border: `1px solid ${form.attending === val ? accentColor : accentColor + '25'}`,
                          background: form.attending === val ? `${accentColor}15` : 'transparent',
                          color: form.attending === val ? accentColor : mutedColor,
                          fontWeight: 600,
                          fontSize: '0.9rem',
                          transition: 'all 0.3s',
                          fontFamily: 'inherit',
                        }}
                      >
                        {val ? '✓ Yes, I\'ll be there!' : '✕ Can\'t make it'}
                      </button>
                    ))}
                  </div>
                </motion.div>

                {/* Message */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: mutedColor, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Message (optional)
                  </label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm(p => ({ ...p, message: e.target.value }))}
                    placeholder="Leave a message for the host..."
                    rows={3}
                    style={{ ...inputStyle, resize: 'vertical' }}
                  />
                </motion.div>

                {/* Submit */}
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ scale: 1.02, boxShadow: `0 0 30px ${accentColor}40` }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={submitting}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    borderRadius: '14px',
                    background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`,
                    color: '#000',
                    fontWeight: 700,
                    fontSize: '1rem',
                    border: 'none',
                    cursor: submitting ? 'wait' : 'pointer',
                    opacity: submitting ? 0.7 : 1,
                    transition: 'all 0.3s',
                    fontFamily: 'inherit',
                    marginTop: '0.5rem',
                  }}
                >
                  {submitting ? '✨ Submitting...' : '🎉 Submit RSVP'}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
