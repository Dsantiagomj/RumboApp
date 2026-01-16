/**
 * Progress Indicator Component
 *
 * Visual indicator showing current step in onboarding flow
 */

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

import { cn } from '@/lib/utils';

export interface ProgressStep {
  id: string;
  label: string;
  description?: string;
}

export interface ProgressIndicatorProps {
  steps: ProgressStep[];
  currentStep: number;
  className?: string;
}

/**
 * ProgressIndicator
 *
 * @example
 * ```tsx
 * <ProgressIndicator
 *   steps={[
 *     { id: '1', label: 'Personal Info', description: 'Basic details' },
 *     { id: '2', label: 'Identity', description: 'Verify your identity' },
 *   ]}
 *   currentStep={0}
 * />
 * ```
 */
export function ProgressIndicator({ steps, currentStep, className }: ProgressIndicatorProps) {
  const percentage = Math.round(((currentStep + 1) / steps.length) * 100);

  return (
    <div className={cn('w-full', className)}>
      {/* Progress Header with Percentage */}
      <div className="mb-4 flex items-center justify-between">
        <span className="text-muted-foreground text-sm font-medium">
          Paso {currentStep + 1} de {steps.length}
        </span>
        <motion.span
          key={currentStep}
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-primary text-sm font-semibold"
        >
          {percentage}% completado
        </motion.span>
      </div>

      {/* Mobile: Linear Progress Bar */}
      <div className="mb-8 sm:hidden">
        <div className="bg-muted relative h-2 w-full overflow-hidden rounded-full">
          <motion.div
            className="bg-primary absolute inset-y-0 left-0"
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          />
        </div>

        {/* Step label */}
        <motion.p
          key={currentStep}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-foreground mt-3 text-center text-sm font-medium"
        >
          {steps[currentStep]?.label}
        </motion.p>
      </div>

      {/* Desktop: Steps with circles */}
      <div className="mb-12 hidden sm:block">
        <div className="flex items-start justify-center gap-6">
          {steps.map((step, index) => {
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;
            const isUpcoming = index > currentStep;

            return (
              <div key={step.id} className="flex flex-1 items-center gap-3">
                {/* Step Circle and Label Container */}
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <motion.div
                    className={cn(
                      'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                      {
                        'border-primary bg-primary text-white': isCompleted || isCurrent,
                        'border-border bg-background text-muted-foreground': isUpcoming,
                      }
                    )}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {isCompleted ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      >
                        <Check className="h-5 w-5" />
                      </motion.div>
                    ) : (
                      <span className="text-sm font-semibold">{index + 1}</span>
                    )}
                  </motion.div>

                  {/* Step Label - Inline with circle */}
                  <div className="flex min-w-0 flex-col">
                    <span
                      className={cn('truncate text-sm font-medium', {
                        'text-foreground': isCurrent,
                        'text-muted-foreground': !isCurrent,
                      })}
                    >
                      {step.label}
                    </span>
                    {step.description && (
                      <span className="text-muted-foreground truncate text-xs">
                        {step.description}
                      </span>
                    )}
                  </div>
                </div>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="relative mt-5 h-0.5 w-full max-w-[120px] flex-shrink-0">
                    <div className="bg-border absolute inset-0" />
                    <motion.div
                      className="bg-primary absolute inset-0 origin-left"
                      initial={{ scaleX: 0 }}
                      animate={{
                        scaleX: index < currentStep ? 1 : 0,
                      }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
