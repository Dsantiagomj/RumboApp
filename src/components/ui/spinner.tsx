/**
 * Spinner component
 *
 * Animated loading spinner with customizable size.
 * Uses CSS animations for smooth performance.
 */

import { cn } from '@/lib/utils';

export interface SpinnerProps {
  /**
   * Size variant
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Additional CSS classes
   */
  className?: string;
}

const sizeClasses = {
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-8 w-8 border-3',
};

/**
 * Spinner component
 *
 * @example
 * ```tsx
 * <Spinner size="sm" />
 * <Spinner size="md" className="text-primary" />
 * ```
 */
export function Spinner({ size = 'md', className }: SpinnerProps) {
  return (
    <div
      className={cn(
        'inline-block animate-spin rounded-full border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]',
        sizeClasses[size],
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}
