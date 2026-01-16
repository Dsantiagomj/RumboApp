'use client';

/**
 * Account Type Selector
 *
 * Visual card selector for account types with animated interactions
 */

import { motion } from 'framer-motion';
import {
  PiggyBank,
  Building,
  CreditCard,
  TrendingUp,
  DollarSign,
  Wallet,
  Check,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

import type { AccountType, AccountTypeSelectorProps } from './types';

interface AccountTypeConfig {
  labelEs: string;
  description: string;
  icon: LucideIcon;
  color: string;
}

const accountTypeConfig: Record<AccountType, AccountTypeConfig> = {
  SAVINGS: {
    labelEs: 'Ahorros',
    description: 'Cuenta de ahorros',
    icon: PiggyBank,
    color: 'text-green-500',
  },
  CHECKING: {
    labelEs: 'Corriente',
    description: 'Cuenta corriente',
    icon: Building,
    color: 'text-blue-500',
  },
  CREDIT_CARD: {
    labelEs: 'Tarjeta de Crédito',
    description: 'Tarjeta de crédito',
    icon: CreditCard,
    color: 'text-purple-500',
  },
  LOAN: {
    labelEs: 'Préstamo',
    description: 'Préstamo',
    icon: TrendingUp,
    color: 'text-orange-500',
  },
  CASH: {
    labelEs: 'Efectivo',
    description: 'Dinero en efectivo',
    icon: DollarSign,
    color: 'text-emerald-500',
  },
  INVESTMENT: {
    labelEs: 'Inversión',
    description: 'Cuenta de inversión',
    icon: Wallet,
    color: 'text-indigo-500',
  },
  OTHER: {
    labelEs: 'Otro',
    description: 'Otro tipo de cuenta',
    icon: Wallet,
    color: 'text-gray-500',
  },
} as const;

// Only show these 6 account types
const displayedAccountTypes: AccountType[] = [
  'SAVINGS',
  'CHECKING',
  'CREDIT_CARD',
  'LOAN',
  'CASH',
  'INVESTMENT',
];

/**
 * AccountTypeSelector Component
 *
 * @example
 * ```tsx
 * <AccountTypeSelector
 *   value={accountType}
 *   onChange={(type) => setAccountType(type)}
 * />
 * ```
 */
export function AccountTypeSelector({ value, onChange }: AccountTypeSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {displayedAccountTypes.map((type) => {
        const config = accountTypeConfig[type];
        const Icon = config.icon;
        const isSelected = value === type;

        return (
          <motion.button
            key={type}
            type="button"
            onClick={() => onChange(type)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              'border-border hover:border-primary/50 relative flex min-h-[120px] flex-col items-center justify-center gap-2 rounded-xl border-2 p-4 transition-all',
              isSelected && 'border-primary bg-primary/10'
            )}
          >
            {/* Colored Icon in Circle */}
            <div
              className={cn(
                'flex h-12 w-12 items-center justify-center rounded-full',
                isSelected ? 'bg-primary/20' : 'bg-muted'
              )}
            >
              <Icon
                className={cn('h-6 w-6', isSelected ? config.color : 'text-muted-foreground')}
              />
            </div>

            {/* Spanish Label */}
            <span
              className={cn(
                'text-center text-sm font-semibold',
                isSelected ? 'text-primary' : 'text-foreground'
              )}
            >
              {config.labelEs}
            </span>

            {/* Description */}
            <span className="text-muted-foreground text-center text-xs">{config.description}</span>

            {/* Checkmark when selected with layoutId */}
            {isSelected && (
              <motion.div
                layoutId="selected-type"
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
