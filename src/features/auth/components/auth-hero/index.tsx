'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

import { ANIMATION_DURATION, CAROUSEL_INTERVAL, HERO_SLIDES } from './constants';

/**
 * AuthHero Component
 *
 * Animated hero carousel for authentication pages with:
 * - Desktop: Auto-rotating slides (5s interval) with visible content
 * - Mobile: Static gradient background (no rotation, just backdrop)
 * - Pause on hover (desktop only)
 * - Mobile-first responsive design
 *
 * @example
 * ```tsx
 * <AuthHero />
 * ```
 */
export function AuthHero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  // Detect desktop viewport (≥1024px)
  useEffect(() => {
    const checkViewport = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    // Check on mount
    checkViewport();

    // Listen for resize
    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  // Auto-rotate slides (ONLY on desktop)
  useEffect(() => {
    if (!isDesktop || isPaused) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, CAROUSEL_INTERVAL);

    return () => clearInterval(interval);
  }, [isDesktop, isPaused]);

  const slide = HERO_SLIDES[currentSlide];

  return (
    <div
      className="relative h-full w-full overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Gradient - Static on mobile, animated on desktop */}
      <AnimatePresence mode="wait">
        <motion.div
          key={isDesktop ? slide.id : 'mobile-static'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: ANIMATION_DURATION }}
          className={`absolute inset-0 ${
            isDesktop
              ? `bg-gradient-to-br ${slide.gradient}`
              : 'bg-gradient-to-br from-purple-900 via-purple-950 to-slate-900'
          }`}
        />
      </AnimatePresence>

      {/* Darker overlay for mobile (better form readability) */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-transparent lg:from-black/20" />

      {/* Content Container - Hidden on mobile, visible on desktop */}
      <div className="relative z-10 hidden h-full flex-col items-center justify-center px-8 text-center lg:flex">
        {/* Logo/Brand */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="text-5xl font-bold text-white lg:text-6xl">Rumbo</h1>
        </motion.div>

        {/* Animated Tagline */}
        <AnimatePresence mode="wait">
          <motion.h2
            key={slide.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: ANIMATION_DURATION, ease: 'easeInOut' }}
            className="mb-16 max-w-md text-2xl font-medium text-white/95 lg:text-3xl"
          >
            {slide.tagline}
          </motion.h2>
        </AnimatePresence>

        {/* Dots Indicator */}
        <div className="flex gap-2">
          {HERO_SLIDES.map((_, index) => (
            <button
              key={`dot-${index}`}
              onClick={() => setCurrentSlide(index)}
              className="group relative h-2 w-2 transition-all"
              aria-label={`Ir a slide ${index + 1}`}
            >
              {/* Background dot */}
              <div className="h-2 w-2 rounded-full bg-white/30 transition-all group-hover:bg-white/50" />

              {/* Active indicator */}
              {currentSlide === index && (
                <motion.div
                  layoutId="active-dot"
                  className="absolute inset-0 rounded-full bg-white"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
