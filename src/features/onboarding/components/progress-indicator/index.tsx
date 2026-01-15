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
  return (
    <div className={cn('w-full', className)}>
      {/* Steps */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isUpcoming = index > currentStep;

          return (
            <div key={step.id} className="flex flex-1 items-center">
              {/* Step Circle */}
              <div className="relative flex flex-col items-center">
                <motion.div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors',
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

                {/* Step Label (mobile: hidden, desktop: shown) */}
                <div className="absolute top-12 hidden flex-col items-center sm:flex">
                  <span
                    className={cn('text-sm font-medium', {
                      'text-foreground': isCurrent,
                      'text-muted-foreground': !isCurrent,
                    })}
                  >
                    {step.label}
                  </span>
                  {step.description && (
                    <span className="text-muted-foreground text-xs">{step.description}</span>
                  )}
                </div>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="relative mx-2 h-0.5 flex-1">
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

      {/* Mobile Step Label */}
      <div className="mt-4 text-center sm:hidden">
        <p className="text-foreground text-sm font-medium">{steps[currentStep]?.label}</p>
        {steps[currentStep]?.description && (
          <p className="text-muted-foreground text-xs">{steps[currentStep].description}</p>
        )}
      </div>
    </div>
  );
}
