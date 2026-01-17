'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { trpc } from '@/lib/trpc/react';
import { FileDropzone } from '../file-dropzone';
import { ProcessingStep } from '../processing-step';
import { AccountReviewStep, type AccountConfirmation } from '../account-review-step';
import { SuccessStep } from '../success-step';
import { toast } from 'sonner';

/**
 * Import Wizard Component
 *
 * Multi-step wizard for importing bank statements
 * Steps: Upload → Processing → Review → Success
 */

type WizardStep = 'upload' | 'processing' | 'review' | 'success';

export function ImportWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<WizardStep>('upload');
  const [jobId, setJobId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [accountConfirmations, setAccountConfirmations] = useState<AccountConfirmation[]>([]);

  // Poll import job status
  const { data: jobStatus } = trpc.import.getStatus.useQuery(
    { jobId: jobId! },
    {
      enabled: !!jobId && currentStep === 'processing',
      refetchInterval: (query) => {
        // Stop polling if job is complete or failed
        if (!query.state.data) return false;
        const status = query.state.data.status;
        if (
          status === 'REVIEW' ||
          status === 'CONFIRMED' ||
          status === 'FAILED' ||
          status === 'CANCELLED'
        ) {
          return false;
        }
        return 2000; // Poll every 2 seconds while processing
      },
    }
  );

  // Confirm import mutation
  const confirmImport = trpc.import.confirmImport.useMutation({
    onSuccess: (data) => {
      toast.success(
        `¡Importación exitosa! ${data.accountsCreated} cuentas y ${data.transactionsCreated} transacciones creadas.`
      );
      setCurrentStep('success');
    },
    onError: (error) => {
      toast.error(`Error al confirmar importación: ${error.message}`);
    },
  });

  // Handle file upload
  const handleFileSelected = async (file: File) => {
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/import/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al subir archivo');
      }

      const result = await response.json();
      setJobId(result.jobId);
      setCurrentStep('processing');
      toast.success('Archivo subido correctamente. Procesando...');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al subir archivo');
    } finally {
      setIsUploading(false);
    }
  };

  // Handle account confirmations change
  const handleConfirmationsChange = (confirmations: AccountConfirmation[]) => {
    setAccountConfirmations(confirmations);
  };

  // Handle confirm import
  const handleConfirmImport = async () => {
    if (!jobId) return;

    const confirmedAccounts = accountConfirmations.filter((c) => c.confirmed);
    if (confirmedAccounts.length === 0) {
      toast.error('Debes seleccionar al menos una cuenta para importar');
      return;
    }

    await confirmImport.mutateAsync({
      jobId,
      accountConfirmations: confirmedAccounts,
    });
  };

  // Handle import another file
  const handleImportAnother = () => {
    setJobId(null);
    setCurrentStep('upload');
    setAccountConfirmations([]);
  };

  // Auto-advance to review step when job is ready
  useEffect(() => {
    if (jobStatus?.status === 'REVIEW' && currentStep === 'processing') {
      setCurrentStep('review');
      toast.success('¡Archivo procesado! Revisa las cuentas importadas.');
    }
  }, [jobStatus?.status, currentStep]);

  // Handle processing errors
  useEffect(() => {
    if (jobStatus?.status === 'FAILED' && currentStep === 'processing') {
      toast.error(`Error al procesar archivo: ${jobStatus.error || 'Error desconocido'}`);
      // Stay on processing step to show error
    }
  }, [jobStatus?.status, jobStatus?.error, currentStep]);

  const canGoBack = currentStep === 'review' && !confirmImport.isPending;
  const canClose = currentStep !== 'processing' && !isUploading && !confirmImport.isPending;

  return (
    <div className="mx-auto max-w-4xl">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {canGoBack && (
            <button
              onClick={() => setCurrentStep('processing')}
              className="text-muted-foreground hover:text-foreground hover:bg-accent flex items-center gap-2 rounded-lg p-2 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}
          <div>
            <h1 className="text-foreground text-3xl font-bold">Importar Extracto</h1>
            <p className="text-muted-foreground mt-1">
              {currentStep === 'upload' && 'Sube tu extracto bancario en CSV o PDF'}
              {currentStep === 'processing' && 'Procesando tu extracto...'}
              {currentStep === 'review' && 'Revisa y confirma las cuentas importadas'}
              {currentStep === 'success' && 'Importación completada'}
            </p>
          </div>
        </div>
        {canClose && (
          <button
            onClick={() => router.push('/dashboard')}
            className="text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg p-2 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        )}
      </div>

      {/* Progress indicator */}
      {currentStep !== 'success' && (
        <div className="mb-8 flex items-center justify-center gap-2">
          {['upload', 'processing', 'review'].map((step, index) => {
            const stepIndex = ['upload', 'processing', 'review'].indexOf(currentStep);
            const isActive = step === currentStep;
            const isCompleted = index < stepIndex;

            return (
              <div key={step} className="flex items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-all ${
                    isCompleted
                      ? 'bg-primary text-white'
                      : isActive
                        ? 'bg-primary/20 text-primary'
                        : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {index + 1}
                </div>
                {index < 2 && (
                  <div
                    className={`mx-2 h-0.5 w-12 transition-all ${
                      isCompleted ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Step content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {currentStep === 'upload' && (
            <FileDropzone onFileSelected={handleFileSelected} isUploading={isUploading} />
          )}

          {currentStep === 'processing' && jobStatus && (
            <ProcessingStep
              fileName={jobStatus.fileName}
              status={jobStatus.status}
              progress={jobStatus.progress}
              error={jobStatus.error}
              accountsCount={jobStatus.accountsCount}
              transactionsCount={jobStatus.transactionsCount}
            />
          )}

          {currentStep === 'review' && jobStatus && (
            <div className="space-y-6">
              <AccountReviewStep
                accounts={jobStatus.accounts}
                onConfirmationsChange={handleConfirmationsChange}
              />

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setCurrentStep('processing')}
                  disabled={confirmImport.isPending}
                  className="hover:bg-accent border-border rounded-xl border px-6 py-3 font-semibold transition-colors disabled:opacity-50"
                >
                  Atrás
                </button>
                <button
                  onClick={handleConfirmImport}
                  disabled={
                    confirmImport.isPending ||
                    accountConfirmations.filter((c) => c.confirmed).length === 0
                  }
                  className="from-primary group relative overflow-hidden rounded-xl bg-gradient-to-r to-purple-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:shadow-xl disabled:opacity-50"
                >
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                  <span className="relative">
                    {confirmImport.isPending ? 'Confirmando...' : 'Confirmar Importación'}
                  </span>
                </button>
              </div>
            </div>
          )}

          {currentStep === 'success' && confirmImport.data && (
            <SuccessStep
              accountsCreated={confirmImport.data.accountsCreated}
              transactionsCreated={confirmImport.data.transactionsCreated}
              onImportAnother={handleImportAnother}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
