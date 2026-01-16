'use client';

/**
 * Success Step
 *
 * Final step of onboarding: Success screen with completion checklist
 */

import { motion } from 'framer-motion';
import { CheckCircle, Shield, User, Sparkles, ArrowRight } from 'lucide-react';

import type { SuccessStepProps } from './types';

/**
 * SuccessStep Component
 *
 * @example
 * ```tsx
 * <SuccessStep
 *   userName="Santiago"
 *   onContinue={() => router.push('/dashboard')}
 * />
 * ```
 */
export function SuccessStep({ userName, onContinue }: SuccessStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3 }}
      className="w-full space-y-8 text-center"
    >
      {/* Animated Checkmark */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 20,
          delay: 0.2,
        }}
        className="mx-auto"
      >
        <div className="mx-auto rounded-full bg-green-500/10 p-6">
          <CheckCircle className="h-20 w-20 text-green-600" />
        </div>
      </motion.div>

      {/* Success Message */}
      <div className="space-y-3">
        <motion.h1
          className="text-foreground text-4xl font-bold tracking-tight sm:text-5xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {userName ? `¡Todo listo, ${userName}!` : '¡Todo listo!'} 🎉
        </motion.h1>
        <motion.p
          className="text-muted-foreground mx-auto max-w-md text-base leading-relaxed sm:text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          Tu cuenta ha sido verificada exitosamente. Estás listo para tomar control de tus finanzas.
        </motion.p>
      </div>

      {/* Completion Checklist */}
      <motion.div
        className="bg-card mx-auto max-w-md space-y-3 rounded-2xl border p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <motion.div
          className="flex items-center gap-3 text-left"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="rounded-lg bg-green-500/10 p-2">
            <Shield className="h-5 w-5 text-green-600" />
          </div>
          <span className="text-foreground text-sm font-medium">Cuenta verificada</span>
        </motion.div>
        <motion.div
          className="flex items-center gap-3 text-left"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="rounded-lg bg-green-500/10 p-2">
            <User className="h-5 w-5 text-green-600" />
          </div>
          <span className="text-foreground text-sm font-medium">Perfil completo</span>
        </motion.div>
        <motion.div
          className="flex items-center gap-3 text-left"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.9 }}
        >
          <div className="rounded-lg bg-green-500/10 p-2">
            <Sparkles className="h-5 w-5 text-green-600" />
          </div>
          <span className="text-foreground text-sm font-medium">Listo para empezar</span>
        </motion.div>
      </motion.div>

      {/* CTA Button */}
      <motion.button
        type="button"
        onClick={onContinue}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        whileHover={{
          scale: 1.02,
          boxShadow: '0 10px 40px rgba(16, 185, 129, 0.3)',
        }}
        whileTap={{ scale: 0.98 }}
        className="group relative mx-auto w-full max-w-md overflow-hidden rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-4 font-semibold text-white shadow-lg transition-all hover:shadow-xl"
      >
        {/* Shimmer effect */}
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

        <span className="relative flex items-center justify-center gap-2">
          Ir a mi Dashboard
          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
        </span>
      </motion.button>
    </motion.div>
  );
}
