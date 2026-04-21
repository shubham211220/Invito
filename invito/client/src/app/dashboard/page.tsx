'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { Invitation, DashboardStats } from '@/types';
import { formatDate, getInviteUrl, copyToClipboard, getWhatsAppShareUrl, getTimeUntilEvent } from '@/lib/utils';
import { getTemplateById } from '@/data/templates';
import toast from 'react-hot-toast';
import Navbar from '@/components/layout/Navbar';
import {
  HiOutlinePlus, HiOutlineEye, HiOutlinePencilSquare, HiOutlineTrash,
  HiOutlineLink, HiOutlineEnvelope, HiOutlineCalendarDays,
  HiOutlineUserGroup, HiOutlineCheckCircle, HiOutlineXCircle,
  HiOutlineSparkles, HiOutlineChatBubbleLeftRight
} from 'react-icons/hi2';
import { FaWhatsapp } from 'react-icons/fa';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.4 } }),
};

export default function DashboardPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [rsvpModal, setRsvpModal] = useState<string | null>(null);
  const [rsvps, setRsvps] = useState<any[]>([]);
  const [rsvpStats, setRsvpStats] = useState<any>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) fetchData();
  }, [isAuthenticated]);

  const fetchData = async () => {
    try {
      const [invRes, statsRes] = await Promise.all([
        api.get('/invitations'),
        api.get('/invitations/stats'),
      ]);
      setInvitations(invRes.data.data.invitations);
      setStats(statsRes.data.data.stats);
    } catch (err) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/invitations/${id}`);
      toast.success('Invitation deleted');
      setDeleteId(null);
      fetchData();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const handleCopyLink = async (slug: string) => {
    const url = getInviteUrl(slug);
    const ok = await copyToClipboard(url);
    if (ok) toast.success('Link copied!');
    else toast.error('Failed to copy');
  };

  const openRsvpModal = async (invitationId: string) => {
    setRsvpModal(invitationId);
    try {
      const res = await api.get(`/rsvp/invitation/${invitationId}`);
      setRsvps(res.data.data.rsvps);
      setRsvpStats(res.data.data.stats);
    } catch (err) {
      toast.error('Failed to load RSVPs');
    }
  };

  if (isLoading || loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '40px', height: '40px', border: '3px solid rgba(92,124,250,0.2)', borderTopColor: '#5c7cfa', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
          <p style={{ color: '#868e96' }}>Loading your dashboard...</p>
          <style jsx>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Invitations', value: stats?.totalInvitations || 0, icon: <HiOutlineEnvelope />, color: '#5c7cfa' },
    { label: 'Total RSVPs', value: stats?.totalRsvps || 0, icon: <HiOutlineUserGroup />, color: '#f06595' },
    { label: 'Attending', value: stats?.attendingRsvps || 0, icon: <HiOutlineCheckCircle />, color: '#40c057' },
    { label: 'Declined', value: stats?.declinedRsvps || 0, icon: <HiOutlineXCircle />, color: '#ff6b6b' },
  ];

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '5.5rem 1.5rem 3rem' }}>
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.25rem' }}>
              Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0]}</span>
            </h1>
            <p style={{ color: '#868e96' }}>Manage your invitations and track RSVPs</p>
          </div>
          <Link href="/create" className="btn-primary" style={{ gap: '0.5rem' }}>
            <HiOutlinePlus /> Create Invitation
          </Link>
        </motion.div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
          {statCards.map((s, i) => (
            <motion.div key={i} custom={i} variants={fadeUp} initial="hidden" animate="visible" className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', color: s.color, flexShrink: 0 }}>
                {s.icon}
              </div>
              <div>
                <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f1f3f5' }}>{s.value}</p>
                <p style={{ fontSize: '0.8rem', color: '#868e96' }}>{s.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Invitations */}
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>Your Invitations</h2>

        {invitations.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.5rem' }}>No Invitations Yet</h3>
            <p style={{ color: '#868e96', marginBottom: '1.5rem' }}>Create your first beautiful invitation now!</p>
            <Link href="/create" className="btn-primary"><HiOutlinePlus /> Create Your First Invitation</Link>
          </motion.div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
            {invitations.map((inv, i) => {
              const template = getTemplateById(inv.templateId);
              return (
                <motion.div key={inv._id} custom={i} variants={fadeUp} initial="hidden" animate="visible" className="card" style={{ overflow: 'hidden', padding: 0 }}>
                  {/* Card Header */}
                  <div style={{ height: '100px', background: template?.previewGradient || 'linear-gradient(135deg, #1a1a2e, #2a2a3e)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    <span style={{ fontSize: '2rem' }}>{template?.icon || '🎉'}</span>
                    <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem' }}>
                      <span className="badge badge-primary">{template?.category || 'event'}</span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div style={{ padding: '1.25rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', color: '#f1f3f5' }}>{inv.title}</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '1rem' }}>
                      <p style={{ fontSize: '0.8rem', color: '#868e96', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <HiOutlineCalendarDays /> {formatDate(inv.eventDate)}
                      </p>
                      <p style={{ fontSize: '0.8rem', color: '#868e96' }}>📍 {inv.location}</p>
                      <p style={{ fontSize: '0.75rem', color: '#5c7cfa' }}>{getTimeUntilEvent(inv.eventDate)}</p>
                    </div>

                    {/* RSVP Badge */}
                    <div style={{ marginBottom: '1rem' }}>
                      <span className={`badge ${inv.rsvpEnabled ? 'badge-success' : 'badge-warning'}`} style={{ cursor: inv.rsvpEnabled ? 'pointer' : 'default' }} onClick={() => inv.rsvpEnabled && openRsvpModal(inv._id)}>
                        <HiOutlineChatBubbleLeftRight style={{ marginRight: '0.3rem' }} />
                        {inv.rsvpCount || 0} RSVPs {inv.rsvpEnabled ? '' : '(disabled)'}
                      </span>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <Link href={`/invite/${inv.slug}`} target="_blank" className="btn-secondary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}>
                        <HiOutlineEye /> View
                      </Link>
                      <Link href={`/edit/${inv._id}`} className="btn-secondary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}>
                        <HiOutlinePencilSquare /> Edit
                      </Link>
                      <button onClick={() => handleCopyLink(inv.slug)} className="btn-secondary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}>
                        <HiOutlineLink /> Copy
                      </button>
                      <a href={getWhatsAppShareUrl(inv)} target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', color: '#40c057', textDecoration: 'none' }}>
                        <FaWhatsapp />
                      </a>
                      <button onClick={() => setDeleteId(inv._id)} className="btn-secondary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', color: '#ff6b6b', borderColor: 'rgba(255,107,107,0.2)' }}>
                        <HiOutlineTrash />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {deleteId && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} onClick={() => setDeleteId(null)}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-strong" style={{ borderRadius: '20px', padding: '2rem', maxWidth: '400px', width: '90%', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🗑️</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Delete Invitation?</h3>
            <p style={{ color: '#868e96', fontSize: '0.9rem', marginBottom: '1.5rem' }}>This will permanently delete this invitation and all RSVPs. This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button onClick={() => setDeleteId(null)} className="btn-secondary">Cancel</button>
              <button onClick={() => handleDelete(deleteId)} className="btn-danger">Delete</button>
            </div>
          </motion.div>
        </div>
      )}

      {/* RSVP Modal */}
      {rsvpModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} onClick={() => { setRsvpModal(null); setRsvps([]); setRsvpStats(null); }}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-strong" style={{ borderRadius: '20px', padding: '2rem', maxWidth: '520px', width: '90%', maxHeight: '80vh', overflow: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>Guest Responses</h3>

            {rsvpStats && (
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                <span className="badge badge-primary">Total: {rsvpStats.total}</span>
                <span className="badge badge-success">Attending: {rsvpStats.attending}</span>
                <span className="badge badge-danger">Declined: {rsvpStats.declined}</span>
              </div>
            )}

            {rsvps.length === 0 ? (
              <p style={{ color: '#868e96', textAlign: 'center', padding: '2rem 0' }}>No RSVPs yet</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {rsvps.map((r: any) => (
                  <div key={r._id} style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ fontWeight: 600, color: '#f1f3f5' }}>{r.guestName}</span>
                      <span className={`badge ${r.attending ? 'badge-success' : 'badge-danger'}`}>
                        {r.attending ? '✓ Attending' : '✕ Declined'}
                      </span>
                    </div>
                    {r.message && <p style={{ fontSize: '0.85rem', color: '#868e96', fontStyle: 'italic' }}>&ldquo;{r.message}&rdquo;</p>}
                  </div>
                ))}
              </div>
            )}

            <button onClick={() => { setRsvpModal(null); setRsvps([]); setRsvpStats(null); }} className="btn-secondary" style={{ width: '100%', marginTop: '1.5rem', justifyContent: 'center' }}>
              Close
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
