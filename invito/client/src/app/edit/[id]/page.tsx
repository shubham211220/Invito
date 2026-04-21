'use client';

import React, { useState, useEffect, useCallback, use } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { Invitation } from '@/types';
import { getTemplateById } from '@/data/templates';
import toast from 'react-hot-toast';
import Navbar from '@/components/layout/Navbar';
import { HiOutlineArrowLeft, HiOutlineCheck } from 'react-icons/hi2';

export default function EditInvitationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '', hostName: '', eventDate: '', eventTime: '', location: '',
    mapLink: '', description: '', rsvpEnabled: true, dressCode: '', contactInfo: '',
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push('/login');
  }, [isLoading, isAuthenticated, router]);

  const fetchInvitation = useCallback(async () => {
    try {
      const res = await api.get(`/invitations/${id}`);
      const inv = res.data.data.invitation;
      setInvitation(inv);
      setFormData({
        title: inv.title, hostName: inv.hostName,
        eventDate: inv.eventDate?.split('T')[0] || '',
        eventTime: inv.eventTime || '', location: inv.location,
        mapLink: inv.mapLink || '', description: inv.description || '',
        rsvpEnabled: inv.rsvpEnabled, dressCode: inv.dressCode || '', contactInfo: inv.contactInfo || '',
      });
    } catch (err) {
      toast.error('Failed to load invitation');
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    if (isAuthenticated && id) fetchInvitation();
  }, [isAuthenticated, id, fetchInvitation]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.put(`/invitations/${id}`, formData);
      toast.success('Invitation updated!');
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid rgba(92,124,250,0.2)', borderTopColor: '#5c7cfa', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <style jsx>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const template = invitation ? getTemplateById(invitation.templateId) : null;

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '5.5rem 1.5rem 3rem' }}>
        <button onClick={() => router.push('/dashboard')} className="btn-secondary" style={{ marginBottom: '1.5rem', fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
          <HiOutlineArrowLeft /> Back to Dashboard
        </button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.25rem' }}>Edit Invitation</h1>
          <p style={{ color: '#868e96', marginBottom: '2rem' }}>{template?.icon} {template?.name} template</p>
        </motion.div>

        <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label className="input-label">Event Title *</label>
              <input name="title" value={formData.title} onChange={handleChange} className="input-field" required />
            </div>
            <div>
              <label className="input-label">Host Name *</label>
              <input name="hostName" value={formData.hostName} onChange={handleChange} className="input-field" required />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label className="input-label">Event Date *</label>
                <input type="date" name="eventDate" value={formData.eventDate} onChange={handleChange} className="input-field" required style={{ colorScheme: 'dark' }} />
              </div>
              <div>
                <label className="input-label">Event Time</label>
                <input type="time" name="eventTime" value={formData.eventTime} onChange={handleChange} className="input-field" style={{ colorScheme: 'dark' }} />
              </div>
            </div>
            <div>
              <label className="input-label">Location *</label>
              <input name="location" value={formData.location} onChange={handleChange} className="input-field" required />
            </div>
            <div>
              <label className="input-label">Google Maps Link</label>
              <input name="mapLink" value={formData.mapLink} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="input-label">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} className="input-field" rows={4} style={{ resize: 'vertical' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label className="input-label">Dress Code</label>
                <input name="dressCode" value={formData.dressCode} onChange={handleChange} className="input-field" />
              </div>
              <div>
                <label className="input-label">Contact Info</label>
                <input name="contactInfo" value={formData.contactInfo} onChange={handleChange} className="input-field" />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0' }}>
              <span style={{ fontWeight: 600 }}>Enable RSVP</span>
              <label style={{ position: 'relative', display: 'inline-block', width: '48px', height: '26px', cursor: 'pointer' }}>
                <input type="checkbox" name="rsvpEnabled" checked={formData.rsvpEnabled} onChange={handleChange} style={{ opacity: 0, width: 0, height: 0 }} />
                <span style={{ position: 'absolute', inset: 0, borderRadius: '100px', background: formData.rsvpEnabled ? '#5c7cfa' : 'rgba(255,255,255,0.15)', transition: 'all 0.3s' }}>
                  <span style={{ position: 'absolute', width: '20px', height: '20px', borderRadius: '50%', background: '#fff', top: '3px', left: formData.rsvpEnabled ? '25px' : '3px', transition: 'all 0.3s' }} />
                </span>
              </label>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button type="button" onClick={() => router.push('/dashboard')} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary" disabled={submitting} style={{ opacity: submitting ? 0.7 : 1 }}>
              {submitting ? 'Saving...' : (<><HiOutlineCheck /> Save Changes</>)}
            </button>
          </div>
        </motion.form>
      </div>
    </div>
  );
}
