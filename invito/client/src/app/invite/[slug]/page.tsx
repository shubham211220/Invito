'use client';

import React, { useState, useEffect, use } from 'react';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import { Invitation } from '@/types';
import { formatDate, formatTime, getInviteUrl, copyToClipboard, getWhatsAppShareUrl } from '@/lib/utils';
import { getTemplateById } from '@/data/templates';
import toast, { Toaster } from 'react-hot-toast';
import { QRCodeSVG } from 'qrcode.react';
import {
  HiOutlineCalendarDays, HiOutlineMapPin, HiOutlineClock,
  HiOutlineEnvelope, HiOutlineLink, HiOutlineSparkles,
  HiOutlineUserGroup, HiOutlineMusicalNote, HiOutlinePhone
} from 'react-icons/hi2';
import { FaWhatsapp } from 'react-icons/fa';

const fadeUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } };
const fadeIn = { hidden: { opacity: 0 }, visible: { opacity: 1 } };

// Countdown hook
function useCountdown(targetDate: string) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: false });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: true });
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
        expired: false,
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return timeLeft;
}

// ─── Template Color Schemes ──────────────────────────────────
const templateStyles: Record<string, { bg: string; accent: string; text: string; muted: string; cardBg: string; gradientOverlay: string }> = {
  'wedding-elegant': {
    bg: 'linear-gradient(180deg, #0a0a1a 0%, #1a1a2e 30%, #0f1d3a 100%)',
    accent: '#d4a574', text: '#f5f0eb', muted: '#a09080',
    cardBg: 'rgba(212,165,116,0.06)', gradientOverlay: 'radial-gradient(ellipse at 50% 0%, rgba(212,165,116,0.08), transparent 60%)',
  },
  'wedding-floral': {
    bg: 'linear-gradient(180deg, #1a0f1e 0%, #2d1b2e 30%, #1a0f1e 100%)',
    accent: '#e8a0bf', text: '#f8f0f5', muted: '#b088a0',
    cardBg: 'rgba(232,160,191,0.06)', gradientOverlay: 'radial-gradient(ellipse at 50% 0%, rgba(232,160,191,0.08), transparent 60%)',
  },
  'birthday-fun': {
    bg: 'linear-gradient(180deg, #0a0520 0%, #1a0a2e 30%, #2a1050 100%)',
    accent: '#a78bfa', text: '#f5f0ff', muted: '#8b7ab0',
    cardBg: 'rgba(167,139,250,0.06)', gradientOverlay: 'radial-gradient(ellipse at 50% 0%, rgba(167,139,250,0.1), transparent 60%)',
  },
  'birthday-minimal': {
    bg: 'linear-gradient(180deg, #0a0a0f 0%, #141418 30%, #0a0a0f 100%)',
    accent: '#8b9cf7', text: '#eeeef2', muted: '#6b6b80',
    cardBg: 'rgba(139,156,247,0.04)', gradientOverlay: 'radial-gradient(ellipse at 50% 0%, rgba(139,156,247,0.05), transparent 60%)',
  },
  'engagement-gold': {
    bg: 'linear-gradient(180deg, #0a0800 0%, #1a1508 30%, #0a0800 100%)',
    accent: '#fbbf24', text: '#fef9e7', muted: '#b8a060',
    cardBg: 'rgba(251,191,36,0.06)', gradientOverlay: 'radial-gradient(ellipse at 50% 0%, rgba(251,191,36,0.08), transparent 60%)',
  },
  'party-neon': {
    bg: 'linear-gradient(180deg, #050510 0%, #0a0a1a 30%, #050510 100%)',
    accent: '#22d3ee', text: '#ecfeff', muted: '#60a0b0',
    cardBg: 'rgba(34,211,238,0.05)', gradientOverlay: 'radial-gradient(ellipse at 50% 0%, rgba(34,211,238,0.08), transparent 60%)',
  },
  'corporate-clean': {
    bg: 'linear-gradient(180deg, #0d1117 0%, #161b22 30%, #0d1117 100%)',
    accent: '#58a6ff', text: '#e6edf3', muted: '#7d8590',
    cardBg: 'rgba(88,166,255,0.04)', gradientOverlay: 'radial-gradient(ellipse at 50% 0%, rgba(88,166,255,0.06), transparent 60%)',
  },
};

const defaultStyle = templateStyles['birthday-minimal'];

export default function PublicInvitePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showQR, setShowQR] = useState(false);

  // RSVP form
  const [rsvpForm, setRsvpForm] = useState({ guestName: '', attending: true, message: '' });
  const [rsvpSubmitting, setRsvpSubmitting] = useState(false);
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);

  useEffect(() => {
    fetchInvitation();
  }, [slug]);

  const fetchInvitation = async () => {
    try {
      const res = await api.get(`/invite/${slug}`);
      setInvitation(res.data.data.invitation);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpForm.guestName.trim()) { toast.error('Please enter your name'); return; }
    setRsvpSubmitting(true);
    try {
      await api.post(`/rsvp/${slug}`, rsvpForm);
      toast.success('RSVP submitted! Thank you 🎉');
      setRsvpSubmitted(true);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to submit RSVP');
    } finally {
      setRsvpSubmitting(false);
    }
  };

  const countdown = useCountdown(invitation?.eventDate || '');
  const style = invitation ? (templateStyles[invitation.templateId] || defaultStyle) : defaultStyle;
  const template = invitation ? getTemplateById(invitation.templateId) : null;
  const inviteUrl = invitation ? getInviteUrl(invitation.slug) : '';
  const isSerif = template?.fontFamily === 'Playfair Display';

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0f' }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center' }}>
          <HiOutlineSparkles style={{ fontSize: '2rem', color: '#5c7cfa', marginBottom: '1rem' }} />
          <p style={{ color: '#868e96' }}>Loading invitation...</p>
        </motion.div>
      </div>
    );
  }

  if (error || !invitation) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0f' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>😔</div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f1f3f5', marginBottom: '0.5rem' }}>Invitation Not Found</h1>
          <p style={{ color: '#868e96' }}>This invitation may have been removed or the link is invalid.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-center" toastOptions={{
        style: { background: '#1a1a2e', color: '#f1f3f5', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' },
      }} />

      <div style={{
        minHeight: '100vh',
        background: style.bg,
        color: style.text,
        fontFamily: isSerif ? 'var(--font-display), Georgia, serif' : 'var(--font-body), system-ui, sans-serif',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Gradient Overlay */}
        <div style={{ position: 'absolute', inset: 0, background: style.gradientOverlay, pointerEvents: 'none' }} />

        {/* Decorative Orbs */}
        <div style={{ position: 'absolute', width: '400px', height: '400px', borderRadius: '50%', background: `radial-gradient(circle, ${style.accent}10, transparent 70%)`, top: '10%', right: '-10%', animation: 'float 8s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', width: '300px', height: '300px', borderRadius: '50%', background: `radial-gradient(circle, ${style.accent}08, transparent 70%)`, bottom: '20%', left: '-10%', animation: 'float 10s ease-in-out infinite reverse' }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '680px', margin: '0 auto', padding: '3rem 1.5rem' }}>

          {/* ─── Hero / Header ────────────────────────────────── */}
          <motion.section
            initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.8 }}
            style={{ textAlign: 'center', marginBottom: '3rem', paddingTop: '2rem' }}
          >
            {/* Template Icon */}
            <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.6, type: 'spring' }} style={{ fontSize: '3.5rem', marginBottom: '1.5rem', filter: `drop-shadow(0 0 30px ${style.accent}40)` }}>
              {template?.icon || '🎉'}
            </motion.div>

            {/* Cover Image */}
            {invitation.imageUrl && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} style={{ marginBottom: '2rem', borderRadius: '16px', overflow: 'hidden', border: `1px solid ${style.accent}20` }}>
                <img src={`http://localhost:5000${invitation.imageUrl}`} alt="Event Cover" style={{ width: '100%', maxHeight: '300px', objectFit: 'cover' }} />
              </motion.div>
            )}

            {/* Title */}
            <motion.p variants={fadeIn} transition={{ delay: 0.3 }} style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.2em', color: style.accent, marginBottom: '0.75rem' }}>
              You&apos;re Invited
            </motion.p>
            <motion.h1 variants={fadeUp} transition={{ delay: 0.4, duration: 0.7 }} style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, lineHeight: 1.15, marginBottom: '1rem', letterSpacing: isSerif ? '0.01em' : '-0.02em' }}>
              {invitation.title}
            </motion.h1>
            <motion.p variants={fadeUp} transition={{ delay: 0.5 }} style={{ fontSize: '1.1rem', color: style.muted }}>
              Hosted by <span style={{ color: style.accent, fontWeight: 600 }}>{invitation.hostName}</span>
            </motion.p>
          </motion.section>

          {/* ─── Countdown Timer ──────────────────────────────── */}
          {!countdown.expired && (
            <motion.section
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.6 }}
              style={{ marginBottom: '3rem' }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', maxWidth: '400px', margin: '0 auto' }}>
                {[
                  { val: countdown.days, label: 'Days' },
                  { val: countdown.hours, label: 'Hours' },
                  { val: countdown.minutes, label: 'Min' },
                  { val: countdown.seconds, label: 'Sec' },
                ].map((item) => (
                  <div key={item.label} style={{
                    textAlign: 'center', padding: '1rem 0.5rem', borderRadius: '14px',
                    background: style.cardBg, border: `1px solid ${style.accent}15`,
                  }}>
                    <p style={{ fontSize: '1.75rem', fontWeight: 800, color: style.accent }}>{item.val}</p>
                    <p style={{ fontSize: '0.7rem', color: style.muted, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{item.label}</p>
                  </div>
                ))}
              </div>
            </motion.section>
          )}

          {/* ─── Event Details ────────────────────────────────── */}
          <motion.section
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.6 }}
            style={{
              marginBottom: '3rem', padding: '2rem', borderRadius: '20px',
              background: style.cardBg, border: `1px solid ${style.accent}12`,
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Date */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: `${style.accent}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <HiOutlineCalendarDays style={{ fontSize: '1.25rem', color: style.accent }} />
                </div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: '1.05rem' }}>{formatDate(invitation.eventDate)}</p>
                  {invitation.eventTime && <p style={{ color: style.muted, fontSize: '0.9rem' }}>{formatTime(invitation.eventTime)}</p>}
                </div>
              </div>

              {/* Location */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: `${style.accent}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <HiOutlineMapPin style={{ fontSize: '1.25rem', color: style.accent }} />
                </div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: '1.05rem' }}>{invitation.location}</p>
                  {invitation.mapLink && (
                    <a href={invitation.mapLink} target="_blank" rel="noopener noreferrer" style={{ color: style.accent, fontSize: '0.85rem', textDecoration: 'none' }}>
                      📍 View on Google Maps →
                    </a>
                  )}
                </div>
              </div>

              {/* Dress Code */}
              {invitation.dressCode && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: `${style.accent}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontSize: '1.1rem' }}>👔</span>
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '0.85rem', color: style.muted, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Dress Code</p>
                    <p style={{ fontSize: '1.05rem' }}>{invitation.dressCode}</p>
                  </div>
                </div>
              )}

              {/* Contact */}
              {invitation.contactInfo && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: `${style.accent}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <HiOutlinePhone style={{ fontSize: '1.25rem', color: style.accent }} />
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '0.85rem', color: style.muted, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Contact</p>
                    <p style={{ fontSize: '1.05rem' }}>{invitation.contactInfo}</p>
                  </div>
                </div>
              )}
            </div>
          </motion.section>

          {/* ─── Description ──────────────────────────────────── */}
          {invitation.description && (
            <motion.section
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.6 }}
              style={{
                marginBottom: '3rem', padding: '2rem', borderRadius: '20px',
                background: style.cardBg, border: `1px solid ${style.accent}12`,
                textAlign: 'center',
              }}
            >
              <HiOutlineEnvelope style={{ fontSize: '1.5rem', color: style.accent, marginBottom: '1rem' }} />
              <p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: style.muted, fontStyle: isSerif ? 'italic' : 'normal' }}>
                {invitation.description}
              </p>
            </motion.section>
          )}

          {/* ─── RSVP Form ────────────────────────────────────── */}
          {invitation.rsvpEnabled && (
            <motion.section
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.6 }}
              style={{
                marginBottom: '3rem', padding: '2rem', borderRadius: '20px',
                background: style.cardBg, border: `1px solid ${style.accent}12`,
              }}
            >
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <HiOutlineUserGroup style={{ fontSize: '1.5rem', color: style.accent, marginBottom: '0.5rem' }} />
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>RSVP</h2>
                <p style={{ color: style.muted, fontSize: '0.9rem' }}>Will you be joining us?</p>
              </div>

              {rsvpSubmitted ? (
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ textAlign: 'center', padding: '2rem 0' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎊</div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Thank You!</h3>
                  <p style={{ color: style.muted }}>Your response has been recorded.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleRsvpSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: style.muted, marginBottom: '0.5rem' }}>Your Name *</label>
                    <input
                      value={rsvpForm.guestName}
                      onChange={(e) => setRsvpForm(p => ({ ...p, guestName: e.target.value }))}
                      placeholder="Enter your full name"
                      required
                      style={{
                        width: '100%', padding: '0.85rem 1rem', borderRadius: '10px',
                        background: `${style.accent}08`, border: `1px solid ${style.accent}15`,
                        color: style.text, fontSize: '0.95rem', outline: 'none',
                        fontFamily: 'inherit',
                      }}
                    />
                  </div>

                  {/* Attending Toggle */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: style.muted, marginBottom: '0.75rem' }}>Will you attend?</label>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      {[true, false].map((val) => (
                        <button
                          key={String(val)}
                          type="button"
                          onClick={() => setRsvpForm(p => ({ ...p, attending: val }))}
                          style={{
                            flex: 1, padding: '0.85rem', borderRadius: '10px', cursor: 'pointer',
                            border: `1px solid ${rsvpForm.attending === val ? style.accent : style.accent + '20'}`,
                            background: rsvpForm.attending === val ? `${style.accent}15` : 'transparent',
                            color: rsvpForm.attending === val ? style.accent : style.muted,
                            fontWeight: 600, fontSize: '0.95rem', transition: 'all 0.2s',
                            fontFamily: 'inherit',
                          }}
                        >
                          {val ? '✓ Yes, I\'ll be there!' : '✕ Sorry, can\'t make it'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: style.muted, marginBottom: '0.5rem' }}>Message (optional)</label>
                    <textarea
                      value={rsvpForm.message}
                      onChange={(e) => setRsvpForm(p => ({ ...p, message: e.target.value }))}
                      placeholder="Leave a message for the host..."
                      rows={3}
                      style={{
                        width: '100%', padding: '0.85rem 1rem', borderRadius: '10px',
                        background: `${style.accent}08`, border: `1px solid ${style.accent}15`,
                        color: style.text, fontSize: '0.95rem', outline: 'none', resize: 'vertical',
                        fontFamily: 'inherit',
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={rsvpSubmitting}
                    style={{
                      width: '100%', padding: '0.9rem', borderRadius: '12px',
                      background: style.accent, color: '#000', fontWeight: 700,
                      fontSize: '0.95rem', border: 'none', cursor: 'pointer',
                      opacity: rsvpSubmitting ? 0.7 : 1, transition: 'all 0.3s',
                      fontFamily: 'inherit',
                    }}
                  >
                    {rsvpSubmitting ? 'Submitting...' : 'Submit RSVP'}
                  </button>
                </form>
              )}
            </motion.section>
          )}

          {/* ─── Share & QR ───────────────────────────────────── */}
          <motion.section
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.6 }}
            style={{ marginBottom: '3rem', textAlign: 'center' }}
          >
            <p style={{ fontSize: '0.85rem', color: style.muted, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>
              Share this Invitation
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={async () => { const ok = await copyToClipboard(inviteUrl); if (ok) toast.success('Link copied!'); }}
                style={{
                  padding: '0.65rem 1.25rem', borderRadius: '10px', border: `1px solid ${style.accent}25`,
                  background: `${style.accent}08`, color: style.text, cursor: 'pointer', fontSize: '0.85rem',
                  fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'inherit',
                }}
              >
                <HiOutlineLink /> Copy Link
              </button>
              <a
                href={getWhatsAppShareUrl(invitation)}
                target="_blank" rel="noopener noreferrer"
                style={{
                  padding: '0.65rem 1.25rem', borderRadius: '10px', border: '1px solid rgba(37,211,102,0.3)',
                  background: 'rgba(37,211,102,0.1)', color: '#25d366', textDecoration: 'none', fontSize: '0.85rem',
                  fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem',
                }}
              >
                <FaWhatsapp /> WhatsApp
              </a>
              <button
                onClick={() => setShowQR(!showQR)}
                style={{
                  padding: '0.65rem 1.25rem', borderRadius: '10px', border: `1px solid ${style.accent}25`,
                  background: `${style.accent}08`, color: style.text, cursor: 'pointer', fontSize: '0.85rem',
                  fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'inherit',
                }}
              >
                📱 QR Code
              </button>
            </div>

            {showQR && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: '1.5rem', display: 'inline-block', padding: '1.5rem', borderRadius: '16px', background: '#fff' }}>
                <QRCodeSVG value={inviteUrl} size={180} level="H" />
                <p style={{ color: '#333', fontSize: '0.75rem', marginTop: '0.75rem' }}>Scan to open invitation</p>
              </motion.div>
            )}
          </motion.section>

          {/* ─── Footer ───────────────────────────────────────── */}
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} style={{ textAlign: 'center', paddingBottom: '2rem' }}>
            <div style={{ height: '1px', background: `${style.accent}15`, margin: '0 3rem 1.5rem' }} />
            <p style={{ fontSize: '0.75rem', color: style.muted }}>
              Created with <span style={{ color: style.accent }}>♥</span> using Invito
            </p>
          </motion.div>
        </div>

        {/* Float animation keyframe */}
        <style jsx global>{`
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
          }
        `}</style>
      </div>
    </>
  );
}
