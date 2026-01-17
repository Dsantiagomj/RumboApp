'use client';

import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, Upload, Home } from 'lucide-react';
import { useRouter } from 'next/navigation';

/**
 * Success Step Component
 *
 * Final step shown after successful import
 * Displays summary and next action buttons
 */

export interface SuccessStepProps {
  accountsCreated: number;
  transactionsCreated: number;
  onImportAnother?: () => void;
}

export function SuccessStep({
  accountsCreated,
  transactionsCreated,
  onImportAnother,
}: SuccessStepProps) {
  const router = useRouter();

  return (
    <div className="space-y-8">
      {/* Success animation */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          type: 'spring',
          stiffness: 200,
          damping: 20,
        }}
        className="flex justify-center"
      >
        <div className="bg-primary/10 relative flex h-24 w-24 items-center justify-center rounded-full">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-primary absolute inset-0 rounded-full opacity-20"
          />
          <CheckCircle className="text-primary relative h-12 w-12" strokeWidth={2.5} />
        </div>
      </motion.div>

      {/* Success message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center"
      >
        <h2 className="text-foreground text-2xl font-bold">¡Importación Exitosa!</h2>
        <p className="text-muted-foreground mx-auto mt-3 max-w-md">
          Tus cuentas y transacciones han sido importadas correctamente. Ya puedes empezar a
          gestionar tus finanzas.
        </p>
      </motion.div>

      {/* Summary cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid gap-4 sm:grid-cols-2"
      >
        <div className="border-primary/20 bg-primary/5 rounded-xl border p-6 text-center">
          <p className="text-primary text-4xl font-bold">{accountsCreated}</p>
          <p className="text-muted-foreground mt-2 text-sm font-medium">
            {accountsCreated === 1 ? 'Cuenta creada' : 'Cuentas creadas'}
          </p>
        </div>
        <div className="border-primary/20 bg-primary/5 rounded-xl border p-6 text-center">
          <p className="text-primary text-4xl font-bold">{transactionsCreated}</p>
          <p className="text-muted-foreground mt-2 text-sm font-medium">
            {transactionsCreated === 1 ? 'Transacción importada' : 'Transacciones importadas'}
          </p>
        </div>
      </motion.div>

      {/* Action buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="space-y-3"
      >
        <button
          onClick={() => router.push('/dashboard')}
          className="group from-primary relative w-full overflow-hidden rounded-xl bg-gradient-to-r to-purple-600 px-6 py-4 font-semibold text-white shadow-lg transition-all hover:shadow-xl"
        >
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          <span className="relative flex items-center justify-center gap-2">
            <Home className="h-5 w-5" />
            Ver mis cuentas
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </span>
        </button>

        {onImportAnother && (
          <button
            onClick={onImportAnother}
            className="hover:bg-accent border-border w-full rounded-xl border px-6 py-4 font-semibold transition-colors"
          >
            <span className="flex items-center justify-center gap-2">
              <Upload className="h-5 w-5" />
              Importar otro archivo
            </span>
          </button>
        )}
      </motion.div>

      {/* Additional info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="bg-accent/50 rounded-lg p-4"
      >
        <p className="text-muted-foreground text-center text-sm">
          💡 Tip: Puedes categorizar y editar tus transacciones en la vista de transacciones
        </p>
      </motion.div>
    </div>
  );
}
