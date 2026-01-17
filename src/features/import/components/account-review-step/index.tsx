'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle,
  Circle,
  ChevronDown,
  ChevronUp,
  Edit2,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Calendar,
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Account Review Step Component
 *
 * Allows users to review and edit imported accounts before confirmation
 * Shows transaction preview for each account
 */

interface Transaction {
  id: string;
  date: Date;
  description: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE' | 'TRANSFER';
  merchant: string | null;
  suggestedCategoryId: string | null;
  confidence: number | null;
  isConfirmed: boolean;
}

interface Account {
  id: string;
  name: string;
  bankName: string | null;
  accountNumber: string | null;
  accountType: 'SAVINGS' | 'CHECKING' | 'CREDIT_CARD' | 'LOAN' | 'CASH' | 'INVESTMENT' | 'OTHER';
  initialBalance: number;
  transactionCount: number;
  suggestedColor: string | null;
  suggestedIcon: string | null;
  confidence: number | null;
  isConfirmed: boolean;
  transactions: Transaction[];
}

export interface AccountReviewStepProps {
  accounts: Account[];
  onConfirmationsChange: (confirmations: AccountConfirmation[]) => void;
}

export interface AccountConfirmation {
  importedAccountId: string;
  confirmed: boolean;
  name?: string;
  accountType?: Account['accountType'];
  color?: string;
  icon?: string;
}

const ACCOUNT_TYPE_LABELS: Record<Account['accountType'], string> = {
  SAVINGS: 'Ahorros',
  CHECKING: 'Corriente',
  CREDIT_CARD: 'Tarjeta de Crédito',
  LOAN: 'Préstamo',
  CASH: 'Efectivo',
  INVESTMENT: 'Inversión',
  OTHER: 'Otro',
};

export function AccountReviewStep({ accounts, onConfirmationsChange }: AccountReviewStepProps) {
  const [confirmations, setConfirmations] = useState<Record<string, AccountConfirmation>>(() =>
    accounts.reduce(
      (acc, account) => ({
        ...acc,
        [account.id]: {
          importedAccountId: account.id,
          confirmed: true, // Default to confirmed
          name: account.name,
          accountType: account.accountType,
          color: account.suggestedColor || '#6366f1',
          icon: account.suggestedIcon,
        },
      }),
      {}
    )
  );

  const [expandedAccounts, setExpandedAccounts] = useState<Set<string>>(new Set());
  const [editingAccount, setEditingAccount] = useState<string | null>(null);

  const toggleConfirmation = (accountId: string) => {
    const updated = {
      ...confirmations,
      [accountId]: {
        ...confirmations[accountId]!,
        confirmed: !confirmations[accountId]!.confirmed,
      },
    };
    setConfirmations(updated);
    onConfirmationsChange(Object.values(updated));
  };

  const toggleExpanded = (accountId: string) => {
    const newExpanded = new Set(expandedAccounts);
    if (newExpanded.has(accountId)) {
      newExpanded.delete(accountId);
    } else {
      newExpanded.add(accountId);
    }
    setExpandedAccounts(newExpanded);
  };

  const updateAccountDetails = (accountId: string, updates: Partial<AccountConfirmation>) => {
    const updated = {
      ...confirmations,
      [accountId]: {
        ...confirmations[accountId]!,
        ...updates,
      },
    };
    setConfirmations(updated);
    onConfirmationsChange(Object.values(updated));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const confirmedCount = Object.values(confirmations).filter((c) => c.confirmed).length;

  return (
    <div className="space-y-6">
      {/* Summary header */}
      <div className="bg-accent/50 rounded-xl border p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-foreground text-lg font-semibold">Revisa tus cuentas</h3>
            <p className="text-muted-foreground mt-1 text-sm">
              Selecciona las cuentas que deseas importar y edita sus detalles si es necesario
            </p>
          </div>
          <div className="text-center">
            <p className="text-primary text-3xl font-bold">{confirmedCount}</p>
            <p className="text-muted-foreground text-sm">
              de {accounts.length} {accounts.length === 1 ? 'cuenta' : 'cuentas'}
            </p>
          </div>
        </div>
      </div>

      {/* Account list */}
      <div className="space-y-4">
        {accounts.map((account) => {
          const confirmation = confirmations[account.id]!;
          const isExpanded = expandedAccounts.has(account.id);
          const isEditing = editingAccount === account.id;

          return (
            <motion.div
              key={account.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`overflow-hidden rounded-xl border-2 transition-all ${
                confirmation.confirmed ? 'border-primary bg-primary/5' : 'border-border bg-card'
              }`}
            >
              {/* Account header */}
              <div className="flex items-center gap-4 p-4">
                {/* Checkbox */}
                <button
                  type="button"
                  onClick={() => toggleConfirmation(account.id)}
                  className="shrink-0"
                >
                  {confirmation.confirmed ? (
                    <CheckCircle className="text-primary h-6 w-6" />
                  ) : (
                    <Circle className="text-muted-foreground h-6 w-6" />
                  )}
                </button>

                {/* Account info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 shrink-0 rounded-full"
                      style={{ backgroundColor: confirmation.color }}
                    />
                    <h4 className="text-foreground truncate font-semibold">{confirmation.name}</h4>
                    {account.confidence && account.confidence < 0.8 && (
                      <AlertCircle className="text-warning h-4 w-4 shrink-0" />
                    )}
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-sm">
                    <span className="text-muted-foreground">
                      {ACCOUNT_TYPE_LABELS[confirmation.accountType || account.accountType]}
                    </span>
                    {account.bankName && (
                      <>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-muted-foreground">{account.bankName}</span>
                      </>
                    )}
                    {account.accountNumber && (
                      <>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-muted-foreground font-mono">
                          ****{account.accountNumber.slice(-4)}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="hidden shrink-0 text-right sm:block">
                  <p className="text-foreground text-lg font-semibold">
                    {formatCurrency(account.initialBalance)}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {account.transactionCount}{' '}
                    {account.transactionCount === 1 ? 'transacción' : 'transacciones'}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingAccount(isEditing ? null : account.id)}
                    className="text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg p-2 transition-colors"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleExpanded(account.id)}
                    className="text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg p-2 transition-colors"
                  >
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Edit form */}
              <AnimatePresence>
                {isEditing && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t"
                  >
                    <div className="space-y-4 p-4">
                      <div>
                        <label className="text-foreground mb-2 block text-sm font-medium">
                          Nombre de la cuenta
                        </label>
                        <input
                          type="text"
                          value={confirmation.name}
                          onChange={(e) =>
                            updateAccountDetails(account.id, { name: e.target.value })
                          }
                          className="bg-input text-foreground border-input focus:border-primary focus:ring-primary/20 w-full rounded-lg border px-4 py-2 transition-all focus:ring-2 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-foreground mb-2 block text-sm font-medium">
                          Tipo de cuenta
                        </label>
                        <select
                          value={confirmation.accountType}
                          onChange={(e) =>
                            updateAccountDetails(account.id, {
                              accountType: e.target.value as Account['accountType'],
                            })
                          }
                          className="bg-input text-foreground border-input focus:border-primary focus:ring-primary/20 w-full rounded-lg border px-4 py-2 transition-all focus:ring-2 focus:outline-none"
                        >
                          {Object.entries(ACCOUNT_TYPE_LABELS).map(([value, label]) => (
                            <option key={value} value={value}>
                              {label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Transaction preview */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t"
                  >
                    <div className="bg-accent/30 p-4">
                      <h5 className="text-foreground mb-3 text-sm font-semibold">
                        Últimas transacciones
                      </h5>
                      <div className="space-y-2">
                        {account.transactions.slice(0, 5).map((transaction) => (
                          <div
                            key={transaction.id}
                            className="bg-background flex items-center justify-between gap-4 rounded-lg border p-3"
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                                  transaction.type === 'EXPENSE'
                                    ? 'bg-destructive/10'
                                    : 'bg-primary/10'
                                }`}
                              >
                                {transaction.type === 'EXPENSE' ? (
                                  <TrendingDown
                                    className={`h-4 w-4 ${
                                      transaction.type === 'EXPENSE'
                                        ? 'text-destructive'
                                        : 'text-primary'
                                    }`}
                                  />
                                ) : (
                                  <TrendingUp className="text-primary h-4 w-4" />
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="text-foreground truncate text-sm font-medium">
                                  {transaction.description}
                                </p>
                                <div className="text-muted-foreground mt-0.5 flex items-center gap-2 text-xs">
                                  <Calendar className="h-3 w-3" />
                                  {format(new Date(transaction.date), 'PPP', {
                                    locale: es,
                                  })}
                                </div>
                              </div>
                            </div>
                            <div className="shrink-0 text-right">
                              <p
                                className={`text-sm font-semibold ${
                                  transaction.type === 'EXPENSE'
                                    ? 'text-destructive'
                                    : 'text-primary'
                                }`}
                              >
                                {transaction.type === 'EXPENSE' ? '-' : '+'}
                                {formatCurrency(Math.abs(transaction.amount))}
                              </p>
                            </div>
                          </div>
                        ))}
                        {account.transactions.length > 5 && (
                          <p className="text-muted-foreground text-center text-sm">
                            +{account.transactions.length - 5} transacciones más
                          </p>
                        )}
                        {account.transactions.length === 0 && (
                          <p className="text-muted-foreground text-center text-sm">
                            No hay transacciones para mostrar
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Warning if no accounts selected */}
      {confirmedCount === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-warning/50 bg-warning/10 flex items-start gap-3 rounded-xl border p-4"
        >
          <AlertCircle className="text-warning mt-0.5 h-6 w-6 shrink-0" />
          <div>
            <h4 className="text-warning text-sm font-semibold">
              No has seleccionado ninguna cuenta
            </h4>
            <p className="text-warning/80 mt-1 text-sm">
              Debes seleccionar al menos una cuenta para continuar con la importación.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
