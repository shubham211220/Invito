'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useFeatureGate } from '@/hooks/useFeatureGate';
import { templates, categories, getTemplatesByCategory } from '@/data/templates';
import { Template } from '@/types';
import Navbar from '@/components/layout/Navbar';
import UpgradePrompt from '@/components/UpgradePrompt';
import { HiOutlineArrowRight, HiOutlineLockClosed } from 'react-icons/hi2';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.4 } }),
};

export default function CreatePage() {
  const { isLoading, isAuthenticated } = useAuth();
  const { canUseTemplate, isPremium } = useFeatureGate();
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('all');
  const [filtered, setFiltered] = useState<Template[]>(templates);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [upgradeFeature, setUpgradeFeature] = useState('');

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push('/login');
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    setFiltered(getTemplatesByCategory(activeCategory));
  }, [activeCategory]);

  const handleSelect = (template: Template) => {
    if (!canUseTemplate(template)) {
      setUpgradeFeature(`${template.name} template`);
      setShowUpgrade(true);
      return;
    }
    router.push(`/create/${template.id}`);
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '5.5rem 1.5rem 3rem' }}>
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            Choose a <span className="gradient-text">Template</span>
          </h1>
          <p style={{ color: '#868e96', fontSize: '1.05rem' }}>Select a beautiful template to get started</p>
          {!isPremium && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              style={{ color: '#f59e0b', fontSize: '0.85rem', marginTop: '0.75rem' }}
            >
              👑 Upgrade to <strong>Premium</strong> to unlock all templates
            </motion.p>
          )}
        </motion.div>

        {/* Category Filter */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: '100px',
                border: '1px solid',
                borderColor: activeCategory === cat.id ? 'rgba(92,124,250,0.5)' : 'rgba(255,255,255,0.08)',
                background: activeCategory === cat.id ? 'rgba(92,124,250,0.15)' : 'rgba(255,255,255,0.04)',
                color: activeCategory === cat.id ? '#748ffc' : '#adb5bd',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: 600,
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <span>{cat.icon}</span> {cat.label}
            </button>
          ))}
        </motion.div>

        {/* Template Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {filtered.map((template, i) => {
            const isLocked = !canUseTemplate(template);
            return (
              <motion.div
                key={template.id}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                onClick={() => handleSelect(template)}
                style={{
                  borderRadius: '16px',
                  overflow: 'hidden',
                  border: `1px solid ${isLocked ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.06)'}`,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                }}
                whileHover={{ y: -6, boxShadow: isLocked ? '0 20px 60px rgba(245,158,11,0.15)' : '0 20px 60px rgba(0,0,0,0.4)' }}
              >
                {/* Preview Area */}
                <div
                  style={{
                    height: '220px',
                    background: template.previewGradient,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.75rem',
                    position: 'relative',
                  }}
                >
                  <span style={{ fontSize: '3.5rem', filter: `drop-shadow(0 4px 20px rgba(0,0,0,0.3)) ${isLocked ? 'grayscale(0.3)' : ''}` }}>{template.icon}</span>
                  <span style={{ fontSize: '1rem', fontWeight: 600, color: 'rgba(255,255,255,0.8)', fontFamily: template.fontFamily === 'Playfair Display' ? 'var(--font-display)' : 'var(--font-body)' }}>
                    {template.name}
                  </span>

                  {/* Category badge */}
                  <span style={{ position: 'absolute', top: '1rem', right: '1rem', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', background: 'rgba(255,255,255,0.1)', padding: '0.25rem 0.75rem', borderRadius: '100px', color: '#dee2e6' }}>
                    {template.category}
                  </span>

                  {/* Premium crown badge */}
                  {template.isPremium && (
                    <div style={{
                      position: 'absolute',
                      top: '1rem',
                      left: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      padding: '0.3rem 0.75rem',
                      borderRadius: '100px',
                      background: isLocked ? 'linear-gradient(135deg, rgba(245,158,11,0.25), rgba(217,119,6,0.2))' : 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(217,119,6,0.1))',
                      border: '1px solid rgba(245,158,11,0.3)',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      color: '#fbbf24',
                    }}>
                      👑 Premium
                    </div>
                  )}

                  {/* Lock overlay for non-premium users */}
                  {isLocked && (
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'rgba(0,0,0,0.35)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backdropFilter: 'blur(1px)',
                    }}>
                      <div style={{
                        padding: '0.6rem 1.5rem',
                        borderRadius: '100px',
                        background: 'rgba(0,0,0,0.6)',
                        border: '1px solid rgba(245,158,11,0.3)',
                        color: '#fbbf24',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                      }}>
                        <HiOutlineLockClosed /> Unlock with Premium
                      </div>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.02)' }}>
                  <p style={{ color: '#868e96', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '1rem' }}>{template.description}</p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.8rem', color: isLocked ? '#f59e0b' : '#5c7cfa', fontWeight: 600 }}>
                      {isLocked ? 'Upgrade to use' : 'Use this template'}
                    </span>
                    {isLocked ? <HiOutlineLockClosed style={{ color: '#f59e0b' }} /> : <HiOutlineArrowRight style={{ color: '#5c7cfa' }} />}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Upgrade Modal */}
      <UpgradePrompt isOpen={showUpgrade} onClose={() => setShowUpgrade(false)} feature={upgradeFeature} />
    </div>
  );
}
