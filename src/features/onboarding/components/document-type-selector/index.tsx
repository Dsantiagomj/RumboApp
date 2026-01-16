'use client';

/**
 * Document Type Selector
 *
 * Visual card selector for document types (CC, CE, PASAPORTE)
 */

import { motion } from 'framer-motion';
import { CreditCard, Globe, Plane, Check } from 'lucide-react';

import { cn } from '@/lib/utils';

import type { DocumentType, DocumentTypeSelectorProps } from './types';

const documentTypeConfig = {
  CC: {
    label: 'Cédula de Ciudadanía',
    icon: CreditCard,
  },
  CE: {
    label: 'Cédula de Extranjería',
    icon: Globe,
  },
  PASAPORTE: {
    label: 'Pasaporte',
    icon: Plane,
  },
} as const;

/**
 * DocumentTypeSelector Component
 *
 * @example
 * ```tsx
 * <DocumentTypeSelector
 *   value={documentType}
 *   onChange={(type) => setValue('documentType', type)}
 *   disabled={isLoading}
 * />
 * ```
 */
export function DocumentTypeSelector({ value, onChange, disabled }: DocumentTypeSelectorProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {(Object.keys(documentTypeConfig) as DocumentType[]).map((type) => {
        const config = documentTypeConfig[type];
        const Icon = config.icon;
        const isSelected = value === type;

        return (
          <motion.button
            key={type}
            type="button"
            onClick={() => onChange(type)}
            disabled={disabled}
            whileHover={{ scale: disabled ? 1 : 1.02 }}
            whileTap={{ scale: disabled ? 1 : 0.98 }}
            className={cn(
              'border-border hover:border-primary/50 relative flex min-h-[100px] flex-col items-center justify-center gap-3 rounded-xl border-2 p-4 transition-all disabled:cursor-not-allowed disabled:opacity-50',
              isSelected && 'border-primary bg-primary/10'
            )}
          >
            {/* Icon */}
            <Icon
              className={cn('h-8 w-8', isSelected ? 'text-primary' : 'text-muted-foreground')}
            />

            {/* Label */}
            <span
              className={cn(
                'text-center text-sm font-medium',
                isSelected ? 'text-primary' : 'text-foreground'
              )}
            >
              {config.label}
            </span>

            {/* Checkmark when selected */}
            {isSelected && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="bg-primary absolute top-2 right-2 rounded-full p-1"
              >
                <Check className="h-3 w-3 text-white" />
              </motion.div>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
