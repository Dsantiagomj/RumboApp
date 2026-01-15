'use client';

/**
 * Identity Verification Step
 *
 * Second step of onboarding: collect document type and number
 */

import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';

import { Spinner } from '@/components/ui/spinner';
import { FormInput } from '@/features/auth/components/form-input';

import type { IdentityVerificationFormData } from '../../schemas/identity-verification-schema';
import {
  documentTypeLabels,
  documentTypes,
  identityVerificationSchema,
} from '../../schemas/identity-verification-schema';

export interface IdentityVerificationStepProps {
  onSubmit: (data: IdentityVerificationFormData) => void;
  onBack?: () => void;
  isLoading?: boolean;
  defaultValues?: Partial<IdentityVerificationFormData>;
}

/**
 * IdentityVerificationStep Component
 *
 * @example
 * ```tsx
 * <IdentityVerificationStep
 *   onSubmit={(data) => console.log(data)}
 *   onBack={() => console.log('back')}
 *   isLoading={false}
 * />
 * ```
 */
export function IdentityVerificationStep({
  onSubmit,
  onBack,
  isLoading = false,
  defaultValues,
}: IdentityVerificationStepProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IdentityVerificationFormData>({
    resolver: zodResolver(identityVerificationSchema),
    defaultValues,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full space-y-6"
    >
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-foreground text-2xl font-bold">Verificación de Identidad</h2>
        <p className="text-muted-foreground">
          Verifica tu identidad para cumplir con regulaciones financieras
        </p>
      </div>

      {/* Info Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="border-primary/20 bg-primary/10 rounded-lg border p-4"
      >
        <p className="text-primary text-sm">
          <strong>¿Por qué necesitamos esto?</strong>
          <br />
          Para cumplir con regulaciones financieras y proteger tu cuenta de fraude.
        </p>
      </motion.div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Document Type */}
        <div className="w-full">
          <label htmlFor="documentType" className="text-foreground mb-2 block text-sm font-medium">
            Tipo de Documento
            <span className="text-destructive ml-1">*</span>
          </label>
          <select
            {...register('documentType')}
            id="documentType"
            disabled={isLoading}
            className="bg-input text-foreground border-input focus:border-primary focus:ring-primary/20 w-full rounded-lg border px-4 py-3.5 transition-all focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Selecciona un tipo</option>
            {documentTypes.map((type) => (
              <option key={type} value={type}>
                {documentTypeLabels[type]}
              </option>
            ))}
          </select>
          {errors.documentType && (
            <p className="text-destructive mt-2 text-sm" role="alert">
              {errors.documentType.message}
            </p>
          )}
        </div>

        {/* Document Number */}
        <FormInput
          {...register('documentNumber')}
          id="documentNumber"
          type="text"
          label="Número de Documento"
          placeholder="Ej: 1234567890"
          error={errors.documentNumber?.message}
          disabled={isLoading}
          showRequired
          helperText="Ingresa el número sin puntos ni espacios"
        />

        {/* Action Buttons */}
        <div className="flex gap-3">
          {/* Back Button */}
          {onBack && (
            <motion.button
              type="button"
              onClick={onBack}
              disabled={isLoading}
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
              className="border-border text-foreground hover:bg-input flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border px-4 py-3.5 font-medium transition-all focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              Atrás
            </motion.button>
          )}

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
            className="bg-primary hover:bg-primary/90 focus:ring-primary/50 flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-3.5 font-medium text-white transition-all focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading && <Spinner size="sm" />}
            {isLoading ? 'Guardando...' : 'Completar Verificación'}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}
