'use client';

import React from 'react';
import Link from 'next/link';
import { HiOutlineSparkles } from 'react-icons/hi2';

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '3rem 1.5rem 2rem',
        background: 'linear-gradient(180deg, transparent, rgba(10,10,15,0.8))',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2rem',
            marginBottom: '2rem',
          }}
        >
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <HiOutlineSparkles style={{ fontSize: '1.25rem', color: '#5c7cfa' }} />
              <span style={{ fontSize: '1.25rem', fontWeight: 800 }} className="gradient-text">
                Invito
              </span>
            </div>
            <p style={{ color: '#868e96', fontSize: '0.875rem', lineHeight: 1.7 }}>
              Create stunning digital invitations for every occasion. Beautiful templates, easy sharing, real-time RSVPs.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: '#dee2e6', fontSize: '0.875rem', fontWeight: 700, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Quick Links
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                { href: '/create', label: 'Create Invitation' },
                { href: '/dashboard', label: 'Dashboard' },
                { href: '/login', label: 'Login' },
                { href: '/register', label: 'Register' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{ color: '#868e96', textDecoration: 'none', fontSize: '0.875rem', transition: 'color 0.2s' }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 style={{ color: '#dee2e6', fontSize: '0.875rem', fontWeight: 700, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Templates
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {['Wedding', 'Birthday', 'Engagement', 'Party', 'Corporate'].map((cat) => (
                <span key={cat} style={{ color: '#868e96', fontSize: '0.875rem' }}>
                  {cat} Invitations
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div
          style={{
            borderTop: '1px solid rgba(255,255,255,0.06)',
            paddingTop: '1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <p style={{ color: '#495057', fontSize: '0.8rem' }}>
            © {new Date().getFullYear()} Invito. Made with ❤️ for beautiful moments.
          </p>
        </div>
      </div>
    </footer>
  );
}
