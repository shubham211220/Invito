'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { templates } from '@/data/templates';
import { HiOutlineSparkles, HiOutlinePaintBrush, HiOutlineLink, HiOutlineClipboardDocumentCheck, HiOutlineShare } from 'react-icons/hi2';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  }),
};

export default function HomePage() {
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
        {/* Animated background orbs */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 0 }}>
          <div
            style={{
              position: 'absolute',
              width: '600px',
              height: '600px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(92,124,250,0.15), transparent 70%)',
              top: '-10%',
              right: '-15%',
              animation: 'float 8s ease-in-out infinite',
            }}
          />
          <div
            style={{
              position: 'absolute',
              width: '500px',
              height: '500px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(240,101,149,0.12), transparent 70%)',
              bottom: '-5%',
              left: '-10%',
              animation: 'float 10s ease-in-out infinite reverse',
            }}
          />
          <div
            style={{
              position: 'absolute',
              width: '300px',
              height: '300px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(252,196,25,0.08), transparent 70%)',
              top: '40%',
              left: '50%',
              animation: 'float 7s ease-in-out infinite',
            }}
          />
        </div>

        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '800px' }}>
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
            <Link href="/register" className="btn-primary" style={{ padding: '0.9rem 2.5rem', fontSize: '1.05rem' }}>
              Start Creating — It&apos;s Free
            </Link>
            <Link href="#templates" className="btn-secondary" style={{ padding: '0.9rem 2.5rem', fontSize: '1.05rem' }}>
              Browse Templates
            </Link>
          </motion.div>
        </div>
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
                className="card"
                style={{ textAlign: 'center', padding: '2.5rem 2rem' }}
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
                style={{
                  borderRadius: '16px',
                  overflow: 'hidden',
                  border: '1px solid rgba(255,255,255,0.06)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
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
                  <span style={{ filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.3))' }}>{template.icon}</span>
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
            <Link href="/register" className="btn-primary" style={{ padding: '0.9rem 2.5rem', fontSize: '1.05rem' }}>
              Start Creating Your Invitation
            </Link>
          </div>
        </div>
      </section>

      {/* ─── CTA Section ───────────────────────────────────────── */}
      <section style={{ padding: '6rem 1.5rem' }}>
        <div
          style={{
            maxWidth: '900px',
            margin: '0 auto',
            textAlign: 'center',
            padding: '4rem 2rem',
            borderRadius: '24px',
            background: 'linear-gradient(135deg, rgba(92,124,250,0.08), rgba(240,101,149,0.08))',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, marginBottom: '1rem' }}
          >
            Ready to Create Something <span className="gradient-text">Beautiful</span>?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            style={{ color: '#868e96', fontSize: '1.1rem', marginBottom: '2rem', maxWidth: '500px', margin: '0 auto 2rem' }}
          >
            Join thousands who are creating memorable invitations. Completely free.
          </motion.p>
          <Link href="/register" className="btn-primary" style={{ padding: '1rem 3rem', fontSize: '1.1rem' }}>
            Get Started Now
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
