'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import DemoPrompt from '@/components/layout/DemoPrompt';
import { templates } from '@/data/templates';
import { DEMO_SLUG } from '@/data/demoInvitation';
import {
  HiOutlineSparkles, HiOutlinePaintBrush, HiOutlineLink,
  HiOutlineClipboardDocumentCheck, HiOutlineShare,
  HiOutlineEye, HiOutlineMusicalNote, HiOutlineCalendarDays, HiOutlineMapPin,
} from 'react-icons/hi2';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  }),
};

export default function HomePage() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const features = [
    { icon: <HiOutlinePaintBrush />, title: 'Beautiful Templates', desc: 'Choose from stunning templates for weddings, birthdays, engagements, and more.' },
    { icon: <HiOutlineLink />, title: 'Unique Share Links', desc: 'Each invitation gets a unique URL that you can share anywhere instantly.' },
    { icon: <HiOutlineClipboardDocumentCheck />, title: 'RSVP Tracking', desc: 'Track guest responses in real-time from your personal dashboard.' },
    { icon: <HiOutlineShare />, title: 'Easy Sharing', desc: 'Share via WhatsApp, QR code, or direct link with one click.' },
  ];

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />

      {/* ─── Hero Section ──────────────────────────────────────── */}
      <section
        ref={heroRef}
        style={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          padding: '6rem 1.5rem 4rem',
        }}
      >
        {/* Animated background orbs with parallax */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 0 }}>
          <motion.div
            style={{ y: heroY }}
          >
            <div
              style={{
                position: 'absolute',
                width: '700px',
                height: '700px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(92,124,250,0.18), transparent 70%)',
                top: '-10%',
                right: '-15%',
                animation: 'float 8s ease-in-out infinite',
              }}
            />
            <div
              style={{
                position: 'absolute',
                width: '600px',
                height: '600px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(240,101,149,0.14), transparent 70%)',
                bottom: '-5%',
                left: '-10%',
                animation: 'float 10s ease-in-out infinite reverse',
              }}
            />
            <div
              style={{
                position: 'absolute',
                width: '350px',
                height: '350px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(252,196,25,0.1), transparent 70%)',
                top: '40%',
                left: '50%',
                animation: 'float 7s ease-in-out infinite',
              }}
            />
          </motion.div>
        </div>

        <motion.div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '800px', opacity: heroOpacity }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1.25rem',
                borderRadius: '100px',
                background: 'rgba(92,124,250,0.1)',
                border: '1px solid rgba(92,124,250,0.2)',
                color: '#748ffc',
                fontSize: '0.85rem',
                fontWeight: 600,
                marginBottom: '1.5rem',
              }}
            >
              <HiOutlineSparkles /> Create Magical Invitations
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              fontWeight: 800,
              lineHeight: 1.1,
              marginBottom: '1.5rem',
              letterSpacing: '-0.03em',
            }}
          >
            Stunning Digital{' '}
            <span className="gradient-text">Invitations</span>{' '}
            for Every Occasion
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.2rem)',
              color: '#868e96',
              maxWidth: '600px',
              margin: '0 auto 2.5rem',
              lineHeight: 1.7,
            }}
          >
            Design beautiful event invitations in minutes. Choose from premium templates, customize every detail, and share with a unique link.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}
          >
            <motion.div whileHover={{ scale: 1.03, boxShadow: '0 0 40px rgba(76,110,245,0.3)' }} whileTap={{ scale: 0.98 }}>
              <Link href="/register" className="btn-primary" style={{ padding: '0.9rem 2.5rem', fontSize: '1.05rem' }}>
                Start Creating — It&apos;s Free
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Link href="#templates" className="btn-secondary" style={{ padding: '0.9rem 2.5rem', fontSize: '1.05rem' }}>
                Browse Templates
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* ─── Features Section ──────────────────────────────────── */}
      <section style={{ padding: '6rem 1.5rem', position: 'relative' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            style={{ textAlign: 'center', marginBottom: '4rem' }}
          >
            <motion.h2
              custom={0}
              variants={fadeUp}
              style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-0.02em' }}
            >
              Everything You Need to{' '}
              <span className="gradient-text">Invite Beautifully</span>
            </motion.h2>
            <motion.p custom={1} variants={fadeUp} style={{ color: '#868e96', fontSize: '1.1rem', maxWidth: '500px', margin: '0 auto' }}>
              From design to delivery, we&apos;ve got you covered.
            </motion.p>
          </motion.div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {features.map((feature, i) => (
              <motion.div
                key={i}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                whileHover={{
                  y: -8,
                  boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
                  borderColor: 'rgba(255,255,255,0.15)',
                }}
                className="card"
                style={{ textAlign: 'center', padding: '2.5rem 2rem', cursor: 'default' }}
              >
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, rgba(92,124,250,0.15), rgba(240,101,149,0.15))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem',
                    fontSize: '1.5rem',
                    color: '#748ffc',
                  }}
                >
                  {feature.icon}
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.75rem', color: '#f1f3f5' }}>
                  {feature.title}
                </h3>
                <p style={{ color: '#868e96', fontSize: '0.9rem', lineHeight: 1.6 }}>{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Live Demo Invitation Section ──────────────────────── */}
      <section id="live-demo" style={{ padding: '6rem 1.5rem', position: 'relative' }}>
        {/* Background decorative glow */}
        <div style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212,165,116,0.06), transparent 60%)',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            style={{ textAlign: 'center', marginBottom: '3.5rem' }}
          >
            <motion.div
              custom={0}
              variants={fadeUp}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.4rem 1rem',
                borderRadius: '100px',
                background: 'rgba(212,165,116,0.1)',
                border: '1px solid rgba(212,165,116,0.2)',
                color: '#d4a574',
                fontSize: '0.8rem',
                fontWeight: 600,
                marginBottom: '1.25rem',
              }}
            >
              <HiOutlineEye /> Live Preview
            </motion.div>
            <motion.h2
              custom={1}
              variants={fadeUp}
              style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-0.02em' }}
            >
              Experience a Live{' '}
              <span className="gradient-text-gold">Invitation</span>
            </motion.h2>
            <motion.p custom={2} variants={fadeUp} style={{ color: '#868e96', fontSize: '1.1rem', maxWidth: '550px', margin: '0 auto', lineHeight: 1.7 }}>
              See how your invitation will look with animations, music, scratch-to-reveal, and interactive design.
            </motion.p>
          </motion.div>

          {/* Demo Preview Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '3rem',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            {/* Preview Card */}
            <motion.div
              whileHover={{
                y: -8,
                boxShadow: '0 30px 80px rgba(212,165,116,0.15), 0 0 60px rgba(212,165,116,0.08)',
              }}
              style={{
                width: '380px',
                maxWidth: '100%',
                borderRadius: '24px',
                overflow: 'hidden',
                background: 'linear-gradient(180deg, #0a0a1a 0%, #1a1a2e 100%)',
                border: '1px solid rgba(212,165,116,0.15)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
                transition: 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                position: 'relative',
              }}
            >
              {/* Gradient overlay at top */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '120px',
                background: 'radial-gradient(ellipse at 50% 0%, rgba(212,165,116,0.12), transparent 70%)',
                pointerEvents: 'none',
                zIndex: 1,
              }} />

              {/* Card Content */}
              <div style={{ padding: '2.5rem 2rem', position: 'relative', zIndex: 2, textAlign: 'center' }}>
                {/* Floating icon */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  style={{
                    fontSize: '3rem',
                    marginBottom: '1.25rem',
                    filter: 'drop-shadow(0 0 30px rgba(212,165,116,0.4))',
                  }}
                >
                  💍
                </motion.div>

                {/* Label */}
                <p style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.25em',
                  color: '#d4a574',
                  marginBottom: '0.75rem',
                }}>
                  You&apos;re Invited
                </p>

                {/* Title */}
                <h3 style={{
                  fontSize: '1.6rem',
                  fontWeight: 800,
                  color: '#f5f0eb',
                  marginBottom: '0.5rem',
                  fontFamily: 'var(--font-display), Georgia, serif',
                  lineHeight: 1.2,
                }}>
                  Rahul & Sneha
                </h3>
                <p style={{ color: '#a09080', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                  Hosted by The Sharma Family
                </p>

                {/* Separator */}
                <div style={{
                  width: '50px',
                  height: '1.5px',
                  background: 'linear-gradient(90deg, transparent, #d4a574, transparent)',
                  margin: '0 auto 1.5rem',
                }} />

                {/* Event Details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#c0b0a0', fontSize: '0.85rem' }}>
                    <HiOutlineCalendarDays style={{ color: '#d4a574', fontSize: '1rem' }} />
                    25 December 2026 · 6:00 PM
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#c0b0a0', fontSize: '0.85rem' }}>
                    <HiOutlineMapPin style={{ color: '#d4a574', fontSize: '1rem' }} />
                    Taj Lands End, Mumbai
                  </div>
                </div>

                {/* Feature pills */}
                <div style={{
                  display: 'flex',
                  gap: '0.5rem',
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                  marginTop: '1.5rem',
                }}>
                  {[
                    { icon: '✨', label: 'Scratch Reveal' },
                    { icon: '🎵', label: 'Music' },
                    { icon: '🎆', label: 'Animations' },
                  ].map((pill) => (
                    <span
                      key={pill.label}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        padding: '0.3rem 0.7rem',
                        borderRadius: '100px',
                        background: 'rgba(212,165,116,0.08)',
                        border: '1px solid rgba(212,165,116,0.15)',
                        color: '#d4a574',
                        fontSize: '0.7rem',
                        fontWeight: 600,
                      }}
                    >
                      {pill.icon} {pill.label}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom shimmer bar */}
              <div style={{
                height: '3px',
                background: 'linear-gradient(90deg, transparent, #d4a574, transparent)',
                backgroundSize: '400% 100%',
                animation: 'shimmer 3s ease-in-out infinite',
              }} />
            </motion.div>

            {/* CTA Side */}
            <div style={{ maxWidth: '420px', textAlign: 'center' }}>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.7 }}
              >
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  alignItems: 'center',
                }}>
                  <div style={{
                    display: 'flex',
                    gap: '0.75rem',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                  }}>
                    {[
                      { icon: <HiOutlineMusicalNote />, text: 'Background music that sets the mood' },
                      { icon: <HiOutlineSparkles />, text: 'Scratch-to-reveal interactive experience' },
                      { icon: <HiOutlineEye />, text: 'Premium animations & floating particles' },
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 + i * 0.1 }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.6rem',
                          padding: '0.75rem 1rem',
                          borderRadius: '12px',
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid rgba(255,255,255,0.06)',
                          fontSize: '0.85rem',
                          color: '#adb5bd',
                          width: '100%',
                        }}
                      >
                        <span style={{ color: '#d4a574', fontSize: '1.1rem', flexShrink: 0 }}>{item.icon}</span>
                        {item.text}
                      </motion.div>
                    ))}
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.05, boxShadow: '0 0 50px rgba(212,165,116,0.3)' }}
                    whileTap={{ scale: 0.97 }}
                    style={{ marginTop: '0.5rem' }}
                  >
                    <Link
                      href={`/invite/${DEMO_SLUG}`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        padding: '1rem 2.5rem',
                        borderRadius: '14px',
                        background: 'linear-gradient(135deg, #d4a574, #c49060)',
                        color: '#0a0a0f',
                        fontWeight: 700,
                        fontSize: '1.05rem',
                        textDecoration: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                        boxShadow: '0 8px 30px rgba(212,165,116,0.25)',
                      }}
                    >
                      <HiOutlineEye />
                      View Live Demo
                    </Link>
                  </motion.div>
                  <p style={{ fontSize: '0.8rem', color: '#5c5c70', marginTop: '0.25rem' }}>
                    No signup needed · Full interactive experience
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Templates Preview ─────────────────────────────────── */}
      <section id="templates" style={{ padding: '6rem 1.5rem' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            style={{ textAlign: 'center', marginBottom: '4rem' }}
          >
            <motion.h2
              custom={0}
              variants={fadeUp}
              style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-0.02em' }}
            >
              Premium <span className="gradient-text">Templates</span>
            </motion.h2>
            <motion.p custom={1} variants={fadeUp} style={{ color: '#868e96', fontSize: '1.1rem', maxWidth: '500px', margin: '0 auto' }}>
              Choose from beautifully crafted templates for every celebration.
            </motion.p>
          </motion.div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {templates.map((template, i) => (
              <motion.div
                key={template.id}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                whileHover={{
                  y: -8,
                  rotateY: 2,
                  rotateX: -2,
                  boxShadow: '0 30px 60px rgba(0,0,0,0.4)',
                }}
                style={{
                  borderRadius: '16px',
                  overflow: 'hidden',
                  border: '1px solid rgba(255,255,255,0.06)',
                  transition: 'border-color 0.3s ease',
                  cursor: 'pointer',
                  perspective: '1000px',
                }}
              >
                <div
                  style={{
                    height: '200px',
                    background: template.previewGradient,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '3rem',
                    position: 'relative',
                  }}
                >
                  <motion.span
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    style={{ filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.3))' }}
                  >
                    {template.icon}
                  </motion.span>
                  <span
                    style={{
                      position: 'absolute',
                      top: '1rem',
                      right: '1rem',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      background: 'rgba(255,255,255,0.1)',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '100px',
                      color: '#dee2e6',
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    {template.category}
                  </span>
                </div>
                <div style={{ padding: '1.25rem' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.5rem', color: '#f1f3f5' }}>{template.name}</h3>
                  <p style={{ color: '#868e96', fontSize: '0.85rem', lineHeight: 1.5 }}>{template.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <motion.div whileHover={{ scale: 1.03, boxShadow: '0 0 40px rgba(76,110,245,0.3)' }} whileTap={{ scale: 0.98 }}>
              <Link href="/register" className="btn-primary" style={{ padding: '0.9rem 2.5rem', fontSize: '1.05rem' }}>
                Start Creating Your Invitation
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── CTA Section ───────────────────────────────────────── */}
      <section style={{ padding: '6rem 1.5rem' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{
            maxWidth: '900px',
            margin: '0 auto',
            textAlign: 'center',
            padding: '4rem 2rem',
            borderRadius: '28px',
            background: 'linear-gradient(135deg, rgba(92,124,250,0.08), rgba(240,101,149,0.08))',
            border: '1px solid rgba(255,255,255,0.06)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Decorative glow */}
          <div style={{
            position: 'absolute',
            top: '-50%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(92,124,250,0.1), transparent 60%)',
            pointerEvents: 'none',
          }} />

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, marginBottom: '1rem', position: 'relative' }}
          >
            Ready to Create Something <span className="gradient-text">Beautiful</span>?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            style={{ color: '#868e96', fontSize: '1.1rem', marginBottom: '2rem', maxWidth: '500px', margin: '0 auto 2rem', position: 'relative' }}
          >
            Join thousands who are creating memorable invitations. Completely free.
          </motion.p>
          <motion.div whileHover={{ scale: 1.03, boxShadow: '0 0 40px rgba(76,110,245,0.3)' }} whileTap={{ scale: 0.98 }} style={{ position: 'relative' }}>
            <Link href="/register" className="btn-primary" style={{ padding: '1rem 3rem', fontSize: '1.1rem' }}>
              Get Started Now
            </Link>
          </motion.div>
        </motion.div>
      </section>

      <Footer />
      <DemoPrompt />
    </div>
  );
}
