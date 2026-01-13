import { describe, it, expect } from 'vitest';

import { cn } from './utils';

describe('cn (className merge utility)', () => {
  describe('Basic Functionality', () => {
    it('should merge single className', () => {
      const result = cn('text-red-500');
      expect(result).toBe('text-red-500');
    });

    it('should merge multiple classNames', () => {
      const result = cn('text-red-500', 'bg-blue-500');
      expect(result).toBe('text-red-500 bg-blue-500');
    });

    it('should handle empty input', () => {
      const result = cn();
      expect(result).toBe('');
    });

    it('should handle undefined and null values', () => {
      const result = cn('text-red-500', undefined, null, 'bg-blue-500');
      expect(result).toBe('text-red-500 bg-blue-500');
    });

    it('should handle falsy values', () => {
      const condition = false;
      const result = cn('text-red-500', condition && 'hidden', 'bg-blue-500');
      expect(result).toBe('text-red-500 bg-blue-500');
    });
  });

  describe('Tailwind CSS Conflict Resolution', () => {
    it('should resolve conflicting padding classes', () => {
      const result = cn('p-4', 'p-8');
      // twMerge should keep only the last conflicting class
      expect(result).toBe('p-8');
    });

    it('should resolve conflicting text color classes', () => {
      const result = cn('text-red-500', 'text-blue-500');
      expect(result).toBe('text-blue-500');
    });

    it('should resolve conflicting background classes', () => {
      const result = cn('bg-red-500', 'bg-blue-500');
      expect(result).toBe('bg-blue-500');
    });

    it('should keep non-conflicting classes', () => {
      const result = cn('p-4', 'text-red-500', 'm-2');
      expect(result).toContain('p-4');
      expect(result).toContain('text-red-500');
      expect(result).toContain('m-2');
    });

    it('should resolve complex conflicting classes', () => {
      const result = cn('px-4 py-2', 'p-8');
      // p-8 should override both px-4 and py-2
      expect(result).toBe('p-8');
    });
  });

  describe('Conditional Classes', () => {
    it('should handle conditional classes with ternary', () => {
      const isActive = true;
      const result = cn('base-class', isActive ? 'active' : 'inactive');
      expect(result).toBe('base-class active');
    });

    it('should handle conditional classes with logical AND', () => {
      const hasError = true;
      const result = cn('base-class', hasError && 'text-red-500');
      expect(result).toBe('base-class text-red-500');
    });

    it('should handle multiple conditional classes', () => {
      const isActive = true;
      const hasError = false;
      const result = cn('base-class', isActive && 'active', hasError && 'error');
      expect(result).toBe('base-class active');
    });
  });

  describe('Object Syntax', () => {
    it('should handle object with boolean values', () => {
      const result = cn({
        'text-red-500': true,
        'bg-blue-500': false,
        'p-4': true,
      });
      expect(result).toContain('text-red-500');
      expect(result).not.toContain('bg-blue-500');
      expect(result).toContain('p-4');
    });

    it('should merge object syntax with string classes', () => {
      const result = cn('base-class', {
        active: true,
        disabled: false,
      });
      expect(result).toContain('base-class');
      expect(result).toContain('active');
      expect(result).not.toContain('disabled');
    });
  });

  describe('Array Syntax', () => {
    it('should handle array of classes', () => {
      const result = cn(['text-red-500', 'bg-blue-500']);
      expect(result).toBe('text-red-500 bg-blue-500');
    });

    it('should handle nested arrays', () => {
      const result = cn(['text-red-500', ['bg-blue-500', 'p-4']]);
      expect(result).toContain('text-red-500');
      expect(result).toContain('bg-blue-500');
      expect(result).toContain('p-4');
    });

    it('should handle mixed array and string syntax', () => {
      const result = cn('base-class', ['active', 'hover:opacity-80']);
      expect(result).toContain('base-class');
      expect(result).toContain('active');
      expect(result).toContain('hover:opacity-80');
    });
  });

  describe('Real-world Use Cases', () => {
    it('should handle shadcn/ui button variant pattern', () => {
      const variant: 'default' | 'outline' = 'default';
      const size: 'sm' | 'md' = 'md';
      const result = cn(
        'inline-flex items-center justify-center',
        variant === 'default' && 'bg-primary text-primary-foreground',
        variant === 'outline' && 'border border-input',
        size === 'sm' && 'h-8 px-3',
        size === 'md' && 'h-10 px-4'
      );

      expect(result).toContain('inline-flex');
      expect(result).toContain('bg-primary');
      expect(result).toContain('h-10');
      expect(result).not.toContain('border');
      expect(result).not.toContain('h-8');
    });

    it('should handle custom className prop override', () => {
      const baseClasses = 'text-sm font-medium';
      const customClassName = 'text-lg font-bold';
      const result = cn(baseClasses, customClassName);

      // Should resolve conflicts in favor of custom className
      expect(result).toContain('font-bold');
      expect(result).toContain('text-lg');
      expect(result).not.toContain('text-sm');
      expect(result).not.toContain('font-medium');
    });

    it('should handle responsive classes', () => {
      const result = cn('p-4', 'md:p-8', 'lg:p-12');
      expect(result).toContain('p-4');
      expect(result).toContain('md:p-8');
      expect(result).toContain('lg:p-12');
    });

    it('should handle state variants (hover, focus, etc.)', () => {
      const result = cn('bg-primary', 'hover:bg-primary/90', 'focus:ring-2', 'focus:ring-offset-2');
      expect(result).toContain('bg-primary');
      expect(result).toContain('hover:bg-primary/90');
      expect(result).toContain('focus:ring-2');
      expect(result).toContain('focus:ring-offset-2');
    });

    it('should handle dark mode classes', () => {
      const result = cn('bg-white text-black', 'dark:bg-black dark:text-white');
      expect(result).toContain('bg-white');
      expect(result).toContain('text-black');
      expect(result).toContain('dark:bg-black');
      expect(result).toContain('dark:text-white');
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long className strings', () => {
      const longClassName =
        'class1 class2 class3 class4 class5 class6 class7 class8 class9 class10';
      const result = cn(longClassName);
      expect(result).toBe(longClassName);
    });

    it('should handle duplicate classes', () => {
      const result = cn('text-red-500', 'text-red-500');
      // Should deduplicate
      expect(result).toBe('text-red-500');
    });

    it('should trim whitespace', () => {
      const result = cn('  text-red-500  ', '  bg-blue-500  ');
      expect(result).toBe('text-red-500 bg-blue-500');
    });

    it('should handle empty strings', () => {
      const result = cn('text-red-500', '', 'bg-blue-500');
      expect(result).toBe('text-red-500 bg-blue-500');
    });
  });
});
