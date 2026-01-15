'use client';

/**
 * Personal Info Step
 *
 * First step of onboarding: collect date of birth and phone number
 */

import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';

import { Spinner } from '@/components/ui/spinner';
import { FormInput } from '@/features/auth/components/form-input';

import type { PersonalInfoFormData } from '../../schemas/personal-info-schema';
import { personalInfoSchema } from '../../schemas/personal-info-schema';

export interface PersonalInfoStepProps {
  onSubmit: (data: PersonalInfoFormData) => void;
  isLoading?: boolean;
  defaultValues?: Partial<PersonalInfoFormData>;
}

/**
 * PersonalInfoStep Component
 *
 * @example
 * ```tsx
 * <PersonalInfoStep
 *   onSubmit={(data) => console.log(data)}
 *   isLoading={false}
 * />
 * ```
 */
export function PersonalInfoStep({
  onSubmit,
  isLoading = false,
  defaultValues,
}: PersonalInfoStepProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
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
        <h2 className="text-foreground text-2xl font-bold">Información Personal</h2>
        <p className="text-muted-foreground">Cuéntanos un poco más sobre ti</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Date of Birth */}
        <FormInput
          {...register('dateOfBirth')}
          id="dateOfBirth"
          type="date"
          label="Fecha de Nacimiento"
          error={errors.dateOfBirth?.message}
          disabled={isLoading}
          showRequired
          helperText="Debes ser mayor de 18 años"
        />

        {/* Phone Number */}
        <FormInput
          {...register('phoneNumber')}
          id="phoneNumber"
          type="tel"
          label="Número de Teléfono"
          placeholder="+57 300 123 4567"
          error={errors.phoneNumber?.message}
          disabled={isLoading}
          autoComplete="tel"
          showRequired
          helperText="Incluye el código de país (ej: +57)"
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
          {isLoading ? 'Guardando...' : 'Continuar'}
        </motion.button>
      </form>
    </motion.div>
  );
}
