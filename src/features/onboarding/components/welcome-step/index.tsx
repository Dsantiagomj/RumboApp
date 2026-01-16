'use client';

/**
 * Welcome Step
 *
 * First step of onboarding: Welcome screen with value props
 */

import { motion } from 'framer-motion';
import { Wallet, Shield, Clock, ArrowRight } from 'lucide-react';

import type { WelcomeStepProps } from './types';

/**
 * WelcomeStep Component
 *
 * @example
 * ```tsx
 * <WelcomeStep onStart={() => console.log('Starting onboarding')} />
 * ```
 */
export function WelcomeStep({ onStart }: WelcomeStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3 }}
      className="w-full space-y-8 text-center"
    >
      {/* Hero Icon */}
      <motion.div
        className="bg-primary/10 mx-auto rounded-3xl p-8"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
      >
        <Wallet className="text-primary mx-auto h-20 w-20" />
      </motion.div>

      {/* Welcome Message */}
      <div className="space-y-3">
        <motion.h1
          className="text-foreground text-4xl font-bold tracking-tight sm:text-5xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          ¡Bienvenido a Rumbo! 🇨🇴
        </motion.h1>
        <motion.p
          className="text-muted-foreground mx-auto max-w-md text-base leading-relaxed sm:text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          Tu asistente financiero personal que te ayuda a alcanzar tus metas
        </motion.p>
      </div>

      {/* Value Props */}
      <motion.div
        className="bg-card mx-auto max-w-md space-y-3 rounded-2xl border p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center gap-3 text-left">
          <div className="bg-primary/10 rounded-lg p-2">
            <Shield className="text-primary h-5 w-5" />
          </div>
          <span className="text-foreground text-sm font-medium">100% seguro y privado</span>
        </div>
        <div className="flex items-center gap-3 text-left">
          <div className="bg-primary/10 rounded-lg p-2">
            <Wallet className="text-primary h-5 w-5" />
          </div>
          <span className="text-foreground text-sm font-medium">Sin costos ocultos</span>
        </div>
        <div className="flex items-center gap-3 text-left">
          <div className="bg-primary/10 rounded-lg p-2">
            <Clock className="text-primary h-5 w-5" />
          </div>
          <span className="text-foreground text-sm font-medium">Configuración: 2 minutos</span>
        </div>
      </motion.div>

      {/* CTA Button */}
      <motion.button
        type="button"
        onClick={onStart}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        whileHover={{
          scale: 1.02,
          boxShadow: '0 10px 40px rgba(139, 92, 246, 0.3)',
        }}
        whileTap={{ scale: 0.98 }}
        className="group from-primary relative mx-auto w-full max-w-md overflow-hidden rounded-xl bg-gradient-to-r to-purple-600 px-8 py-4 font-semibold text-white shadow-lg transition-all hover:shadow-xl"
      >
        {/* Shimmer effect */}
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

        <span className="relative flex items-center justify-center gap-2">
          Empezar mi viaje financiero
          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
        </span>
      </motion.button>
    </motion.div>
  );
}
