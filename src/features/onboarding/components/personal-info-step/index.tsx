'use client';

/**
 * Personal Info Step
 *
 * First step of onboarding: collect date of birth and phone number
 */

import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Calendar, MessageCircle, ArrowRight, CheckCircle, Globe } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';

import { Spinner } from '@/components/ui/spinner';

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
    watch,
    formState: { errors, isValid },
  } = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues,
    mode: 'onChange',
  });

  const dateOfBirth = watch('dateOfBirth');
  const phoneNumber = watch('phoneNumber');
  const [isBirthdayMonth, setIsBirthdayMonth] = useState(false);

  useEffect(() => {
    if (dateOfBirth) {
      const birthMonth = new Date(dateOfBirth).getMonth();
      const currentMonth = new Date().getMonth();
      setIsBirthdayMonth(birthMonth === currentMonth);
    }
  }, [dateOfBirth]);

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
          <User className="text-primary h-6 w-6" />
        </motion.div>
        <div className="flex-1 space-y-1">
          <h2 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
            Información Personal
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            Solo necesitamos lo básico para empezar
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Date of Birth with Success Feedback */}
        <div>
          <label htmlFor="dateOfBirth" className="text-foreground mb-2 block text-sm font-medium">
            ¿Cuándo naciste?
            <span className="text-destructive ml-1">*</span>
          </label>
          <div className="relative flex items-center">
            <Calendar className="text-muted-foreground absolute left-4 h-4 w-4" />
            <input
              {...register('dateOfBirth')}
              id="dateOfBirth"
              type="date"
              disabled={isLoading}
              className="bg-input text-foreground placeholder:text-muted-foreground border-input focus:border-primary focus:ring-primary/20 w-full rounded-lg border py-4 pr-4 pl-12 transition-all focus:ring-2 focus:outline-none"
            />
          </div>
          {errors.dateOfBirth && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-destructive mt-2 text-sm"
              role="alert"
            >
              {errors.dateOfBirth.message}
            </motion.p>
          )}

          {/* Success feedback for valid age */}
          <AnimatePresence>
            {dateOfBirth && !errors.dateOfBirth && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-primary/10 border-primary/20 mt-3 flex items-center gap-2 rounded-lg border px-3 py-2.5"
              >
                <CheckCircle className="text-primary h-4 w-4" />
                <span className="text-primary text-sm">
                  {isBirthdayMonth
                    ? '¡Cumpleaños este mes! Cumples requisitos de edad'
                    : '¡Perfecto! Cumples con los requisitos de edad'}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Phone Number with Country Code */}
        <div>
          <label htmlFor="phoneNumber" className="text-foreground mb-2 block text-sm font-medium">
            ¿A qué número te podemos escribir?
            <span className="text-destructive ml-1">*</span>
          </label>

          <div className="relative">
            {/* Country Code Prefix */}
            <div className="absolute top-1/2 left-4 z-10 flex -translate-y-1/2 items-center gap-2">
              <Globe className="text-muted-foreground h-4 w-4" />
              <span className="text-foreground text-sm font-medium">+57</span>
              <div className="bg-border h-5 w-px" />
            </div>

            <input
              {...register('phoneNumber')}
              id="phoneNumber"
              type="tel"
              placeholder="300 123 4567"
              disabled={isLoading}
              autoComplete="tel"
              className="bg-input text-foreground placeholder:text-muted-foreground border-input focus:border-primary focus:ring-primary/20 w-full rounded-lg border py-4 pr-12 pl-24 transition-all focus:ring-2 focus:outline-none"
            />

            {/* WhatsApp indicator for valid mobile */}
            {phoneNumber?.length >= 10 && !errors.phoneNumber && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-1/2 right-4 -translate-y-1/2"
              >
                <MessageCircle className="h-5 w-5 text-green-600" />
              </motion.div>
            )}
          </div>

          {errors.phoneNumber && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0, x: [0, -10, 10, -10, 10, 0] }}
              className="text-destructive mt-2 text-sm"
              role="alert"
            >
              {errors.phoneNumber.message}
            </motion.p>
          )}

          {!errors.phoneNumber && (
            <p className="text-muted-foreground mt-2 text-xs">
              Lo usaremos para notificaciones importantes
            </p>
          )}
        </div>

        {/* Enhanced Submit Button */}
        <motion.button
          type="submit"
          disabled={isLoading || !isValid}
          whileHover={{
            scale: isLoading ? 1 : 1.02,
            boxShadow: isLoading ? undefined : '0 10px 40px rgba(139, 92, 246, 0.3)',
          }}
          whileTap={{ scale: isLoading ? 1 : 0.98 }}
          className="group from-primary relative mt-8 w-full cursor-pointer overflow-hidden rounded-xl bg-gradient-to-r to-purple-600 px-6 py-4 font-semibold text-white shadow-lg transition-all hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

          <span className="relative flex items-center justify-center gap-2">
            {isLoading ? (
              <>
                <Spinner size="sm" className="text-white" />
                Guardando...
              </>
            ) : (
              <>
                Continuar
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </span>
        </motion.button>
      </form>
    </motion.div>
  );
}
