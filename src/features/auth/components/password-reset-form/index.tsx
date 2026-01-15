'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useForm } from 'react-hook-form';

import type { PasswordResetFormData } from '../../schemas/password-reset-schema';
import { passwordResetSchema } from '../../schemas/password-reset-schema';
import { FormPassword } from '../form-password';

export interface PasswordResetFormProps {
  /**
   * Submit handler
   */
  onSubmit: (data: PasswordResetFormData) => void;

  /**
   * Loading state
   */
  isLoading?: boolean;

  /**
   * Success state (password reset)
   */
  isSuccess?: boolean;
}

/**
 * PasswordResetForm Component
 *
 * Form to set new password:
 * - Password + confirm password validation
 * - Password strength requirements
 * - Success message display
 *
 * @example
 * ```tsx
 * <PasswordResetForm
 *   onSubmit={(data) => resetPasswordMutation.mutate({ token, ...data })}
 *   isLoading={resetPasswordMutation.isPending}
 *   isSuccess={resetPasswordMutation.isSuccess}
 * />
 * ```
 */
export function PasswordResetForm({
  onSubmit,
  isLoading = false,
  isSuccess = false,
}: PasswordResetFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordResetFormData>({
    resolver: zodResolver(passwordResetSchema),
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
          Nueva contraseña
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-muted-foreground"
        >
          {isSuccess ? 'Tu contraseña ha sido restablecida' : 'Ingresa tu nueva contraseña'}
        </motion.p>
      </div>

      {isSuccess ? (
        /* Success Message */
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="border-positive/20 bg-positive/10 rounded-lg border p-4 text-center"
          >
            <p className="text-positive">
              Tu contraseña ha sido restablecida exitosamente. Ya puedes iniciar sesión con tu nueva
              contraseña.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <Link
              href="/login"
              className="bg-primary hover:bg-primary/90 focus:ring-primary/50 inline-flex w-full items-center justify-center rounded-lg px-4 py-3.5 font-medium text-white transition-all focus:ring-2 focus:outline-none"
            >
              Ir a iniciar sesión
            </Link>
          </motion.div>
        </div>
      ) : (
        /* Form */
        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >
          {/* Password Field */}
          <FormPassword
            {...register('password')}
            id="password"
            label="Nueva contraseña"
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

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-primary hover:bg-primary/90 focus:ring-primary/50 w-full rounded-lg px-4 py-3.5 font-medium text-white transition-all focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? 'Restableciendo...' : 'Restablecer contraseña'}
          </motion.button>
        </motion.form>
      )}

      {/* Back to Login Link */}
      {!isSuccess && (
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
      )}
    </motion.div>
  );
}
