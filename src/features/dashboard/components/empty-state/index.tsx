'use client';

import { motion } from 'framer-motion';
import { Camera, PenSquare, Wallet, Lock, Zap, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

/**
 * Dashboard Empty State
 *
 * Shown when user has no financial accounts
 * Guides users to create their first account via:
 * 1. Photo scan (primary, mobile-first)
 * 2. Manual entry (secondary)
 */
export function DashboardEmptyState() {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="flex min-h-[600px] flex-col items-center justify-center px-4 py-12"
    >
      <div className="w-full max-w-md space-y-8">
        {/* Hero Section */}
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="bg-primary/10 mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full"
          >
            <Wallet className="text-primary h-10 w-10" />
          </motion.div>

          <h2 className="text-foreground text-2xl font-bold sm:text-3xl">
            Comienza a organizar tus finanzas
          </h2>
          <p className="text-muted-foreground mt-3 text-base sm:text-lg">
            Crea tu primera cuenta para ver el panorama completo de tu dinero
          </p>
        </div>

        {/* Primary CTA - Photo Upload (Mobile-First) */}
        <motion.button
          type="button"
          onClick={() => router.push('/import')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="group from-primary relative w-full overflow-hidden rounded-xl bg-gradient-to-r to-purple-600 px-6 py-6 shadow-lg transition-all hover:shadow-xl"
        >
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          <div className="relative flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
              <Camera className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1 text-left">
              <div className="text-lg font-semibold text-white">Escanear Extracto Bancario</div>
              <div className="text-sm text-white/80">
                IA extrae tus transacciones automáticamente
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-white transition-transform group-hover:translate-x-1" />
          </div>
        </motion.button>

        {/* Secondary CTA - Manual Entry */}
        <motion.button
          type="button"
          onClick={() => router.push('/accounts/create')}
          whileHover={{ scale: 1.01 }}
          className="border-border hover:border-primary/50 hover:bg-accent/50 w-full rounded-xl border-2 bg-transparent px-6 py-5 transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full">
              <PenSquare className="text-muted-foreground h-5 w-5" />
            </div>
            <div className="flex-1 text-left">
              <div className="text-foreground font-medium">Crear Manualmente</div>
              <div className="text-muted-foreground text-sm">
                Completa el formulario paso a paso
              </div>
            </div>
          </div>
        </motion.button>

        {/* Trust Badges for Colombian Users */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 rounded-full p-2">
              <Lock className="text-primary h-4 w-4" />
            </div>
            <span className="text-muted-foreground text-sm">100% seguro y privado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 rounded-full p-2">
              <Zap className="text-primary h-4 w-4" />
            </div>
            <span className="text-muted-foreground text-sm">Configuración en 2 minutos</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
