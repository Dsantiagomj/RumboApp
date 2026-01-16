'use client';

/**
 * Auth template
 *
 * Wraps all auth pages with AnimatePresence for page transitions.
 * Uses Framer Motion to animate between login, register, and reset pages.
 */

import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

/**
 * Page transition variants
 */
const pageVariants = {
  initial: {
    opacity: 0,
    x: -20,
  },
  animate: {
    opacity: 1,
    x: 0,
  },
  exit: {
    opacity: 0,
    x: 20,
  },
};

/**
 * Auth template component
 *
 * Provides smooth page transitions for auth flow:
 * - Fade + slide animations
 * - Preserves layout during transitions
 * - Prevents layout shift
 */
export default function AuthTemplate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{
          duration: 0.3,
          ease: 'easeInOut',
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
