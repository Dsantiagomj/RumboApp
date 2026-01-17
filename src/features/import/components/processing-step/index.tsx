'use client';

import { motion } from 'framer-motion';
import { Loader2, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import type { ImportJobStatus } from '@prisma/client';

/**
 * Processing Step Component
 *
 * Shows real-time progress of file processing
 * Displays status messages and progress bar
 */

interface ProcessingStepProps {
  fileName: string;
  status: ImportJobStatus;
  progress: number;
  error?: string | null;
  accountsCount?: number;
  transactionsCount?: number;
}

const STATUS_MESSAGES: Record<ImportJobStatus, string> = {
  PENDING: 'Iniciando proceso...',
  PROCESSING: 'Procesando archivo...',
  PARSING: 'Extrayendo transacciones...',
  CATEGORIZING: 'Categorizando transacciones con IA...',
  REVIEW: 'Listo para revisar',
  CONFIRMED: 'Importación completada',
  FAILED: 'Error en el proceso',
  CANCELLED: 'Importación cancelada',
};

export function ProcessingStep({
  fileName,
  status,
  progress,
  error,
  accountsCount = 0,
  transactionsCount = 0,
}: ProcessingStepProps) {
  const isProcessing =
    status === 'PENDING' ||
    status === 'PROCESSING' ||
    status === 'PARSING' ||
    status === 'CATEGORIZING';
  const isSuccess = status === 'REVIEW' || status === 'CONFIRMED';
  const isError = status === 'FAILED';

  return (
    <div className="space-y-8">
      {/* File info */}
      <div className="bg-accent/50 flex items-center gap-4 rounded-xl border p-4">
        <div className="bg-primary/10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full">
          <FileText className="text-primary h-6 w-6" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-foreground truncate font-medium">{fileName}</p>
          <p className="text-muted-foreground mt-0.5 text-sm">{STATUS_MESSAGES[status]}</p>
        </div>
        {isProcessing && <Loader2 className="text-primary h-5 w-5 shrink-0 animate-spin" />}
        {isSuccess && <CheckCircle className="text-primary h-5 w-5 shrink-0" />}
        {isError && <AlertCircle className="text-destructive h-5 w-5 shrink-0" />}
      </div>

      {/* Progress bar */}
      {isProcessing && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progreso</span>
            <span className="text-foreground font-medium">{progress}%</span>
          </div>
          <div className="bg-muted h-2 overflow-hidden rounded-full">
            <motion.div
              className="from-primary h-full bg-gradient-to-r to-purple-600"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>
      )}

      {/* Success results */}
      {isSuccess && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="border-primary/20 bg-primary/5 rounded-xl border p-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="text-primary h-6 w-6" />
              <h3 className="text-foreground text-lg font-semibold">¡Extracción exitosa!</h3>
            </div>
            <p className="text-muted-foreground mt-2">
              Hemos procesado tu extracto y encontrado las siguientes cuentas y transacciones:
            </p>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="bg-background rounded-lg p-4 text-center">
                <p className="text-primary text-3xl font-bold">{accountsCount}</p>
                <p className="text-muted-foreground mt-1 text-sm">
                  {accountsCount === 1 ? 'Cuenta' : 'Cuentas'}
                </p>
              </div>
              <div className="bg-background rounded-lg p-4 text-center">
                <p className="text-primary text-3xl font-bold">{transactionsCount}</p>
                <p className="text-muted-foreground mt-1 text-sm">
                  {transactionsCount === 1 ? 'Transacción' : 'Transacciones'}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Error message */}
      {isError && error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-destructive/50 bg-destructive/10 rounded-xl border p-6"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="text-destructive mt-0.5 h-6 w-6 shrink-0" />
            <div>
              <h3 className="text-destructive text-lg font-semibold">Error al procesar archivo</h3>
              <p className="text-destructive/90 mt-2 text-sm">{error}</p>
              <div className="mt-4 space-y-2">
                <p className="text-destructive/80 text-sm font-medium">Posibles soluciones:</p>
                <ul className="text-destructive/70 space-y-1 text-sm">
                  <li>• Verifica que el archivo sea un extracto bancario válido</li>
                  <li>• Asegúrate de que el archivo no esté corrupto</li>
                  <li>• Si el archivo está protegido, ingresa la contraseña correcta</li>
                  <li>• Intenta exportar nuevamente el extracto desde tu banco</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Processing stages */}
      {isProcessing && (
        <div className="space-y-3">
          <ProcessingStage
            label="Subiendo archivo"
            isActive={status === 'PENDING'}
            isComplete={progress > 10}
          />
          <ProcessingStage
            label="Procesando contenido"
            isActive={status === 'PROCESSING'}
            isComplete={progress > 40}
          />
          <ProcessingStage
            label="Extrayendo transacciones"
            isActive={status === 'PARSING'}
            isComplete={progress > 80}
          />
          <ProcessingStage
            label="Categorizando con IA"
            isActive={status === 'CATEGORIZING'}
            isComplete={progress >= 100}
          />
        </div>
      )}
    </div>
  );
}

function ProcessingStage({
  label,
  isActive,
  isComplete,
}: {
  label: string;
  isActive: boolean;
  isComplete: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
          isComplete
            ? 'bg-primary text-white'
            : isActive
              ? 'bg-primary/20 text-primary'
              : 'bg-muted text-muted-foreground'
        }`}
      >
        {isComplete ? (
          <CheckCircle className="h-4 w-4" />
        ) : isActive ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <div className="h-2 w-2 rounded-full bg-current" />
        )}
      </div>
      <p
        className={`text-sm ${
          isComplete || isActive ? 'text-foreground font-medium' : 'text-muted-foreground'
        }`}
      >
        {label}
      </p>
    </div>
  );
}
