'use client';

/**
 * PasswordPromptModal Component
 *
 * Modal for prompting user to enter password for protected Excel files.
 * Shows conditional messaging based on whether user has Colombian ID configured.
 */

import { motion, AnimatePresence } from 'framer-motion';
import { Lock, AlertCircle, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Spinner } from '@/components/ui/spinner';

export interface PasswordPromptModalProps {
  /**
   * Whether the modal is open
   */
  isOpen: boolean;

  /**
   * Close handler
   */
  onClose: () => void;

  /**
   * Submit handler - should attempt to decrypt with provided password
   */
  onSubmit: (password: string) => Promise<void>;

  /**
   * Whether user has Colombian ID configured
   */
  userHasColombianId: boolean;

  /**
   * Name of the file being unlocked
   */
  fileName: string;
}

/**
 * PasswordPromptModal
 *
 * @example
 * ```tsx
 * <PasswordPromptModal
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   onSubmit={async (password) => await decryptFile(password)}
 *   userHasColombianId={true}
 *   fileName="datos.xlsx"
 * />
 * ```
 */
export function PasswordPromptModal({
  isOpen,
  onClose,
  onSubmit,
  userHasColombianId,
  fileName,
}: PasswordPromptModalProps) {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password.trim()) {
      setError('Por favor ingresa una contraseña');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit(password);
      // Success - modal will be closed by parent
      setPassword('');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudo desbloquear el archivo. Verifica la contraseña.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isSubmitting) return;
    setPassword('');
    setError(null);
    onClose();
  };

  const handleCompleteProfile = () => {
    router.push('/onboarding');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={handleClose}
        >
          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-background w-full max-w-md rounded-2xl shadow-2xl"
          >
            {/* Header */}
            <div className="border-border space-y-4 border-b px-6 py-5">
              <div className="flex items-start gap-4">
                <motion.div
                  className="bg-primary/10 rounded-xl p-3"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                >
                  <Lock className="text-primary h-6 w-6" />
                </motion.div>
                <div className="flex-1">
                  <h2 className="text-foreground text-xl font-bold">Archivo Protegido</h2>
                  <p className="text-muted-foreground mt-1 text-sm">{fileName}</p>
                </div>
              </div>

              {/* Conditional Banner/Message */}
              {!userHasColombianId ? (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-primary/10 border-primary/20 rounded-lg border p-4"
                >
                  <div className="mb-3 flex items-start gap-2">
                    <Lock className="text-primary mt-0.5 h-4 w-4 flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="text-primary text-sm font-semibold">Desbloqueo Automático</h3>
                      <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
                        Completa tu perfil con tu cédula y podremos desbloquear archivos protegidos
                        automáticamente
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleCompleteProfile}
                    className="bg-primary hover:bg-primary/90 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-colors"
                  >
                    Completar Perfil
                    <ExternalLink className="h-3.5 w-3.5" />
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-muted/50 rounded-lg p-3"
                >
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    Intentaremos con tu cédula primero. Si no funciona, podrás ingresar otra
                    contraseña.
                  </p>
                </motion.div>
              )}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5 px-6 py-5">
              {/* Password Input */}
              <div>
                <label
                  htmlFor="password"
                  className="text-foreground mb-2 block text-sm font-medium"
                >
                  Contraseña del archivo
                  <span className="text-destructive ml-1">*</span>
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError(null);
                  }}
                  disabled={isSubmitting}
                  placeholder="Ingresa la contraseña"
                  autoComplete="off"
                  autoFocus
                  className="bg-input text-foreground placeholder:text-muted-foreground border-input focus:border-primary focus:ring-primary/20 w-full rounded-lg border px-4 py-3 transition-all focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              {/* Error Message */}
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0, x: [0, -10, 10, -10, 10, 0] }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{
                      opacity: { duration: 0.2 },
                      y: { duration: 0.2 },
                      x: { duration: 0.4, times: [0, 0.2, 0.4, 0.6, 0.8, 1] },
                    }}
                    className="bg-destructive/10 border-destructive/20 flex items-start gap-2 rounded-lg border p-3"
                  >
                    <AlertCircle className="text-destructive mt-0.5 h-4 w-4 flex-shrink-0" />
                    <p className="text-destructive text-sm">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <motion.button
                  type="button"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                  className="border-input bg-background text-foreground hover:bg-muted flex-1 rounded-lg border px-4 py-3 font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancelar
                </motion.button>

                <motion.button
                  type="submit"
                  disabled={isSubmitting || !password.trim()}
                  whileHover={{
                    scale: isSubmitting || !password.trim() ? 1 : 1.02,
                    boxShadow:
                      isSubmitting || !password.trim()
                        ? undefined
                        : '0 10px 40px rgba(139, 92, 246, 0.3)',
                  }}
                  whileTap={{ scale: isSubmitting || !password.trim() ? 1 : 0.98 }}
                  className="group from-primary relative flex-1 overflow-hidden rounded-lg bg-gradient-to-r to-purple-600 px-4 py-3 font-semibold text-white shadow-lg transition-all hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
                >
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                  <span className="relative flex items-center justify-center gap-2">
                    {isSubmitting && <Spinner size="sm" className="text-white" />}
                    {isSubmitting ? 'Desbloqueando...' : 'Desbloquear'}
                  </span>
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
