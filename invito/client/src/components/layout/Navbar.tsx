'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { HiOutlineSparkles, HiOutlineBars3, HiOutlineXMark } from 'react-icons/hi2';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: '0 1.5rem',
        transition: 'all 0.3s ease',
        background: scrolled ? 'rgba(10, 10, 15, 0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '70px',
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <HiOutlineSparkles style={{ fontSize: '1.5rem', color: '#5c7cfa' }} />
          <span
            style={{
              fontSize: '1.5rem',
              fontWeight: 800,
              background: 'linear-gradient(135deg, #5c7cfa, #f06595)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.02em',
            }}
          >
            Invito
          </span>
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }} className="desktop-nav">
          {isAuthenticated ? (
            <>
              <Link href="/dashboard" className="btn-secondary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.875rem' }}>
                Dashboard
              </Link>
              <Link href="/create" className="btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.875rem' }}>
                Create Invitation
              </Link>
              <button
                onClick={logout}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#adb5bd',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  padding: '0.5rem 0.75rem',
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                style={{
                  color: '#dee2e6',
                  textDecoration: 'none',
                  fontWeight: 500,
                  fontSize: '0.95rem',
                  padding: '0.5rem 1rem',
                  transition: 'color 0.3s',
                }}
              >
                Login
              </Link>
              <Link href="/register" className="btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.875rem' }}>
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="mobile-toggle"
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            color: '#dee2e6',
            fontSize: '1.5rem',
            cursor: 'pointer',
          }}
        >
          {mobileOpen ? <HiOutlineXMark /> : <HiOutlineBars3 />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          style={{
            padding: '1rem 0 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            borderTop: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          {isAuthenticated ? (
            <>
              <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="btn-secondary" style={{ justifyContent: 'center' }}>
                Dashboard
              </Link>
              <Link href="/create" onClick={() => setMobileOpen(false)} className="btn-primary" style={{ justifyContent: 'center' }}>
                Create Invitation
              </Link>
              <button onClick={() => { logout(); setMobileOpen(false); }} className="btn-secondary" style={{ justifyContent: 'center' }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setMobileOpen(false)} className="btn-secondary" style={{ justifyContent: 'center' }}>
                Login
              </Link>
              <Link href="/register" onClick={() => setMobileOpen(false)} className="btn-primary" style={{ justifyContent: 'center' }}>
                Get Started
              </Link>
            </>
          )}
        </div>
      )}

      <style jsx>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
      `}</style>
    </nav>
  );
}
