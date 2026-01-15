'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { forwardRef } from 'react';

export interface FormCheckboxProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type'
> {
  /**
   * Label text or React node
   */
  label: React.ReactNode;

  /**
   * Error message
   */
  error?: string;
}

/**
 * FormCheckbox Component
 *
 * Animated checkbox with:
 * - Scale animation on check/uncheck
 * - Checkmark draw animation
 * - Error state support
 * - Accessible keyboard support
 *
 * @example
 * ```tsx
 * <FormCheckbox
 *   label={<>Acepto los <Link href="/terms">Términos y Condiciones</Link></>}
 *   error={errors.terms?.message}
 *   {...register('terms')}
 * />
 * ```
 */
export const FormCheckbox = forwardRef<HTMLInputElement, FormCheckboxProps>(
  ({ label, error, ...props }, ref) => {
    const hasError = Boolean(error);

    return (
      <div className="w-full">
        <label className="flex cursor-pointer items-start gap-3">
          {/* Hidden native checkbox */}
          <input
            ref={ref}
            type="checkbox"
            {...props}
            className="peer sr-only"
            aria-invalid={hasError}
            aria-describedby={error ? `${props.id || props.name}-error` : undefined}
          />

          {/* Custom checkbox */}
          <div className="relative mt-0.5 flex-shrink-0">
            <motion.div
              className={`flex h-5 w-5 items-center justify-center rounded border transition-colors peer-focus:ring-2 peer-focus:ring-offset-2 ${
                hasError
                  ? 'border-destructive bg-input peer-checked:border-destructive peer-checked:bg-destructive peer-focus:ring-destructive'
                  : 'border-input bg-input peer-checked:border-primary peer-checked:bg-primary peer-focus:ring-primary'
              }`}
              whileTap={{ scale: 0.95 }}
            >
              {/* Checkmark icon */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: props.checked ? 1 : 0,
                  opacity: props.checked ? 1 : 0,
                }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
              </motion.div>
            </motion.div>
          </div>

          {/* Label */}
          <span className="text-foreground text-sm">{label}</span>
        </label>

        {/* Error Message */}
        {hasError && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            id={`${props.id || props.name}-error`}
            className="text-destructive mt-2 text-sm"
            role="alert"
          >
            {error}
          </motion.p>
        )}
      </div>
    );
  }
);

FormCheckbox.displayName = 'FormCheckbox';
