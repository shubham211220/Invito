'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  HiOutlineSparkles,
  HiOutlineBars3,
  HiOutlineXMark,
  HiOutlineCog6Tooth,
  HiOutlineCreditCard,
  HiOutlineArrowRightOnRectangle,
  HiOutlineShieldCheck,
  HiOutlineUserCircle,
} from 'react-icons/hi2';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    if (profileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [profileOpen]);

  // Close dropdown on ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setProfileOpen(false);
    };
    if (profileOpen) {
      document.addEventListener('keydown', handleEsc);
    }
    return () => document.removeEventListener('keydown', handleEsc);
  }, [profileOpen]);

  const handleLogout = () => {
    setProfileOpen(false);
    setMobileOpen(false);
    logout();
    router.push('/');
  };

  // Get user initials for fallback avatar
  const getInitials = (name?: string) => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return parts[0][0].toUpperCase();
  };

  const avatarUrl = user?.profileImage || user?.avatar;

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

              {/* Avatar + Dropdown */}
              <div ref={dropdownRef} style={{ position: 'relative' }}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  aria-label="Open profile menu"
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    border: profileOpen ? '2px solid #5c7cfa' : '2px solid rgba(255,255,255,0.12)',
                    background: 'transparent',
                    cursor: 'pointer',
                    padding: '0',
                    overflow: 'hidden',
                    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                    boxShadow: profileOpen ? '0 0 0 3px rgba(92,124,250,0.2)' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={user?.name || 'Profile'}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                    />
                  ) : (
                    <HiOutlineUserCircle style={{ width: '100%', height: '100%', color: '#adb5bd', padding: '2px' }} />
                  )}
                </button>

                {/* Profile Dropdown */}
                {profileOpen && (
                  <div
                    className="profile-dropdown"
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: 'calc(100% + 8px)',
                      width: '300px',
                      borderRadius: '16px',
                      background: 'rgba(18, 18, 24, 0.98)',
                      backdropFilter: 'blur(24px)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)',
                      animation: 'dropdownFadeIn 0.2s ease-out',
                      overflow: 'hidden',
                    }}
                  >
                    {/* Profile Card Section */}
                    <div style={{
                      padding: '1.25rem 1rem',
                      background: 'rgba(255,255,255,0.02)',
                      borderBottom: '1px solid rgba(255,255,255,0.06)',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                        {/* Avatar */}
                        <div style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '50%',
                          overflow: 'hidden',
                          flexShrink: 0,
                          border: '2px solid rgba(255,255,255,0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: 'linear-gradient(135deg, #5c7cfa, #f06595)',
                        }}>
                          {avatarUrl ? (
                            <img
                              src={avatarUrl}
                              alt={user?.name || 'Profile'}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          ) : (
                            <HiOutlineUserCircle style={{ width: '100%', height: '100%', color: '#fff', padding: '2px' }} />
                          )}
                        </div>

                        {/* Name / Email / Badge */}
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <p style={{
                              fontWeight: 700,
                              fontSize: '0.95rem',
                              color: '#f1f3f5',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              margin: 0,
                            }}>
                              {user?.name}
                            </p>
                            {user?.plan === 'premium' && (
                              <span style={{
                                fontSize: '0.65rem',
                                fontWeight: 700,
                                padding: '0.15rem 0.5rem',
                                borderRadius: '20px',
                                background: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(217,119,6,0.1))',
                                color: '#fbbf24',
                                border: '1px solid rgba(245,158,11,0.2)',
                                whiteSpace: 'nowrap',
                                letterSpacing: '0.03em',
                                textTransform: 'uppercase',
                              }}>
                                👑 Premium
                              </span>
                            )}
                          </div>
                          <p style={{
                            fontSize: '0.8rem',
                            color: '#6c757d',
                            margin: '0.15rem 0 0',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}>
                            {user?.email}
                          </p>
                        </div>
                      </div>

                      {/* Status Indicator */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        marginTop: '0.85rem',
                        paddingLeft: '0.15rem',
                      }}>
                        <div style={{
                          width: '7px',
                          height: '7px',
                          borderRadius: '50%',
                          background: '#40c057',
                          boxShadow: '0 0 6px rgba(64,192,87,0.5)',
                          flexShrink: 0,
                        }} />
                        <span style={{ fontSize: '0.72rem', color: '#868e96' }}>Currently logged in</span>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div style={{ padding: '0.5rem' }}>
                      {/* Admin Dashboard - only for admins */}
                      {user?.role === 'admin' && (
                        <button
                          onClick={() => { setProfileOpen(false); router.push('/admin/dashboard'); }}
                          className="dropdown-item"
                        >
                          <HiOutlineShieldCheck style={{ fontSize: '1.1rem', color: '#f06595' }} />
                          <span>Admin Dashboard</span>
                        </button>
                      )}

                      {/* Billing / Plan */}
                      <button
                        onClick={() => { setProfileOpen(false); /* future billing page */ }}
                        className="dropdown-item"
                      >
                        <HiOutlineCreditCard style={{ fontSize: '1.1rem', color: '#868e96' }} />
                        <span style={{ flex: 1 }}>Billing & Plan</span>
                        <span style={{
                          fontSize: '0.65rem',
                          fontWeight: 600,
                          padding: '0.15rem 0.45rem',
                          borderRadius: '6px',
                          background: user?.plan === 'premium'
                            ? 'rgba(245,158,11,0.1)'
                            : 'rgba(92,124,250,0.1)',
                          color: user?.plan === 'premium' ? '#fbbf24' : '#5c7cfa',
                          textTransform: 'uppercase',
                          letterSpacing: '0.03em',
                        }}>
                          {user?.plan === 'premium' ? '👑 Premium' : 'Upgrade ₹29'}
                        </span>
                      </button>

                      {/* Settings */}
                      <button
                        onClick={() => { setProfileOpen(false); /* future settings page */ }}
                        className="dropdown-item"
                      >
                        <HiOutlineCog6Tooth style={{ fontSize: '1.1rem', color: '#868e96' }} />
                        <span>Settings</span>
                      </button>
                    </div>

                    {/* Logout Section */}
                    <div style={{
                      borderTop: '1px solid rgba(255,255,255,0.06)',
                      padding: '0.5rem',
                    }}>
                      <button
                        onClick={handleLogout}
                        className="dropdown-item dropdown-item-danger"
                      >
                        <HiOutlineArrowRightOnRectangle style={{ fontSize: '1.1rem' }} />
                        <span>Log out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
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
              {/* Mobile Profile Card */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                borderRadius: '12px',
                background: 'rgba(255,255,255,0.03)',
                marginBottom: '0.25rem',
              }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  flexShrink: 0,
                  background: 'linear-gradient(135deg, #5c7cfa, #f06595)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <HiOutlineUserCircle style={{ width: '100%', height: '100%', color: '#fff', padding: '2px' }} />
                  )}
                </div>
                <div>
                  <p style={{ fontWeight: 600, fontSize: '0.85rem', color: '#f1f3f5', margin: 0 }}>{user?.name}</p>
                  <p style={{ fontSize: '0.72rem', color: '#6c757d', margin: 0 }}>{user?.email}</p>
                </div>
              </div>

              {user?.role === 'admin' && (
                <Link href="/admin/dashboard" onClick={() => setMobileOpen(false)} className="btn-secondary" style={{ justifyContent: 'center', borderColor: '#f06595', color: '#f06595' }}>
                  Admin Dashboard
                </Link>
              )}
              <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="btn-secondary" style={{ justifyContent: 'center' }}>
                Dashboard
              </Link>
              <Link href="/create" onClick={() => setMobileOpen(false)} className="btn-primary" style={{ justifyContent: 'center' }}>
                Create Invitation
              </Link>
              <button onClick={handleLogout} className="btn-secondary" style={{ justifyContent: 'center', color: '#ff6b6b' }}>
                Log out
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

        @keyframes dropdownFadeIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-4px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        :global(.dropdown-item) {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          width: 100%;
          padding: 0.65rem 0.85rem;
          border-radius: 10px;
          border: none;
          background: transparent;
          color: #dee2e6;
          font-size: 0.88rem;
          font-weight: 500;
          font-family: inherit;
          cursor: pointer;
          transition: background 0.15s ease, color 0.15s ease;
          text-align: left;
        }

        :global(.dropdown-item:hover) {
          background: rgba(255, 255, 255, 0.06);
        }

        :global(.dropdown-item-danger) {
          color: #ff6b6b;
        }

        :global(.dropdown-item-danger:hover) {
          background: rgba(255, 107, 107, 0.08);
        }
      `}</style>
    </nav>
  );
}
