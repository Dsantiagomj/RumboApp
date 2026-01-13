import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Button } from './button';

describe('Button Component', () => {
  describe('Rendering', () => {
    it('should render with default variant', () => {
      render(<Button>Click me</Button>);
      const button = screen.getByRole('button', { name: /click me/i });

      expect(button).toBeInTheDocument();
      expect(button).toHaveClass('bg-primary');
    });

    it('should render all variants correctly', () => {
      const variants = ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'] as const;

      variants.forEach((variant) => {
        const { unmount } = render(<Button variant={variant}>{variant}</Button>);
        const button = screen.getByRole('button', { name: new RegExp(variant, 'i') });

        expect(button).toBeInTheDocument();
        unmount();
      });
    });

    it('should render all sizes correctly', () => {
      const sizes = ['default', 'sm', 'lg', 'icon'] as const;

      sizes.forEach((size) => {
        const { unmount } = render(<Button size={size}>Button</Button>);
        const button = screen.getByRole('button');

        expect(button).toBeInTheDocument();
        if (size === 'sm') {
          expect(button).toHaveClass('h-8');
        } else if (size === 'lg') {
          expect(button).toHaveClass('h-10');
        } else if (size === 'icon') {
          expect(button).toHaveClass('h-9', 'w-9');
        } else {
          expect(button).toHaveClass('h-9');
        }
        unmount();
      });
    });

    it('should render as child component when asChild is true', () => {
      render(
        <Button asChild>
          <a href="/test">Link Button</a>
        </Button>
      );

      const link = screen.getByRole('link', { name: /link button/i });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/test');
    });

    it('should apply custom className', () => {
      render(<Button className="custom-class">Button</Button>);
      const button = screen.getByRole('button');

      expect(button).toHaveClass('custom-class');
    });
  });

  describe('Interactions', () => {
    it('should handle onClick events', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(<Button onClick={handleClick}>Click me</Button>);
      const button = screen.getByRole('button', { name: /click me/i });

      await user.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should not trigger onClick when disabled', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(
        <Button onClick={handleClick} disabled>
          Click me
        </Button>
      );
      const button = screen.getByRole('button', { name: /click me/i });

      await user.click(button);

      expect(handleClick).not.toHaveBeenCalled();
      expect(button).toBeDisabled();
    });
  });

  describe('Accessibility', () => {
    it('should have proper button role', () => {
      render(<Button>Accessible Button</Button>);
      const button = screen.getByRole('button');

      expect(button).toBeInTheDocument();
    });

    it('should support aria-label', () => {
      render(<Button aria-label="Custom label">Icon</Button>);
      const button = screen.getByRole('button', { name: /custom label/i });

      expect(button).toBeInTheDocument();
    });

    it('should apply disabled state correctly', () => {
      render(<Button disabled>Disabled Button</Button>);
      const button = screen.getByRole('button');

      expect(button).toBeDisabled();
      expect(button).toHaveClass('disabled:pointer-events-none', 'disabled:opacity-50');
    });

    it('should support type attribute', () => {
      render(<Button type="submit">Submit</Button>);
      const button = screen.getByRole('button', { name: /submit/i });

      expect(button).toHaveAttribute('type', 'submit');
    });
  });

  describe('Visual States', () => {
    it('should apply destructive variant styles', () => {
      render(<Button variant="destructive">Delete</Button>);
      const button = screen.getByRole('button', { name: /delete/i });

      expect(button).toHaveClass('bg-destructive');
    });

    it('should apply outline variant styles', () => {
      render(<Button variant="outline">Outline</Button>);
      const button = screen.getByRole('button', { name: /outline/i });

      expect(button).toHaveClass('border');
    });

    it('should apply ghost variant styles', () => {
      render(<Button variant="ghost">Ghost</Button>);
      const button = screen.getByRole('button', { name: /ghost/i });

      expect(button).toHaveClass('hover:bg-accent');
    });

    it('should apply link variant styles', () => {
      render(<Button variant="link">Link</Button>);
      const button = screen.getByRole('button', { name: /link/i });

      expect(button).toHaveClass('text-primary', 'underline-offset-4');
    });
  });

  describe('Edge Cases', () => {
    it('should render with children as ReactNode', () => {
      render(
        <Button>
          <span>Icon</span>
          <span>Text</span>
        </Button>
      );
      const button = screen.getByRole('button');

      expect(button).toHaveTextContent('IconText');
    });

    it('should forward ref correctly', () => {
      const ref = vi.fn();
      render(<Button ref={ref}>Button</Button>);

      expect(ref).toHaveBeenCalled();
    });

    it('should merge multiple classNames correctly', () => {
      render(
        <Button className="custom-1 custom-2" variant="outline">
          Button
        </Button>
      );
      const button = screen.getByRole('button');

      expect(button).toHaveClass('custom-1', 'custom-2', 'border');
    });
  });
});
