'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { templates, categories, getTemplatesByCategory } from '@/data/templates';
import { Template } from '@/types';
import Navbar from '@/components/layout/Navbar';
import { HiOutlineArrowRight } from 'react-icons/hi2';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.4 } }),
};

export default function CreatePage() {
  const { isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('all');
  const [filtered, setFiltered] = useState<Template[]>(templates);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push('/login');
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    setFiltered(getTemplatesByCategory(activeCategory));
  }, [activeCategory]);

  const handleSelect = (templateId: string) => {
    router.push(`/create/${templateId}`);
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
          {filtered.map((template, i) => (
            <motion.div
              key={template.id}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              onClick={() => handleSelect(template.id)}
              style={{
                borderRadius: '16px',
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.06)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              whileHover={{ y: -6, boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}
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
                <span style={{ fontSize: '3.5rem', filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.3))' }}>{template.icon}</span>
                <span style={{ fontSize: '1rem', fontWeight: 600, color: 'rgba(255,255,255,0.8)', fontFamily: template.fontFamily === 'Playfair Display' ? 'var(--font-display)' : 'var(--font-body)' }}>
                  {template.name}
                </span>
                <span style={{ position: 'absolute', top: '1rem', right: '1rem', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', background: 'rgba(255,255,255,0.1)', padding: '0.25rem 0.75rem', borderRadius: '100px', color: '#dee2e6' }}>
                  {template.category}
                </span>
              </div>

              {/* Info */}
              <div style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.02)' }}>
                <p style={{ color: '#868e96', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '1rem' }}>{template.description}</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.8rem', color: '#5c7cfa', fontWeight: 600 }}>Use this template</span>
                  <HiOutlineArrowRight style={{ color: '#5c7cfa' }} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
