'use client';

import React, { useState, useEffect, useCallback, useRef, use } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import api from '@/lib/api';
import { Invitation } from '@/types';
import { formatDate, formatTime, getInviteUrl, copyToClipboard, getWhatsAppShareUrl } from '@/lib/utils';
import { getTemplateById } from '@/data/templates';
import toast, { Toaster } from 'react-hot-toast';
import { QRCodeSVG } from 'qrcode.react';
import {
  HiOutlineCalendarDays, HiOutlineMapPin,
  HiOutlineEnvelope, HiOutlineLink, HiOutlineSparkles,
  HiOutlinePhone
} from 'react-icons/hi2';
import { FaWhatsapp } from 'react-icons/fa';

// Premium components
import ScratchCardReveal from '@/components/invitation/ScratchCardReveal';
import FloatingParticles from '@/components/invitation/FloatingParticles';
import MusicPlayer, { MusicPlayerRef } from '@/components/invitation/MusicPlayer';
import CountdownTimer from '@/components/invitation/CountdownTimer';
import RSVPModal from '@/components/invitation/RSVPModal';
import AnimatedSection from '@/components/invitation/AnimatedSection';
import TypingAnimation from '@/components/invitation/TypingAnimation';
import ScrollIndicator from '@/components/invitation/ScrollIndicator';
import GallerySlider from '@/components/invitation/GallerySlider';
import ConfettiEffect, { ConfettiRef } from '@/components/invitation/ConfettiEffect';

const fadeUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } };

// ─── Template Color Schemes ──────────────────────────────────
const templateStyles: Record<string, {
  bg: string; accent: string; text: string; muted: string;
  cardBg: string; gradientOverlay: string;
  particleType: 'petals' | 'sparkles' | 'confetti' | 'bubbles';
}> = {
  'wedding-elegant': {
    bg: 'linear-gradient(180deg, #0a0a1a 0%, #1a1a2e 30%, #0f1d3a 100%)',
    accent: '#d4a574', text: '#f5f0eb', muted: '#a09080',
    cardBg: 'rgba(212,165,116,0.06)',
    gradientOverlay: 'radial-gradient(ellipse at 50% 0%, rgba(212,165,116,0.08), transparent 60%)',
    particleType: 'petals',
  },
  'wedding-floral': {
    bg: 'linear-gradient(180deg, #1a0f1e 0%, #2d1b2e 30%, #1a0f1e 100%)',
    accent: '#e8a0bf', text: '#f8f0f5', muted: '#b088a0',
    cardBg: 'rgba(232,160,191,0.06)',
    gradientOverlay: 'radial-gradient(ellipse at 50% 0%, rgba(232,160,191,0.08), transparent 60%)',
    particleType: 'petals',
  },
  'birthday-fun': {
    bg: 'linear-gradient(180deg, #0a0520 0%, #1a0a2e 30%, #2a1050 100%)',
    accent: '#a78bfa', text: '#f5f0ff', muted: '#8b7ab0',
    cardBg: 'rgba(167,139,250,0.06)',
    gradientOverlay: 'radial-gradient(ellipse at 50% 0%, rgba(167,139,250,0.1), transparent 60%)',
    particleType: 'confetti',
  },
  'birthday-minimal': {
    bg: 'linear-gradient(180deg, #0a0a0f 0%, #141418 30%, #0a0a0f 100%)',
    accent: '#8b9cf7', text: '#eeeef2', muted: '#6b6b80',
    cardBg: 'rgba(139,156,247,0.04)',
    gradientOverlay: 'radial-gradient(ellipse at 50% 0%, rgba(139,156,247,0.05), transparent 60%)',
    particleType: 'sparkles',
  },
  'engagement-gold': {
    bg: 'linear-gradient(180deg, #0a0800 0%, #1a1508 30%, #0a0800 100%)',
    accent: '#fbbf24', text: '#fef9e7', muted: '#b8a060',
    cardBg: 'rgba(251,191,36,0.06)',
    gradientOverlay: 'radial-gradient(ellipse at 50% 0%, rgba(251,191,36,0.08), transparent 60%)',
    particleType: 'sparkles',
  },
  'party-neon': {
    bg: 'linear-gradient(180deg, #050510 0%, #0a0a1a 30%, #050510 100%)',
    accent: '#22d3ee', text: '#ecfeff', muted: '#60a0b0',
    cardBg: 'rgba(34,211,238,0.05)',
    gradientOverlay: 'radial-gradient(ellipse at 50% 0%, rgba(34,211,238,0.08), transparent 60%)',
    particleType: 'bubbles',
  },
  'corporate-clean': {
    bg: 'linear-gradient(180deg, #0d1117 0%, #161b22 30%, #0d1117 100%)',
    accent: '#58a6ff', text: '#e6edf3', muted: '#7d8590',
    cardBg: 'rgba(88,166,255,0.04)',
    gradientOverlay: 'radial-gradient(ellipse at 50% 0%, rgba(88,166,255,0.06), transparent 60%)',
    particleType: 'sparkles',
  },
};

const defaultStyle = templateStyles['birthday-minimal'];

export default function PublicInvitePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const confettiRef = useRef<ConfettiRef>(null);
  const musicRef = useRef<MusicPlayerRef>(null);

  const fetchInvitation = useCallback(async () => {
    try {
      const res = await api.get(`/invite/${slug}`);
      setInvitation(res.data.data.invitation);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchInvitation();
  }, [fetchInvitation]);

  const style = invitation ? (templateStyles[invitation.templateId] || defaultStyle) : defaultStyle;
  const template = invitation ? getTemplateById(invitation.templateId) : null;
  const inviteUrl = invitation ? getInviteUrl(invitation.slug) : '';
  const isSerif = template?.fontFamily === 'Playfair Display';

  // ─── Synced Reveal: fires music + confetti at the exact same moment ───
  const handleReveal = useCallback(() => {
    // Fire confetti fireworks immediately
    confettiRef.current?.fire('fireworks');
    // Start music with fade-in (scratch = user gesture, so play() is allowed)
    musicRef.current?.startPlayback();
  }, []);

  const handleTransitionComplete = useCallback(() => {
    setIsRevealed(true);
  }, []);

  // ─── Loading State ──────────────────────────────────────
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0f' }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center' }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            style={{ marginBottom: '1.5rem' }}
          >
            <HiOutlineSparkles style={{ fontSize: '2.5rem', color: '#5c7cfa' }} />
          </motion.div>
          <p style={{ color: '#868e96', fontSize: '0.95rem' }}>Preparing your invitation...</p>
        </motion.div>
      </div>
    );
  }

  // ─── Error State ────────────────────────────────────────
  if (error || !invitation) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0f' }}>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>😔</div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f1f3f5', marginBottom: '0.5rem' }}>Invitation Not Found</h1>
          <p style={{ color: '#868e96' }}>This invitation may have been removed or the link is invalid.</p>
        </motion.div>
      </div>
    );
  }

  // ─── Gallery images ─────────────────────────────────────
  const galleryImages: string[] = [];
  if (invitation.imageUrl) {
    const src = invitation.imageUrl.startsWith('http')
      ? invitation.imageUrl
      : `${process.env.NEXT_PUBLIC_API_URL}${invitation.imageUrl}`;
    galleryImages.push(src);
  }

  // ─── Main Invitation Content ────────────────────────────
  const InvitationContent = (
    <>
      <Toaster position="top-center" toastOptions={{
        style: { background: '#1a1a2e', color: '#f1f3f5', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' },
      }} />
      <ConfettiEffect ref={confettiRef} accentColor={style.accent} />

      <div style={{
        minHeight: '100vh',
        background: style.bg,
        color: style.text,
        fontFamily: isSerif
          ? 'var(--font-display), Georgia, serif'
          : 'var(--font-poppins), var(--font-body), system-ui, sans-serif',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Gradient Overlay */}
        <div style={{ position: 'absolute', inset: 0, background: style.gradientOverlay, pointerEvents: 'none', zIndex: 1 }} />

        {/* Floating Particles */}
        <FloatingParticles type={style.particleType} color={style.accent} count={20} />

        {/* Music Player — hidden during scratch, shown after reveal */}
        <MusicPlayer ref={musicRef} accentColor={style.accent} hidden={!isRevealed} />

        {/* Decorative Orbs */}
        <div style={{ position: 'absolute', width: '500px', height: '500px', borderRadius: '50%', background: `radial-gradient(circle, ${style.accent}12, transparent 70%)`, top: '-5%', right: '-15%', animation: 'float 8s ease-in-out infinite', zIndex: 0 }} />
        <div style={{ position: 'absolute', width: '400px', height: '400px', borderRadius: '50%', background: `radial-gradient(circle, ${style.accent}0a, transparent 70%)`, bottom: '15%', left: '-10%', animation: 'float 12s ease-in-out infinite reverse', zIndex: 0 }} />

        <div style={{ position: 'relative', zIndex: 3, maxWidth: '680px', margin: '0 auto', padding: '0 1.5rem' }}>

          {/* ═══════════════════════════════════════════════════
              HERO SECTION — Full Screen
             ═══════════════════════════════════════════════════ */}
          <section style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            position: 'relative',
            paddingTop: '2rem',
          }}>
            {/* Template Icon */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, type: 'spring', bounce: 0.4 }}
              style={{
                fontSize: '4rem',
                marginBottom: '2rem',
                filter: `drop-shadow(0 0 40px ${style.accent}50)`,
              }}
            >
              {template?.icon || '🎉'}
            </motion.div>

            {/* Cover Image */}
            {invitation.imageUrl && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                style={{
                  marginBottom: '2rem',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  border: `1px solid ${style.accent}25`,
                  boxShadow: `0 20px 60px rgba(0,0,0,0.4), 0 0 40px ${style.accent}10`,
                  maxWidth: '100%',
                }}
              >
                <Image
                  src={galleryImages[0]}
                  alt="Event Cover"
                  width={680}
                  height={300}
                  style={{ width: '100%', maxHeight: '300px', objectFit: 'cover' }}
                  unoptimized
                />
              </motion.div>
            )}

            {/* "You're Invited" label */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.25em',
                color: style.accent,
                marginBottom: '1rem',
              }}
            >
              You&apos;re Invited
            </motion.p>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{
                fontSize: 'clamp(2.2rem, 6vw, 4rem)',
                fontWeight: 800,
                lineHeight: 1.1,
                marginBottom: '1rem',
                letterSpacing: isSerif ? '0.01em' : '-0.02em',
                textShadow: `0 0 60px ${style.accent}20`,
              }}
            >
              {invitation.title}
            </motion.h1>

            {/* Host */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              style={{ fontSize: '1.1rem', color: style.muted }}
            >
              Hosted by <span style={{ color: style.accent, fontWeight: 600 }}>{invitation.hostName}</span>
            </motion.p>

            {/* Decorative separator */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              style={{
                width: '60px',
                height: '2px',
                background: `linear-gradient(90deg, transparent, ${style.accent}, transparent)`,
                margin: '2rem auto 0',
              }}
            />

            {/* Scroll Indicator */}
            <ScrollIndicator color={style.accent} />
          </section>

          {/* ═══════════════════════════════════════════════════
              COUNTDOWN TIMER
             ═══════════════════════════════════════════════════ */}
          <section style={{ marginBottom: '4rem' }}>
            <CountdownTimer
              targetDate={invitation.eventDate}
              accentColor={style.accent}
              cardBg={style.cardBg}
            />
          </section>

          {/* ═══════════════════════════════════════════════════
              EVENT DETAILS
             ═══════════════════════════════════════════════════ */}
          <AnimatedSection animation="fade-up" style={{ marginBottom: '3rem' }}>
            <div style={{
              padding: '2rem',
              borderRadius: '24px',
              background: style.cardBg,
              border: `1px solid ${style.accent}15`,
              backdropFilter: 'blur(10px)',
              boxShadow: `0 8px 32px rgba(0,0,0,0.2)`,
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                {/* Date */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '14px',
                    background: `${style.accent}12`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    boxShadow: `0 0 20px ${style.accent}10`,
                  }}>
                    <HiOutlineCalendarDays style={{ fontSize: '1.3rem', color: style.accent }} />
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '1.1rem' }}>{formatDate(invitation.eventDate)}</p>
                    {invitation.eventTime && <p style={{ color: style.muted, fontSize: '0.9rem', marginTop: '0.15rem' }}>{formatTime(invitation.eventTime)}</p>}
                  </div>
                </div>

                {/* Location */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '14px',
                    background: `${style.accent}12`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    boxShadow: `0 0 20px ${style.accent}10`,
                  }}>
                    <HiOutlineMapPin style={{ fontSize: '1.3rem', color: style.accent }} />
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '1.1rem' }}>{invitation.location}</p>
                    {invitation.mapLink && (
                      <a href={invitation.mapLink} target="_blank" rel="noopener noreferrer" style={{ color: style.accent, fontSize: '0.85rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.25rem' }}>
                        📍 View on Maps →
                      </a>
                    )}
                  </div>
                </div>

                {/* Dress Code */}
                {invitation.dressCode && (
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                    <div style={{
                      width: '48px', height: '48px', borderRadius: '14px',
                      background: `${style.accent}12`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <span style={{ fontSize: '1.2rem' }}>👔</span>
                    </div>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: '0.8rem', color: style.muted, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Dress Code</p>
                      <p style={{ fontSize: '1.05rem', marginTop: '0.15rem' }}>{invitation.dressCode}</p>
                    </div>
                  </div>
                )}

                {/* Contact */}
                {invitation.contactInfo && (
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                    <div style={{
                      width: '48px', height: '48px', borderRadius: '14px',
                      background: `${style.accent}12`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <HiOutlinePhone style={{ fontSize: '1.3rem', color: style.accent }} />
                    </div>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: '0.8rem', color: style.muted, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Contact</p>
                      <p style={{ fontSize: '1.05rem', marginTop: '0.15rem' }}>{invitation.contactInfo}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </AnimatedSection>

          {/* ═══════════════════════════════════════════════════
              DESCRIPTION — Typing Animation
             ═══════════════════════════════════════════════════ */}
          {invitation.description && (
            <AnimatedSection animation="fade-in" style={{ marginBottom: '3rem' }}>
              <div style={{
                padding: '2rem',
                borderRadius: '24px',
                background: style.cardBg,
                border: `1px solid ${style.accent}12`,
                textAlign: 'center',
              }}>
                <HiOutlineEnvelope style={{ fontSize: '1.5rem', color: style.accent, marginBottom: '1rem' }} />
                <TypingAnimation
                  text={invitation.description}
                  speed={30}
                  as="p"
                  style={{
                    fontSize: '1.05rem',
                    lineHeight: 1.8,
                    color: style.muted,
                    fontStyle: isSerif ? 'italic' : 'normal',
                  }}
                />
              </div>
            </AnimatedSection>
          )}

          {/* ═══════════════════════════════════════════════════
              GALLERY
             ═══════════════════════════════════════════════════ */}
          {galleryImages.length > 0 && (
            <AnimatedSection animation="zoom" style={{ marginBottom: '3rem' }}>
              <GallerySlider images={galleryImages} accentColor={style.accent} />
            </AnimatedSection>
          )}

          {/* ═══════════════════════════════════════════════════
              RSVP
             ═══════════════════════════════════════════════════ */}
          {invitation.rsvpEnabled && (
            <AnimatedSection animation="fade-up" style={{ marginBottom: '3rem', textAlign: 'center' }}>
              <p style={{
                fontSize: '0.8rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                color: style.muted,
                marginBottom: '0.5rem',
              }}>
                Will you be joining us?
              </p>
              <h2 style={{
                fontSize: '1.75rem',
                fontWeight: 800,
                marginBottom: '1.5rem',
                fontFamily: isSerif ? 'var(--font-display)' : 'inherit',
              }}>
                RSVP
              </h2>
              <RSVPModal
                slug={slug}
                accentColor={style.accent}
                cardBg={style.cardBg}
                textColor={style.text}
                mutedColor={style.muted}
                apiPost={(url, data) => api.post(url, data)}
              />
            </AnimatedSection>
          )}

          {/* ═══════════════════════════════════════════════════
              SHARE & QR
             ═══════════════════════════════════════════════════ */}
          <AnimatedSection animation="fade-up" style={{ marginBottom: '3rem', textAlign: 'center' }}>
            <p style={{ fontSize: '0.8rem', color: style.muted, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 600 }}>
              Share this Invitation
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: `0 0 20px ${style.accent}20` }}
                whileTap={{ scale: 0.95 }}
                onClick={async () => { const ok = await copyToClipboard(inviteUrl); if (ok) toast.success('Link copied!'); }}
                style={{
                  padding: '0.7rem 1.25rem', borderRadius: '12px', border: `1px solid ${style.accent}25`,
                  background: `${style.accent}08`, color: style.text, cursor: 'pointer', fontSize: '0.85rem',
                  fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'inherit',
                  transition: 'all 0.3s',
                }}
              >
                <HiOutlineLink /> Copy Link
              </motion.button>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href={getWhatsAppShareUrl(invitation)}
                target="_blank" rel="noopener noreferrer"
                style={{
                  padding: '0.7rem 1.25rem', borderRadius: '12px', border: '1px solid rgba(37,211,102,0.3)',
                  background: 'rgba(37,211,102,0.1)', color: '#25d366', textDecoration: 'none', fontSize: '0.85rem',
                  fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem',
                }}
              >
                <FaWhatsapp /> WhatsApp
              </motion.a>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowQR(!showQR)}
                style={{
                  padding: '0.7rem 1.25rem', borderRadius: '12px', border: `1px solid ${style.accent}25`,
                  background: `${style.accent}08`, color: style.text, cursor: 'pointer', fontSize: '0.85rem',
                  fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'inherit',
                }}
              >
                📱 QR Code
              </motion.button>
            </div>

            {showQR && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: '1.5rem', display: 'inline-block', padding: '1.5rem', borderRadius: '20px', background: '#fff', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
                <QRCodeSVG value={inviteUrl} size={180} level="H" />
                <p style={{ color: '#333', fontSize: '0.75rem', marginTop: '0.75rem' }}>Scan to open invitation</p>
              </motion.div>
            )}
          </AnimatedSection>

          {/* ═══════════════════════════════════════════════════
              FOOTER
             ═══════════════════════════════════════════════════ */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', paddingBottom: '3rem' }}
          >
            <div style={{
              height: '1px',
              background: `linear-gradient(90deg, transparent, ${style.accent}25, transparent)`,
              margin: '0 3rem 1.5rem',
            }} />
            <p style={{ fontSize: '0.75rem', color: style.muted }}>
              Created with <span style={{ color: style.accent }}>♥</span> using Invito
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );

  // ─── Wrap with Scratch Card ─────────────────────────────
  return (
    <ScratchCardReveal
      accentColor={style.accent}
      onReveal={handleReveal}
      onTransitionComplete={handleTransitionComplete}
    >
      {InvitationContent}
    </ScratchCardReveal>
  );
}
