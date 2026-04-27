'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import Script from 'next/script';

interface UpgradePromptProps {
  isOpen: boolean;
  onClose: () => void;
  feature?: string;
}

const PREMIUM_PRICE = 29;

const premiumFeatures = [
  { icon: '🎨', label: 'All premium templates unlocked' },
  { icon: '🎵', label: 'Background music on invitations' },
  { icon: '✨', label: 'Scratch card reveal experience' },
  { icon: '🎊', label: 'Advanced animations & effects' },
  { icon: '🖼️', label: 'Multi-image gallery (up to 10)' },
  { icon: '🚫', label: 'No watermark on invitations' },
];

export default function UpgradePrompt({ isOpen, onClose, feature }: UpgradePromptProps) {
  const { user, token } = useAuth();
  const [upgrading, setUpgrading] = useState(false);

  const handleUpgrade = async () => {
    setUpgrading(true);
    try {
      // 1. Create order
      const orderRes = await api.post('/payment/create-order');
      const { orderId, amount, currency } = orderRes.data.data;

      // 2. Initialize Razorpay options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
        amount: amount.toString(),
        currency: currency,
        name: 'Invito',
        description: 'Upgrade to Premium Plan',
        image: 'https://i.imgur.com/your-logo.png', // Optional logo
        order_id: orderId,
        handler: async function (response: any) {
          try {
            // 3. Verify Payment
            const verifyRes = await api.post('/payment/verify-payment', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes.data.success) {
              const updatedUser = verifyRes.data.data.user;
              localStorage.setItem('invito_user', JSON.stringify(updatedUser));
              toast.success('🎉 Welcome to Premium!');
              onClose();
              window.location.reload();
            }
          } catch (err: any) {
            toast.error(err.response?.data?.message || 'Payment verification failed');
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
        },
        theme: {
          color: '#f59e0b',
        },
        modal: {
          ondismiss: function () {
            setUpgrading(false);
          },
        },
      };

      // @ts-ignore
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        toast.error(response.error.description || 'Payment failed');
        setUpgrading(false);
      });
      rzp.open();
    } catch (err: any) {
      toast.error('Failed to initiate payment. Please try again later.');
      setUpgrading(false);
    }
  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <AnimatePresence>
        {isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 300,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(8px)',
          }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '460px',
              width: '92%',
              borderRadius: '24px',
              overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 40px 100px rgba(0,0,0,0.5), 0 0 60px rgba(251,191,36,0.1)',
            }}
          >
            {/* Gradient Header */}
            <div
              style={{
                padding: '2.5rem 2rem 2rem',
                background: 'linear-gradient(135deg, #1a1508 0%, #2a1f08 50%, #3a2b08 100%)',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Decorative orbs */}
              <div style={{ position: 'absolute', width: '200px', height: '200px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(251,191,36,0.15), transparent 70%)', top: '-50px', right: '-30px' }} />
              <div style={{ position: 'absolute', width: '150px', height: '150px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(251,191,36,0.1), transparent 70%)', bottom: '-40px', left: '-20px' }} />

              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                style={{ fontSize: '3.5rem', marginBottom: '1rem', position: 'relative', zIndex: 1 }}
              >
                👑
              </motion.div>
              <h2 style={{
                fontSize: '1.6rem',
                fontWeight: 800,
                background: 'linear-gradient(135deg, #fbbf24, #f59e0b, #fbbf24)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: '0.5rem',
                position: 'relative',
                zIndex: 1,
              }}>
                Upgrade to Premium
              </h2>
              {feature && (
                <p style={{ color: 'rgba(251,191,36,0.7)', fontSize: '0.85rem', position: 'relative', zIndex: 1 }}>
                  <strong>{feature}</strong> is a premium feature
                </p>
              )}
            </div>

            {/* Features List */}
            <div style={{
              padding: '1.5rem 2rem',
              background: 'rgba(255,255,255,0.03)',
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {premiumFeatures.map((f, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      fontSize: '0.9rem',
                      color: '#e9ecef',
                    }}
                  >
                    <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{f.icon}</span>
                    <span>{f.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Pricing Section */}
            <div style={{
              padding: '1.25rem 2rem',
              background: 'rgba(245,158,11,0.04)',
              borderTop: '1px solid rgba(255,255,255,0.04)',
              borderBottom: '1px solid rgba(255,255,255,0.04)',
              textAlign: 'center',
            }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '0.25rem' }}>
                <span style={{ fontSize: '1rem', color: '#868e96', fontWeight: 500 }}>₹</span>
                <span style={{
                  fontSize: '2.8rem',
                  fontWeight: 900,
                  background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  lineHeight: 1,
                }}>{PREMIUM_PRICE}</span>
              </div>
              <p style={{ color: '#868e96', fontSize: '0.78rem', marginTop: '0.3rem' }}>One-time payment · Lifetime access</p>
            </div>

            {/* Actions */}
            <div style={{
              padding: '1.5rem 2rem 2rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}>
              <button
                onClick={handleUpgrade}
                disabled={upgrading}
                style={{
                  width: '100%',
                  padding: '0.9rem 1.5rem',
                  borderRadius: '14px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  color: '#1a1508',
                  fontWeight: 800,
                  fontSize: '1rem',
                  cursor: upgrading ? 'wait' : 'pointer',
                  transition: 'all 0.3s',
                  opacity: upgrading ? 0.7 : 1,
                  boxShadow: '0 8px 30px rgba(245,158,11,0.3)',
                  fontFamily: 'inherit',
                }}
              >
                {upgrading ? 'Processing...' : `✨ Upgrade Now — ₹${PREMIUM_PRICE}`}
              </button>
              <button
                onClick={onClose}
                style={{
                  width: '100%',
                  padding: '0.7rem 1.5rem',
                  borderRadius: '14px',
                  border: '1px solid rgba(255,255,255,0.08)',
                  background: 'transparent',
                  color: '#868e96',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                Maybe Later
              </button>
            </div>
          </motion.div>
        </div>
      )}
      </AnimatePresence>
    </>
  );
}
