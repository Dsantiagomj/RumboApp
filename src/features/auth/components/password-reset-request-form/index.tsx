'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useForm } from 'react-hook-form';

import { Spinner } from '@/components/ui/spinner';

import type { PasswordResetRequestFormData } from '../../schemas/password-reset-request-schema';
import { passwordResetRequestSchema } from '../../schemas/password-reset-request-schema';
import { FormInput } from '../form-input';

export interface PasswordResetRequestFormProps {
  /**
   * Submit handler
   */
  onSubmit: (data: PasswordResetRequestFormData) => void;

  /**
   * Loading state
   */
  isLoading?: boolean;

  /**
   * Success state (email sent)
   */
  isSuccess?: boolean;
}

/**
 * PasswordResetRequestForm Component
 *
 * Form to request password reset email:
 * - Email validation
 * - Success message display
 * - Back to login link
 *
 * @example
 * ```tsx
 * <PasswordResetRequestForm
 *   onSubmit={(data) => requestResetMutation.mutate(data)}
 *   isLoading={requestResetMutation.isPending}
 *   isSuccess={requestResetMutation.isSuccess}
 * />
 * ```
 */
export function PasswordResetRequestForm({
  onSubmit,
  isLoading = false,
  isSuccess = false,
}: PasswordResetRequestFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordResetRequestFormData>({
    resolver: zodResolver(passwordResetRequestSchema),
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
          Restablecer contraseña
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-muted-foreground"
        >
          {isSuccess
            ? 'Te hemos enviado un correo con las instrucciones'
            : 'Ingresa tu correo electrónico y te enviaremos instrucciones'}
        </motion.p>
      </div>

      {isSuccess ? (
        /* Success Message */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="border-positive/20 bg-positive/10 rounded-lg border p-4 text-center"
        >
          <p className="text-positive">
            Si existe una cuenta con ese correo, recibirás instrucciones para restablecer tu
            contraseña.
          </p>
        </motion.div>
      ) : (
        /* Form */
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

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
            className="bg-primary hover:bg-primary/90 focus:ring-primary/50 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-3.5 font-medium text-white transition-all focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading && <Spinner size="sm" />}
            {isLoading ? 'Enviando...' : 'Enviar instrucciones'}
          </motion.button>
        </motion.form>
      )}

      {/* Back to Login Link */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="text-center"
      >
        <Link
          href="/login"
          className="text-muted-foreground hover:text-primary text-sm hover:underline"
        >
          ← Volver a iniciar sesión
        </Link>
      </motion.div>
    </motion.div>
  );
}
