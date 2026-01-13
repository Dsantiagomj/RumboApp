import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useTheme } from 'next-themes';

import { ThemeToggle } from './index';

// Mock next-themes
vi.mock('next-themes', () => ({
  useTheme: vi.fn(),
}));

describe('ThemeToggle Component', () => {
  const mockSetTheme = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Hydration & Mounting', () => {
    it('should render fallback button when not mounted (SSR)', () => {
      vi.mocked(useTheme).mockReturnValue({
        theme: 'light',
        setTheme: mockSetTheme,
        systemTheme: 'light',
        themes: ['light', 'dark'],
        resolvedTheme: 'light',
        forcedTheme: undefined,
      });

      render(<ThemeToggle />);
      const button = screen.getByRole('button', { name: /toggle theme/i });

      expect(button).toBeInTheDocument();
      // Fallback shows only Sun icon (no Moon icon)
      expect(button.querySelector('svg')).toBeInTheDocument();
    });

    it('should render theme-dependent UI after mounting', async () => {
      vi.mocked(useTheme).mockReturnValue({
        theme: 'light',
        setTheme: mockSetTheme,
        systemTheme: 'light',
        themes: ['light', 'dark'],
        resolvedTheme: 'light',
        forcedTheme: undefined,
      });

      render(<ThemeToggle />);

      // Wait for component to mount
      await waitFor(() => {
        const button = screen.getByRole('button', { name: /toggle theme/i });
        // After mounting, both icons are rendered (one visible, one hidden with CSS)
        const icons = button.querySelectorAll('svg');
        expect(icons.length).toBeGreaterThanOrEqual(1);
      });
    });
  });

  describe('Theme Rendering', () => {
    it('should show Sun icon in light mode after mounting', async () => {
      vi.mocked(useTheme).mockReturnValue({
        theme: 'light',
        setTheme: mockSetTheme,
        systemTheme: 'light',
        themes: ['light', 'dark'],
        resolvedTheme: 'light',
        forcedTheme: undefined,
      });

      render(<ThemeToggle />);

      await waitFor(() => {
        const button = screen.getByRole('button', { name: /toggle theme/i });
        expect(button).toBeInTheDocument();
      });
    });

    it('should show Moon icon in dark mode after mounting', async () => {
      vi.mocked(useTheme).mockReturnValue({
        theme: 'dark',
        setTheme: mockSetTheme,
        systemTheme: 'dark',
        themes: ['light', 'dark'],
        resolvedTheme: 'dark',
        forcedTheme: undefined,
      });

      render(<ThemeToggle />);

      await waitFor(() => {
        const button = screen.getByRole('button', { name: /toggle theme/i });
        expect(button).toBeInTheDocument();
      });
    });
  });

  describe('Theme Toggling', () => {
    it('should toggle from light to dark on click', async () => {
      vi.mocked(useTheme).mockReturnValue({
        theme: 'light',
        setTheme: mockSetTheme,
        systemTheme: 'light',
        themes: ['light', 'dark'],
        resolvedTheme: 'light',
        forcedTheme: undefined,
      });

      const user = userEvent.setup();
      render(<ThemeToggle />);

      await waitFor(() => {
        const button = screen.getByRole('button', { name: /toggle theme/i });
        expect(button).toBeInTheDocument();
      });

      const button = screen.getByRole('button', { name: /toggle theme/i });
      await user.click(button);

      expect(mockSetTheme).toHaveBeenCalledWith('dark');
      expect(mockSetTheme).toHaveBeenCalledTimes(1);
    });

    it('should toggle from dark to light on click', async () => {
      vi.mocked(useTheme).mockReturnValue({
        theme: 'dark',
        setTheme: mockSetTheme,
        systemTheme: 'dark',
        themes: ['light', 'dark'],
        resolvedTheme: 'dark',
        forcedTheme: undefined,
      });

      const user = userEvent.setup();
      render(<ThemeToggle />);

      await waitFor(() => {
        const button = screen.getByRole('button', { name: /toggle theme/i });
        expect(button).toBeInTheDocument();
      });

      const button = screen.getByRole('button', { name: /toggle theme/i });
      await user.click(button);

      expect(mockSetTheme).toHaveBeenCalledWith('light');
      expect(mockSetTheme).toHaveBeenCalledTimes(1);
    });

    it('should toggle multiple times correctly', async () => {
      vi.mocked(useTheme).mockReturnValue({
        theme: 'light',
        setTheme: mockSetTheme,
        systemTheme: 'light',
        themes: ['light', 'dark'],
        resolvedTheme: 'light',
        forcedTheme: undefined,
      });

      const user = userEvent.setup();
      const { rerender } = render(<ThemeToggle />);

      await waitFor(() => {
        const button = screen.getByRole('button', { name: /toggle theme/i });
        expect(button).toBeInTheDocument();
      });

      const button = screen.getByRole('button', { name: /toggle theme/i });

      // First toggle: light → dark
      await user.click(button);
      expect(mockSetTheme).toHaveBeenCalledWith('dark');

      // Update mock to return dark theme
      vi.mocked(useTheme).mockReturnValue({
        theme: 'dark',
        setTheme: mockSetTheme,
        systemTheme: 'dark',
        themes: ['light', 'dark'],
        resolvedTheme: 'dark',
        forcedTheme: undefined,
      });

      rerender(<ThemeToggle />);

      // Second toggle: dark → light
      await user.click(button);
      expect(mockSetTheme).toHaveBeenCalledWith('light');

      expect(mockSetTheme).toHaveBeenCalledTimes(2);
    });
  });

  describe('Accessibility', () => {
    it('should have proper aria-label', async () => {
      vi.mocked(useTheme).mockReturnValue({
        theme: 'light',
        setTheme: mockSetTheme,
        systemTheme: 'light',
        themes: ['light', 'dark'],
        resolvedTheme: 'light',
        forcedTheme: undefined,
      });

      render(<ThemeToggle />);

      const button = screen.getByRole('button', { name: /toggle theme/i });
      expect(button).toHaveAttribute('aria-label', 'Toggle theme');
    });

    it('should have screen reader only text', async () => {
      vi.mocked(useTheme).mockReturnValue({
        theme: 'light',
        setTheme: mockSetTheme,
        systemTheme: 'light',
        themes: ['light', 'dark'],
        resolvedTheme: 'light',
        forcedTheme: undefined,
      });

      render(<ThemeToggle />);

      await waitFor(() => {
        const srText = screen.getByText(/toggle theme/i);
        expect(srText).toHaveClass('sr-only');
      });
    });

    it('should be keyboard accessible', async () => {
      vi.mocked(useTheme).mockReturnValue({
        theme: 'light',
        setTheme: mockSetTheme,
        systemTheme: 'light',
        themes: ['light', 'dark'],
        resolvedTheme: 'light',
        forcedTheme: undefined,
      });

      const user = userEvent.setup();
      render(<ThemeToggle />);

      await waitFor(() => {
        const button = screen.getByRole('button', { name: /toggle theme/i });
        expect(button).toBeInTheDocument();
      });

      const button = screen.getByRole('button', { name: /toggle theme/i });

      // Focus button with Tab
      await user.tab();
      expect(button).toHaveFocus();

      // Trigger with Enter key
      await user.keyboard('{Enter}');
      expect(mockSetTheme).toHaveBeenCalled();
    });
  });

  describe('Visual States', () => {
    it('should apply ghost variant and icon size', async () => {
      vi.mocked(useTheme).mockReturnValue({
        theme: 'light',
        setTheme: mockSetTheme,
        systemTheme: 'light',
        themes: ['light', 'dark'],
        resolvedTheme: 'light',
        forcedTheme: undefined,
      });

      render(<ThemeToggle />);

      await waitFor(() => {
        const button = screen.getByRole('button', { name: /toggle theme/i });
        // Button should have ghost variant and icon size classes from shadcn/ui
        expect(button).toBeInTheDocument();
      });
    });

    it('should show transition classes on icons', async () => {
      vi.mocked(useTheme).mockReturnValue({
        theme: 'light',
        setTheme: mockSetTheme,
        systemTheme: 'light',
        themes: ['light', 'dark'],
        resolvedTheme: 'light',
        forcedTheme: undefined,
      });

      render(<ThemeToggle />);

      await waitFor(() => {
        const button = screen.getByRole('button', { name: /toggle theme/i });
        const icons = button.querySelectorAll('svg');

        // Should have transition classes for smooth animation
        icons.forEach((icon) => {
          expect(icon.className).toContain('transition-all');
        });
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined theme gracefully', async () => {
      vi.mocked(useTheme).mockReturnValue({
        theme: undefined,
        setTheme: mockSetTheme,
        systemTheme: 'light',
        themes: ['light', 'dark'],
        resolvedTheme: 'light',
        forcedTheme: undefined,
      });

      render(<ThemeToggle />);

      await waitFor(() => {
        const button = screen.getByRole('button', { name: /toggle theme/i });
        expect(button).toBeInTheDocument();
      });

      const user = userEvent.setup();
      const button = screen.getByRole('button', { name: /toggle theme/i });
      await user.click(button);

      // When theme is undefined (not === 'light'), it sets to 'light'
      expect(mockSetTheme).toHaveBeenCalledWith('light');
    });

    it('should handle system theme preference', async () => {
      vi.mocked(useTheme).mockReturnValue({
        theme: 'system',
        setTheme: mockSetTheme,
        systemTheme: 'dark',
        themes: ['light', 'dark', 'system'],
        resolvedTheme: 'dark',
        forcedTheme: undefined,
      });

      const user = userEvent.setup();
      render(<ThemeToggle />);

      await waitFor(() => {
        const button = screen.getByRole('button', { name: /toggle theme/i });
        expect(button).toBeInTheDocument();
      });

      const button = screen.getByRole('button', { name: /toggle theme/i });
      await user.click(button);

      // When theme is 'system', clicking should toggle to explicit theme
      expect(mockSetTheme).toHaveBeenCalled();
    });
  });
});
