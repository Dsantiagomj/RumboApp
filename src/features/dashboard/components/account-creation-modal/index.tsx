'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Camera, PenSquare, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface AccountCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Account Creation Method Selection Modal
 *
 * Bottom sheet on mobile, centered modal on desktop
 * Allows users to choose between:
 * 1. Photo scan (recommended)
 * 2. Manual entry
 */
export function AccountCreationModal({ isOpen, onClose }: AccountCreationModalProps) {
  const router = useRouter();

  const handleMethodSelect = (path: string) => {
    onClose();
    router.push(path);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/50"
          />

          {/* Modal/Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="bg-background fixed inset-x-0 bottom-0 z-50 rounded-t-2xl sm:top-1/2 sm:left-1/2 sm:max-w-md sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl"
          >
            {/* Header */}
            <div className="border-border flex items-center justify-between border-b px-6 py-4">
              <h2 className="text-foreground text-lg font-semibold">
                ¿Cómo quieres agregar tu cuenta?
              </h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar modal"
                className="text-muted-foreground hover:text-foreground rounded-full p-1 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Method Cards */}
            <div className="space-y-3 p-6">
              {/* Photo Scan Method */}
              <motion.button
                type="button"
                onClick={() => handleMethodSelect('/import')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group border-primary bg-primary/5 hover:border-primary hover:bg-primary/10 relative w-full overflow-hidden rounded-xl border-2 p-5 text-left transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-primary/20 flex h-12 w-12 shrink-0 items-center justify-center rounded-full">
                    <Camera className="text-primary h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-foreground text-base font-semibold">Escanear Extracto</h3>
                      <span className="bg-primary/20 text-primary rounded-full px-2 py-0.5 text-xs font-medium">
                        Recomendado
                      </span>
                    </div>
                    <p className="text-muted-foreground mt-1 text-sm">
                      Toma una foto de tu extracto bancario y nuestra IA extrae las transacciones
                      automáticamente
                    </p>
                  </div>
                </div>
              </motion.button>

              {/* Manual Entry Method */}
              <motion.button
                type="button"
                onClick={() => handleMethodSelect('/accounts/create')}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="border-border hover:border-primary/50 hover:bg-accent/50 group w-full rounded-xl border-2 p-5 text-left transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-muted flex h-12 w-12 shrink-0 items-center justify-center rounded-full">
                    <PenSquare className="text-muted-foreground h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-foreground text-base font-semibold">Crear Manualmente</h3>
                    <p className="text-muted-foreground mt-1 text-sm">
                      Completa el formulario paso a paso con los datos de tu cuenta
                    </p>
                  </div>
                </div>
              </motion.button>
            </div>

            {/* Cancel Button (Mobile) */}
            <div className="border-border border-t p-4 sm:hidden">
              <button
                type="button"
                onClick={onClose}
                className="hover:bg-accent w-full rounded-lg py-3 font-medium transition-colors"
              >
                Cancelar
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
