import { Template } from '@/types';

export const templates: Template[] = [
  {
    id: 'wedding-elegant',
    name: 'Elegant Bliss',
    category: 'wedding',
    description: 'A timeless design with gold foil accents and classic serif typography.',
    previewColor: '#1a1a2e',
    previewGradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    fontFamily: 'Playfair Display',
    icon: '💍',
    isPremium: false,
  },
  {
    id: 'wedding-floral',
    name: 'Floral Dreams',
    category: 'wedding',
    description: 'Soft pastels with botanical watercolor elements and romantic script fonts.',
    previewColor: '#2d1b2e',
    previewGradient: 'linear-gradient(135deg, #2d1b2e 0%, #4a2040 50%, #6b2d5b 100%)',
    fontFamily: 'Playfair Display',
    icon: '🌸',
    isPremium: true,
  },
  {
    id: 'birthday-fun',
    name: 'Party Pop',
    category: 'birthday',
    description: 'Bold, vibrant colors with confetti animations and playful elements.',
    previewColor: '#1a0a2e',
    previewGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    fontFamily: 'DM Sans',
    icon: '🎂',
    isPremium: false,
  },
  {
    id: 'birthday-minimal',
    name: 'Clean Celebrate',
    category: 'birthday',
    description: 'Minimal, modern design with muted tones and clean typography.',
    previewColor: '#0a0a0f',
    previewGradient: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #2a2a3e 100%)',
    fontFamily: 'Inter',
    icon: '🎈',
    isPremium: false,
  },
  {
    id: 'engagement-gold',
    name: 'Golden Promise',
    category: 'engagement',
    description: 'Luxurious gold accents on a dark background with sparkle effects.',
    previewColor: '#1a1508',
    previewGradient: 'linear-gradient(135deg, #1a1508 0%, #2a2008 50%, #3a2b08 100%)',
    fontFamily: 'Playfair Display',
    icon: '💎',
    isPremium: true,
  },
  {
    id: 'party-neon',
    name: 'Neon Nights',
    category: 'party',
    description: 'Electric neon glow effects on a dark theme with vibrant energy.',
    previewColor: '#0a0a1a',
    previewGradient: 'linear-gradient(135deg, #0a0a1a 0%, #1a0a2e 50%, #2a0a3e 100%)',
    fontFamily: 'DM Sans',
    icon: '🎆',
    isPremium: true,
  },
  {
    id: 'corporate-clean',
    name: 'Professional',
    category: 'corporate',
    description: 'Clean, structured layout with professional typography and brand-friendly design.',
    previewColor: '#0d1117',
    previewGradient: 'linear-gradient(135deg, #0d1117 0%, #161b22 50%, #21262d 100%)',
    fontFamily: 'Inter',
    icon: '🏢',
    isPremium: false,
  },
];

export const categories = [
  { id: 'all', label: 'All Templates', icon: '✨' },
  { id: 'wedding', label: 'Wedding', icon: '💒' },
  { id: 'birthday', label: 'Birthday', icon: '🎂' },
  { id: 'engagement', label: 'Engagement', icon: '💍' },
  { id: 'party', label: 'Party', icon: '🎉' },
  { id: 'corporate', label: 'Corporate', icon: '💼' },
] as const;

export function getTemplateById(id: string): Template | undefined {
  return templates.find((t) => t.id === id);
}

export function getTemplatesByCategory(category: string): Template[] {
  if (category === 'all') return templates;
  return templates.filter((t) => t.category === category);
}
