'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { getTemplateById } from '@/data/templates';
import toast from 'react-hot-toast';
import { useFeatureGate } from '@/hooks/useFeatureGate';
import Navbar from '@/components/layout/Navbar';
import {
  HiOutlineCalendarDays, HiOutlineMapPin, HiOutlinePhoto,
  HiOutlineDocumentText, HiOutlineChatBubbleLeftRight,
  HiOutlineArrowLeft, HiOutlineCheck
} from 'react-icons/hi2';

export default function CreateInvitationPage({ params }: { params: Promise<{ templateId: string }> }) {
  const { templateId } = use(params);
  const { isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const template = getTemplateById(templateId);

  const [formData, setFormData] = useState({
    title: '',
    hostName: '',
    eventDate: '',
    eventTime: '',
    location: '',
    mapLink: '',
    description: '',
    rsvpEnabled: true,
    dressCode: '',
    contactInfo: '',
  });
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { isPremium } = useFeatureGate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push('/login');
  }, [isLoading, isAuthenticated, router]);

  if (!template) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Template not found</h2>
          <button onClick={() => router.push('/create')} className="btn-primary">Browse Templates</button>
        </div>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    
    const maxFiles = isPremium ? 10 : 1;
    if (uploadedImageUrls.length + files.length > maxFiles) {
      toast.error(`You can only upload up to ${maxFiles} image(s) on your current plan.`);
      return;
    }

    const validFiles = files.filter(f => {
      if (f.size > 5 * 1024 * 1024) {
        toast.error(`${f.name} exceeds 5MB limit`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    setUploadingImage(true);
    try {
      const newUrls: string[] = [];
      for (const file of validFiles) {
        const formDataUpload = new FormData();
        formDataUpload.append('image', file);
        const uploadRes = await api.post('/upload-image', formDataUpload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        newUrls.push(uploadRes.data.data.imageUrl);
      }
      setUploadedImageUrls(prev => [...prev, ...newUrls]);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  const removeImage = (index: number) => {
    setUploadedImageUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.hostName || !formData.eventDate || !formData.location) {
      toast.error('Please fill all required fields');
      return;
    }
    setSubmitting(true);

    try {
      let mainImageUrl = '';
      const galleryImageUrls: string[] = [];

      if (uploadedImageUrls.length > 0) {
        mainImageUrl = uploadedImageUrls[0];
        galleryImageUrls.push(...uploadedImageUrls.slice(1));
      }

      // Create invitation
      const res = await api.post('/invitations', {
        ...formData,
        templateId,
        imageUrl: mainImageUrl,
        galleryImages: galleryImageUrls,
      });

      toast.success('Invitation created! 🎉');
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create invitation');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '5.5rem 1.5rem 3rem' }}>
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => router.push('/create')}
          className="btn-secondary"
          style={{ marginBottom: '1.5rem', fontSize: '0.85rem', padding: '0.5rem 1rem' }}
        >
          <HiOutlineArrowLeft /> Back to Templates
        </motion.button>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '2rem' }}>{template.icon}</span>
            <div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Create Invitation</h1>
              <p style={{ color: '#868e96', fontSize: '0.9rem' }}>Using {template.name} template</p>
            </div>
          </div>
        </motion.div>

        {/* Form */}
        <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} onSubmit={handleSubmit}>
          {/* Template Preview */}
          <div className="card" style={{ marginBottom: '1.5rem', padding: 0, overflow: 'hidden' }}>
            <div style={{ height: '120px', background: template.previewGradient, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '2.5rem' }}>{template.icon}</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {/* Left Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <fieldset className="card" style={{ border: '1px solid rgba(255,255,255,0.06)', padding: '1.5rem' }}>
                <legend style={{ color: '#748ffc', fontWeight: 700, fontSize: '0.85rem', padding: '0 0.5rem' }}>
                  <HiOutlineDocumentText style={{ display: 'inline', marginRight: '0.3rem' }} /> Event Details
                </legend>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
                  <div>
                    <label className="input-label">Event Title *</label>
                    <input name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Sarah & John's Wedding" className="input-field" required />
                  </div>
                  <div>
                    <label className="input-label">Host Name *</label>
                    <input name="hostName" value={formData.hostName} onChange={handleChange} placeholder="e.g. The Smith Family" className="input-field" required />
                  </div>
                  <div>
                    <label className="input-label">Description</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Tell your guests about the event..." className="input-field" rows={4} style={{ resize: 'vertical' }} />
                  </div>
                </div>
              </fieldset>

              <fieldset className="card" style={{ border: '1px solid rgba(255,255,255,0.06)', padding: '1.5rem' }}>
                <legend style={{ color: '#748ffc', fontWeight: 700, fontSize: '0.85rem', padding: '0 0.5rem' }}>
                  <HiOutlineCalendarDays style={{ display: 'inline', marginRight: '0.3rem' }} /> Date & Time
                </legend>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
                  <div>
                    <label className="input-label">Event Date *</label>
                    <input type="date" name="eventDate" value={formData.eventDate} onChange={handleChange} className="input-field" required style={{ colorScheme: 'dark' }} />
                  </div>
                  <div>
                    <label className="input-label">Event Time</label>
                    <input type="time" name="eventTime" value={formData.eventTime} onChange={handleChange} className="input-field" style={{ colorScheme: 'dark' }} />
                  </div>
                </div>
              </fieldset>
            </div>

            {/* Right Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <fieldset className="card" style={{ border: '1px solid rgba(255,255,255,0.06)', padding: '1.5rem' }}>
                <legend style={{ color: '#748ffc', fontWeight: 700, fontSize: '0.85rem', padding: '0 0.5rem' }}>
                  <HiOutlineMapPin style={{ display: 'inline', marginRight: '0.3rem' }} /> Location
                </legend>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
                  <div>
                    <label className="input-label">Venue / Location *</label>
                    <input name="location" value={formData.location} onChange={handleChange} placeholder="e.g. The Grand Ballroom" className="input-field" required />
                  </div>
                  <div>
                    <label className="input-label">Google Maps Link</label>
                    <input name="mapLink" value={formData.mapLink} onChange={handleChange} placeholder="https://maps.google.com/..." className="input-field" />
                  </div>
                </div>
              </fieldset>

              <fieldset className="card" style={{ border: '1px solid rgba(255,255,255,0.06)', padding: '1.5rem' }}>
                <legend style={{ color: '#748ffc', fontWeight: 700, fontSize: '0.85rem', padding: '0 0.5rem' }}>
                  <HiOutlinePhoto style={{ display: 'inline', marginRight: '0.3rem' }} /> Media & Extras
                </legend>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
                  {/* Image Upload */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <label className="input-label" style={{ marginBottom: 0 }}>Images</label>
                      <span style={{ fontSize: '0.75rem', color: '#868e96' }}>
                        {uploadedImageUrls.length} / {isPremium ? 10 : 1} selected
                      </span>
                    </div>
                    
                    {/* Previews grid */}
                    {uploadedImageUrls.length > 0 && (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
                        {uploadedImageUrls.map((src, i) => (
                          <div key={i} style={{ position: 'relative', height: '100px', borderRadius: '8px', overflow: 'hidden' }}>
                            <Image src={src} alt={`Preview ${i}`} fill style={{ objectFit: 'cover' }} unoptimized />
                            <button
                              type="button"
                              onClick={() => removeImage(i)}
                              style={{
                                position: 'absolute', top: '4px', right: '4px',
                                background: 'rgba(0,0,0,0.6)', border: 'none', color: '#fff',
                                width: '24px', height: '24px', borderRadius: '50%', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem'
                              }}
                            >
                              ✕
                            </button>
                            {i === 0 && (
                              <div style={{
                                position: 'absolute', bottom: 0, left: 0, right: 0,
                                background: 'rgba(92,124,250,0.8)', color: '#fff', fontSize: '0.6rem',
                                textAlign: 'center', padding: '2px 0', fontWeight: 600
                              }}>Cover</div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {uploadedImageUrls.length < (isPremium ? 10 : 1) && (
                      <div
                        style={{
                          border: '2px dashed rgba(255,255,255,0.1)',
                          borderRadius: '12px',
                          padding: '2rem',
                          textAlign: 'center',
                          cursor: uploadingImage ? 'default' : 'pointer',
                          transition: 'border-color 0.3s',
                          opacity: uploadingImage ? 0.5 : 1,
                        }}
                        onClick={() => !uploadingImage && document.getElementById('image-upload')?.click()}
                      >
                        <HiOutlinePhoto style={{ fontSize: '2rem', color: '#5c7cfa', marginBottom: '0.5rem' }} />
                        <p style={{ color: '#868e96', fontSize: '0.85rem' }}>
                          {uploadingImage ? 'Uploading...' : `Click to upload ${isPremium ? 'images (max 10)' : 'cover image'}`}
                        </p>
                        <input 
                          id="image-upload" 
                          type="file" 
                          accept="image/*" 
                          multiple={isPremium} 
                          onChange={handleImageChange} 
                          disabled={uploadingImage}
                          style={{ display: 'none' }} 
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="input-label">Dress Code</label>
                    <input name="dressCode" value={formData.dressCode} onChange={handleChange} placeholder="e.g. Black Tie, Casual, etc." className="input-field" />
                  </div>
                  <div>
                    <label className="input-label">Contact Info</label>
                    <input name="contactInfo" value={formData.contactInfo} onChange={handleChange} placeholder="e.g. +1 234 567 8901" className="input-field" />
                  </div>
                </div>
              </fieldset>

              {/* RSVP Toggle */}
              <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <HiOutlineChatBubbleLeftRight style={{ color: '#5c7cfa', fontSize: '1.25rem' }} />
                  <div>
                    <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>Enable RSVP</p>
                    <p style={{ color: '#868e96', fontSize: '0.8rem' }}>Allow guests to respond</p>
                  </div>
                </div>
                <label style={{ position: 'relative', display: 'inline-block', width: '48px', height: '26px', cursor: 'pointer' }}>
                  <input type="checkbox" name="rsvpEnabled" checked={formData.rsvpEnabled} onChange={handleChange} style={{ opacity: 0, width: 0, height: 0 }} />
                  <span style={{
                    position: 'absolute', inset: 0, borderRadius: '100px',
                    background: formData.rsvpEnabled ? '#5c7cfa' : 'rgba(255,255,255,0.15)',
                    transition: 'all 0.3s',
                  }}>
                    <span style={{
                      position: 'absolute', width: '20px', height: '20px', borderRadius: '50%', background: '#fff',
                      top: '3px', left: formData.rsvpEnabled ? '25px' : '3px', transition: 'all 0.3s',
                    }} />
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button type="button" onClick={() => router.push('/create')} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary" disabled={submitting} style={{ opacity: submitting ? 0.7 : 1, minWidth: '180px' }}>
              {submitting ? 'Creating...' : (<><HiOutlineCheck /> Create Invitation</>)}
            </button>
          </div>
        </motion.form>
      </div>
    </div>
  );
}
