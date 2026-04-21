'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import { HiOutlineSparkles, HiOutlineEnvelope, HiOutlineLockClosed, HiOutlineUser, HiOutlineEye, HiOutlineEyeSlash } from 'react-icons/hi2';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await register(name, email, password);
      toast.success('Account created! Welcome to Invito 🎉');
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1.5rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <div style={{ position: 'absolute', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(240,101,149,0.12), transparent 70%)', top: '-15%', left: '-10%' }} />
        <div style={{ position: 'absolute', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(92,124,250,0.1), transparent 70%)', bottom: '-10%', right: '-10%' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '440px' }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <HiOutlineSparkles style={{ fontSize: '1.5rem', color: '#5c7cfa' }} />
            <span style={{ fontSize: '1.75rem', fontWeight: 800 }} className="gradient-text">Invito</span>
          </Link>
        </div>

        {/* Card */}
        <div className="glass-strong" style={{ borderRadius: '20px', padding: '2.5rem 2rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem', textAlign: 'center' }}>Create Account</h1>
          <p style={{ color: '#868e96', textAlign: 'center', marginBottom: '2rem', fontSize: '0.9rem' }}>
            Start creating beautiful invitations
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            {/* Name */}
            <div>
              <label className="input-label">Full Name</label>
              <div style={{ position: 'relative' }}>
                <HiOutlineUser style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#868e96' }} />
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" className="input-field" style={{ paddingLeft: '2.75rem' }} required />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="input-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <HiOutlineEnvelope style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#868e96' }} />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="input-field" style={{ paddingLeft: '2.75rem' }} required />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="input-label">Password</label>
              <div style={{ position: 'relative' }}>
                <HiOutlineLockClosed style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#868e96' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="input-field"
                  style={{ paddingLeft: '2.75rem', paddingRight: '2.75rem' }}
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#868e96', cursor: 'pointer' }}>
                  {showPassword ? <HiOutlineEyeSlash /> : <HiOutlineEye />}
                </button>
              </div>
            </div>

            {/* Confirm */}
            <div>
              <label className="input-label">Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <HiOutlineLockClosed style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#868e96' }} />
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Re-enter password" className="input-field" style={{ paddingLeft: '2.75rem' }} required />
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', padding: '0.9rem', marginTop: '0.5rem', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#868e96', fontSize: '0.9rem' }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: '#748ffc', textDecoration: 'none', fontWeight: 600 }}>Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
