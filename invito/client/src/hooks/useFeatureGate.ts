'use client';

import { useAuth } from '@/context/AuthContext';
import { Template } from '@/types';

export function useFeatureGate() {
  const { user } = useAuth();
  const isPremium = user?.plan === 'premium' || user?.role === 'admin';

  return {
    isPremium,
    userPlan: user?.plan || 'free',
    canUseTemplate: (template: Template) => !template.isPremium || isPremium,
    canUseMusic: isPremium,
    canUseScratchCard: isPremium,
    canUseAdvancedAnimations: isPremium,
    canUseGallery: isPremium,
    showWatermark: !isPremium,
    maxGalleryImages: isPremium ? 10 : 1,
  };
}
