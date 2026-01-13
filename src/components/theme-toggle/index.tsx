'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';

/**
 * ThemeToggle Component
 *
 * Toggles between light and dark themes using next-themes.
 *
 * IMPORTANT: Uses mounted state to prevent hydration mismatch.
 * - useTheme returns undefined on server (localStorage unavailable)
 * - We only render theme-dependent UI after mounting on client
 * - This prevents "Text content does not match server-rendered HTML" errors in production
 *
 * @see https://github.com/pacocoursey/next-themes#avoid-hydration-mismatch
 */
export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // Only show theme toggle after mounting on client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Show fallback button during SSR and initial hydration
  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" aria-label="Toggle theme">
        <Sun className="h-5 w-5" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      aria-label="Toggle theme"
    >
      <Sun className="h-5 w-5 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
      <Moon className="absolute h-5 w-5 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
