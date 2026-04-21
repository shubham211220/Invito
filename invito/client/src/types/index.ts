// ─── User ────────────────────────────────────────────────────
export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
}

// ─── Auth ────────────────────────────────────────────────────
export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

// ─── Invitation ──────────────────────────────────────────────
export interface Invitation {
  _id: string;
  userId: string;
  title: string;
  templateId: string;
  hostName: string;
  eventDate: string;
  eventTime: string;
  location: string;
  mapLink?: string;
  description?: string;
  imageUrl?: string;
  slug: string;
  rsvpEnabled: boolean;
  dressCode?: string;
  contactInfo?: string;
  rsvpCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInvitationData {
  title: string;
  templateId: string;
  hostName: string;
  eventDate: string;
  eventTime?: string;
  location: string;
  mapLink?: string;
  description?: string;
  imageUrl?: string;
  rsvpEnabled: boolean;
  dressCode?: string;
  contactInfo?: string;
}

// ─── RSVP ────────────────────────────────────────────────────
export interface RSVP {
  _id: string;
  invitationId: string;
  guestName: string;
  attending: boolean;
  message?: string;
  createdAt: string;
}

export interface RSVPSubmission {
  guestName: string;
  attending: boolean;
  message?: string;
}

export interface RSVPStats {
  total: number;
  attending: number;
  declined: number;
}

// ─── Dashboard Stats ─────────────────────────────────────────
export interface DashboardStats {
  totalInvitations: number;
  totalRsvps: number;
  attendingRsvps: number;
  declinedRsvps: number;
}

// ─── Template ────────────────────────────────────────────────
export interface Template {
  id: string;
  name: string;
  category: TemplateCategory;
  description: string;
  previewColor: string;
  previewGradient: string;
  fontFamily: string;
  icon: string;
}

export type TemplateCategory = 'wedding' | 'birthday' | 'engagement' | 'party' | 'corporate';

// ─── API Response ────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
}
