import type { HeroSlide } from './types';

/**
 * Hero carousel slides
 * Financial empowerment themed taglines for Colombian context
 */
export const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'slide-1',
    tagline: 'Transforma el estrés financiero en claridad',
    gradient: 'from-purple-600 via-purple-700 to-indigo-800',
  },
  {
    id: 'slide-2',
    tagline: 'Tu asistente de vida inteligente',
    gradient: 'from-indigo-600 via-purple-600 to-pink-700',
  },
  {
    id: 'slide-3',
    tagline: 'Navega tu camino financiero con confianza',
    gradient: 'from-purple-700 via-indigo-700 to-blue-800',
  },
];

/**
 * Auto-rotate interval in milliseconds
 */
export const CAROUSEL_INTERVAL = 5000;

/**
 * Animation duration in seconds
 */
export const ANIMATION_DURATION = 0.7;
