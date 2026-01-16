'use client';

import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { forwardRef, useState } from 'react';

import type { FormInputProps } from '../form-input/types';

/**
 * FormPassword Component
 *
 * Password input with animated eye toggle:
 * - Show/hide password functionality
 * - Smooth icon rotation animation
 * - Inherits all FormInput features
 * - Accessible keyboard support
 *
 * @example
 * ```tsx
 * <FormPassword
 *   label="Contraseña"
 *   placeholder="••••••••"
 *   error={errors.password?.message}
 *   {...register('password')}
 * />
 * ```
 */
export const FormPassword = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, success, helperText, showRequired, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const hasError = Boolean(error);

    return (
      <div className="w-full">
        {/* Label */}
        {label && (
          <label
            htmlFor={props.id || props.name}
            className="text-foreground mb-2 block text-sm font-medium"
          >
            {label}
            {showRequired && <span className="text-destructive ml-1">*</span>}
          </label>
        )}

        {/* Input Container */}
        <div className="relative">
          <motion.div
            animate={{
              scale: isFocused ? 1.01 : 1,
            }}
            transition={{ duration: 0.2 }}
          >
            {/* Password Input */}
            <input
              ref={ref}
              {...props}
              type={showPassword ? 'text' : 'password'}
              onFocus={(e) => {
                setIsFocused(true);
                props.onFocus?.(e);
              }}
              onBlur={(e) => {
                setIsFocused(false);
                props.onBlur?.(e);
              }}
              className={`bg-input text-foreground placeholder:text-muted-foreground w-full rounded-lg border px-4 py-3.5 pr-12 transition-all duration-200 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${
                hasError
                  ? 'border-destructive focus:border-destructive focus:ring-destructive/20 focus:ring-2'
                  : success
                    ? 'border-positive focus:border-positive focus:ring-positive/20 focus:ring-2'
                    : 'border-input focus:border-primary focus:ring-primary/20 focus:ring-2'
              } `}
              aria-invalid={hasError}
              aria-describedby={
                error
                  ? `${props.id || props.name}-error`
                  : helperText
                    ? `${props.id || props.name}-helper`
                    : undefined
              }
            />

            {/* Eye Toggle Button */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-muted-foreground hover:text-foreground focus:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transition-colors focus:outline-none"
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              tabIndex={-1}
            >
              <motion.div
                animate={{ rotate: showPassword ? 180 : 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </motion.div>
            </button>
          </motion.div>
        </div>

        {/* Error Message with shake animation */}
        {hasError && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0, x: [0, -10, 10, -10, 10, 0] }}
            transition={{
              opacity: { duration: 0.2 },
              y: { duration: 0.2 },
              x: { duration: 0.4, times: [0, 0.2, 0.4, 0.6, 0.8, 1] },
            }}
            id={`${props.id || props.name}-error`}
            className="text-destructive mt-2 text-sm"
            role="alert"
          >
            {error}
          </motion.p>
        )}

        {/* Helper Text */}
        {helperText && !hasError && (
          <p id={`${props.id || props.name}-helper`} className="text-muted-foreground mt-2 text-sm">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

FormPassword.displayName = 'FormPassword';
