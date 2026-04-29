import { Invitation } from '@/types';

// ─── Demo Invitation Constants ───────────────────────────────
export const DEMO_SLUG = 'demo-invite';

/**
 * Hardcoded demo invitation used on the homepage "Live Demo" experience.
 * This data is intercepted on the frontend before hitting the API,
 * so no database entry or backend change is required.
 *
 * Marked as `userPlan: 'premium'` to showcase all premium features
 * (scratch card reveal, music player, particles, etc.)
 */
export const demoInvitation: Invitation = {
  _id: 'demo-invite-static',
  userId: 'demo-user-static',
  title: 'Rahul & Sneha Wedding',
  templateId: 'wedding-elegant',
  hostName: 'The Sharma Family',
  eventDate: '2026-12-25T00:00:00.000Z',
  eventTime: '18:00',
  location: 'The Grand Ballroom, Taj Lands End, Mumbai',
  mapLink: 'https://maps.google.com/?q=Taj+Lands+End+Mumbai',
  description:
    'With immense joy and blessings, we invite you to celebrate the union of our beloved Rahul & Sneha. Join us for an evening of love, laughter, and togetherness as two souls become one. Your presence will make this occasion truly special. 💍✨',
  imageUrl:
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
  slug: DEMO_SLUG,
  rsvpEnabled: true,
  dressCode: 'Traditional / Formal Attire',
  contactInfo: '+91 98765 43210',
  userPlan: 'premium',
  galleryImages: [],
  musicUrl: '',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};
