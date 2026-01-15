'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useForm } from 'react-hook-form';

import { Spinner } from '@/components/ui/spinner';

import type { LoginFormData } from '../../schemas/login-schema';
import { loginSchema } from '../../schemas/login-schema';
import { FormInput } from '../form-input';
import { FormPassword } from '../form-password';
import { SocialAuthButtons } from '../social-auth-buttons';

export interface LoginFormProps {
  /**
   * Submit handler
   */
  onSubmit: (data: LoginFormData) => void;

  /**
   * Google OAuth handler
   */
  onGoogleClick?: () => void;

  /**
   * Apple OAuth handler
   */
  onAppleClick?: () => void;

  /**
   * Loading state
   */
  isLoading?: boolean;

  /**
   * Error message to display
   */
  error?: string | null;
}

/**
 * LoginForm Component
 *
 * Animated login form with:
 * - Email + password validation
 * - Social auth (Google + Apple)
 * - Stagger mount animation
 * - Loading states
 * - Error handling
 *
 * @example
 * ```tsx
 * <LoginForm
 *   onSubmit={(data) => loginMutation.mutate(data)}
 *   isLoading={loginMutation.isPending}
 * />
 * ```
 */
export function LoginForm({
  onSubmit,
  onGoogleClick,
  onAppleClick,
  isLoading = false,
  error = null,
}: LoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full space-y-6"
    >
      {/* Mobile Logo - Only visible on mobile */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, duration: 0.5 }}
        className="mb-8 text-center lg:hidden"
      >
        <h1 className="text-foreground text-4xl font-bold">Rumbo</h1>
      </motion.div>

      {/* Header */}
      <div className="space-y-2 text-center">
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="text-foreground text-3xl font-bold"
        >
          Iniciar sesión
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-muted-foreground"
        >
          ¿No tienes cuenta?{' '}
          <Link href="/register" className="text-primary hover:underline">
            Regístrate
          </Link>
        </motion.p>
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-destructive/10 text-destructive border-destructive/20 rounded-lg border p-3 text-sm"
        >
          {error}
        </motion.div>
      )}

      {/* Form */}
      <motion.form
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
      >
        {/* Email Field */}
        <FormInput
          {...register('email')}
          id="email"
          type="email"
          label="Correo electrónico"
          placeholder="tu@email.com"
          error={errors.email?.message}
          disabled={isLoading}
          autoComplete="email"
          showRequired
        />

        {/* Password Field */}
        <FormPassword
          {...register('password')}
          id="password"
          label="Contraseña"
          placeholder="••••••••"
          error={errors.password?.message}
          disabled={isLoading}
          autoComplete="current-password"
          showRequired
        />

        {/* Forgot Password Link */}
        <div className="text-right">
          <Link href="/reset-password" className="text-primary text-sm hover:underline">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={isLoading}
          whileHover={{ scale: isLoading ? 1 : 1.02 }}
          whileTap={{ scale: isLoading ? 1 : 0.98 }}
          className="bg-primary hover:bg-primary/90 focus:ring-primary/50 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-3.5 font-medium text-white transition-all focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading && <Spinner size="sm" />}
          {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
        </motion.button>
      </motion.form>

      {/* Divider */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="relative"
      >
        <div className="absolute inset-0 flex items-center">
          <div className="border-border w-full border-t" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-background text-muted-foreground px-4">O continúa con</span>
        </div>
      </motion.div>

      {/* Social Auth Buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <SocialAuthButtons
          onGoogleClick={onGoogleClick}
          onAppleClick={onAppleClick}
          isLoading={isLoading}
        />
      </motion.div>
    </motion.div>
  );
}
