'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useForm } from 'react-hook-form';

import { Spinner } from '@/components/ui/spinner';

import type { RegisterFormData } from '../../schemas/register-schema';
import { registerSchema } from '../../schemas/register-schema';
import { FormCheckbox } from '../form-checkbox';
import { FormInput } from '../form-input';
import { FormPassword } from '../form-password';
import { SocialAuthButtons } from '../social-auth-buttons';

export interface RegisterFormProps {
  /**
   * Submit handler
   */
  onSubmit: (data: RegisterFormData) => void;

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
}

/**
 * RegisterForm Component
 *
 * Animated registration form with:
 * - Two-column name layout (desktop)
 * - Email + password validation
 * - Terms acceptance checkbox
 * - Social auth (Google + Apple)
 * - Stagger mount animation
 *
 * @example
 * ```tsx
 * <RegisterForm
 *   onSubmit={(data) => registerMutation.mutate(data)}
 *   isLoading={registerMutation.isPending}
 * />
 * ```
 */
export function RegisterForm({
  onSubmit,
  onGoogleClick,
  onAppleClick,
  isLoading = false,
}: RegisterFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      terms: false,
    },
  });

  const termsAccepted = watch('terms');

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
          Crear una cuenta
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-muted-foreground"
        >
          ¿Ya tienes cuenta?{' '}
          <Link href="/login" className="text-primary hover:underline">
            Inicia sesión
          </Link>
        </motion.p>
      </div>

      {/* Form */}
      <motion.form
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
      >
        {/* Name Fields - Two columns */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormInput
            {...register('firstName')}
            id="firstName"
            type="text"
            label="Nombre"
            placeholder="Juan"
            error={errors.firstName?.message}
            disabled={isLoading}
            autoComplete="given-name"
            showRequired
          />

          <FormInput
            {...register('lastName')}
            id="lastName"
            type="text"
            label="Apellido"
            placeholder="Pérez"
            error={errors.lastName?.message}
            disabled={isLoading}
            autoComplete="family-name"
            showRequired
          />
        </div>

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
          autoComplete="new-password"
          helperText="Mínimo 8 caracteres, una mayúscula, una minúscula y un número"
          showRequired
        />

        {/* Confirm Password Field */}
        <FormPassword
          {...register('confirmPassword')}
          id="confirmPassword"
          label="Confirmar contraseña"
          placeholder="••••••••"
          error={errors.confirmPassword?.message}
          disabled={isLoading}
          autoComplete="new-password"
          showRequired
        />

        {/* Terms Checkbox */}
        <FormCheckbox
          {...register('terms')}
          id="terms"
          checked={termsAccepted}
          error={errors.terms?.message}
          disabled={isLoading}
          label={
            <>
              Acepto los{' '}
              <Link href="/terms" className="text-primary hover:underline" target="_blank">
                Términos y Condiciones
              </Link>
            </>
          }
        />

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={isLoading}
          whileHover={{ scale: isLoading ? 1 : 1.02 }}
          whileTap={{ scale: isLoading ? 1 : 0.98 }}
          className="bg-primary hover:bg-primary/90 focus:ring-primary/50 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3.5 font-medium text-white transition-all focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading && <Spinner size="sm" />}
          {isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
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
          <span className="bg-background text-muted-foreground px-4">O regístrate con</span>
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
