'use client';

/**
 * Identity Verification Step
 *
 * Second step of onboarding: collect document type and number
 */

import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, ChevronDown, ArrowLeft, FileText } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useState } from 'react';

import { Spinner } from '@/components/ui/spinner';

import { DocumentTypeSelector } from '../document-type-selector';
import type { IdentityVerificationFormData } from '../../schemas/identity-verification-schema';
import { identityVerificationSchema } from '../../schemas/identity-verification-schema';

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
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<IdentityVerificationFormData>({
    resolver: zodResolver(identityVerificationSchema),
    defaultValues,
    mode: 'onChange',
  });

  const [showDetails, setShowDetails] = useState(false);
  const documentType = watch('documentType');
  const documentNumber = watch('documentNumber');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3 }}
      className="w-full space-y-8"
    >
      {/* Enhanced Header with Icon */}
      <div className="flex items-start gap-4">
        <motion.div
          className="bg-primary/10 rounded-2xl p-3"
          whileHover={{ scale: 1.05, rotate: 5 }}
        >
          <ShieldCheck className="text-primary h-6 w-6" />
        </motion.div>
        <div className="flex-1 space-y-1">
          <h2 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
            Confirmemos que eres tú
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">Último paso, lo prometo</p>
        </div>
      </div>

      {/* Expandable Info Banner */}
      <motion.div className="border-primary/20 bg-primary/5 rounded-xl border p-4">
        <button
          type="button"
          onClick={() => setShowDetails(!showDetails)}
          className="flex w-full items-center justify-between text-left"
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">💡</span>
            <span className="text-foreground text-sm font-medium">
              ¿Por qué necesitamos verificar tu identidad?
            </span>
          </div>
          <ChevronDown
            className={`text-primary h-4 w-4 transition-transform ${
              showDetails ? 'rotate-180' : ''
            }`}
          />
        </button>

        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="text-muted-foreground mt-3 text-sm"
            >
              Es un requisito legal colombiano (SARLAFT) que nos ayuda a:
              <ul className="mt-2 space-y-1 pl-5">
                <li>• Proteger tu cuenta contra fraudes</li>
                <li>• Cumplir regulaciones de la SFC</li>
                <li>• Garantizar operaciones seguras</li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Document Type Selector */}
        <div className="w-full">
          <label className="text-foreground mb-3 block text-sm font-medium">
            Tipo de Documento
            <span className="text-destructive ml-1">*</span>
          </label>
          <DocumentTypeSelector
            value={documentType}
            onChange={(type) => setValue('documentType', type, { shouldValidate: true })}
            disabled={isLoading}
          />
          {errors.documentType && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-destructive mt-2 text-sm"
              role="alert"
            >
              {errors.documentType.message}
            </motion.p>
          )}
        </div>

        {/* Document Number with Icon */}
        <div>
          <label
            htmlFor="documentNumber"
            className="text-foreground mb-2 block text-sm font-medium"
          >
            Número de Documento
            <span className="text-destructive ml-1">*</span>
          </label>

          <div className="relative">
            <FileText className="text-muted-foreground absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2" />
            <input
              {...register('documentNumber')}
              id="documentNumber"
              type="text"
              placeholder="Ej: 1234567890"
              disabled={isLoading}
              className="bg-input text-foreground placeholder:text-muted-foreground border-input focus:border-primary focus:ring-primary/20 w-full rounded-lg border py-4 pr-4 pl-12 transition-all focus:ring-2 focus:outline-none"
            />
          </div>

          {errors.documentNumber && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0, x: [0, -10, 10, -10, 10, 0] }}
              className="text-destructive mt-2 text-sm"
              role="alert"
            >
              {errors.documentNumber.message}
            </motion.p>
          )}

          {!errors.documentNumber && documentNumber && documentNumber.length > 0 && (
            <p className="text-muted-foreground mt-2 text-xs">
              Ingresa el número sin puntos ni espacios
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          {/* Back Button - Ghost style */}
          {onBack && (
            <motion.button
              type="button"
              onClick={onBack}
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="border-border hover:bg-accent flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-4 font-medium transition-all disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Atrás
            </motion.button>
          )}

          {/* Submit Button - Primary with gradient */}
          <motion.button
            type="submit"
            disabled={isLoading || !isValid}
            whileHover={{
              scale: isLoading ? 1 : 1.02,
              boxShadow: isLoading ? undefined : '0 10px 40px rgba(139, 92, 246, 0.3)',
            }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
            className="group from-primary relative flex-[2] overflow-hidden rounded-xl bg-gradient-to-r to-purple-600 px-6 py-4 font-semibold text-white shadow-lg transition-all hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

            <span className="relative flex items-center justify-center gap-2">
              {isLoading ? (
                <>
                  <Spinner size="sm" className="text-white" />
                  Verificando...
                </>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4" />
                  Listo, verificar mi cuenta
                </>
              )}
            </span>
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}
