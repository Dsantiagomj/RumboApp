'use client';

/**
 * Create Account Form
 *
 * Form for creating a new financial account with type-specific fields
 */

import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, Building, Hash, DollarSign, ArrowRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { z } from 'zod';

import { Spinner } from '@/components/ui/spinner';
import { trpc } from '@/lib/trpc/react';

import { AccountTypeSelector } from '../account-type-selector';
import type { AccountType } from '../account-type-selector/types';

// Colombian banks list
const COLOMBIAN_BANKS = [
  'Bancolombia',
  'Banco de Bogotá',
  'Davivienda',
  'BBVA',
  'Banco Popular',
  'Banco Occidente',
  'Banco Caja Social',
  'Banco AV Villas',
  'Banco Agrario',
  'Nequi',
  'Daviplata',
  'Otro',
] as const;

// Validation schema
const createAccountFormSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre de la cuenta es obligatorio')
    .max(100, 'El nombre no puede tener más de 100 caracteres'),
  accountType: z.enum(
    ['SAVINGS', 'CHECKING', 'CREDIT_CARD', 'LOAN', 'CASH', 'INVESTMENT', 'OTHER'],
    {
      errorMap: () => ({ message: 'Selecciona un tipo de cuenta' }),
    }
  ),
  bankName: z.string().optional(),
  accountNumber: z
    .string()
    .max(4, 'Máximo 4 dígitos')
    .regex(/^\d*$/, 'Solo se permiten números')
    .optional(),

  // Type-specific fields
  currentBalance: z.number().optional(),
  creditLimit: z.number().optional(),
  currentDebt: z.number().optional(),
  loanAmount: z.number().optional(),
  remainingLoanBalance: z.number().optional(),
  monthlyPayment: z.number().optional(),
});

type CreateAccountFormData = z.infer<typeof createAccountFormSchema>;

export interface CreateAccountFormProps {
  onSuccess?: () => void;
}

/**
 * CreateAccountForm Component
 *
 * @example
 * ```tsx
 * <CreateAccountForm
 *   onSuccess={() => console.log('Account created')}
 * />
 * ```
 */
export function CreateAccountForm({ onSuccess }: CreateAccountFormProps) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<CreateAccountFormData>({
    resolver: zodResolver(createAccountFormSchema),
    mode: 'onChange',
    defaultValues: {
      accountType: 'SAVINGS',
    },
  });

  const accountType = watch('accountType');

  const createMutation = trpc.account.create.useMutation({
    onSuccess: () => {
      onSuccess?.();
      router.push('/dashboard');
    },
  });

  const onSubmit = (data: CreateAccountFormData) => {
    // Build the mutation input based on account type
    const input: Record<string, unknown> = {
      name: data.name,
      accountType: data.accountType,
      bankName: data.bankName,
      accountNumber: data.accountNumber,
    };

    // Add type-specific fields
    if (
      data.accountType === 'SAVINGS' ||
      data.accountType === 'CHECKING' ||
      data.accountType === 'CASH' ||
      data.accountType === 'INVESTMENT' ||
      data.accountType === 'OTHER'
    ) {
      input.currentBalance = data.currentBalance;
    } else if (data.accountType === 'CREDIT_CARD') {
      input.creditLimit = data.creditLimit;
      input.currentDebt = data.currentDebt;
    } else if (data.accountType === 'LOAN') {
      input.loanAmount = data.loanAmount;
      input.remainingLoanBalance = data.remainingLoanBalance;
      input.monthlyPayment = data.monthlyPayment;
    }

    createMutation.mutate(input as never);
  };

  const isLoading = createMutation.isPending;

  // Helper to check if type requires balance field
  const requiresBalance = ['SAVINGS', 'CHECKING', 'CASH', 'INVESTMENT', 'OTHER'].includes(
    accountType
  );
  const isCreditCard = accountType === 'CREDIT_CARD';
  const isLoan = accountType === 'LOAN';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3 }}
      className="w-full space-y-8"
    >
      {/* Header */}
      <div className="flex items-start gap-4">
        <motion.div className="bg-primary/10 rounded-2xl p-3" whileHover={{ scale: 1.03 }}>
          <Wallet className="text-primary h-6 w-6" />
        </motion.div>
        <div className="flex-1 space-y-1">
          <h2 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
            Crear Nueva Cuenta
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            Registra tu cuenta financiera para comenzar a hacer seguimiento
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Account Type Selector */}
        <div className="w-full">
          <label className="text-foreground mb-3 block text-sm font-medium">
            Tipo de Cuenta
            <span className="text-destructive ml-1">*</span>
          </label>
          <AccountTypeSelector
            value={accountType}
            onChange={(type: AccountType) =>
              setValue('accountType', type, { shouldValidate: true })
            }
          />
          {errors.accountType && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-destructive mt-2 text-sm"
              role="alert"
            >
              {errors.accountType.message}
            </motion.p>
          )}
        </div>

        {/* Account Name */}
        <div>
          <label htmlFor="name" className="text-foreground mb-2 block text-sm font-medium">
            Nombre de la Cuenta
            <span className="text-destructive ml-1">*</span>
          </label>
          <div className="relative">
            <Wallet className="text-muted-foreground absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2" />
            <input
              {...register('name')}
              id="name"
              type="text"
              placeholder="Ej: Bancolombia Ahorros"
              disabled={isLoading}
              className="bg-input text-foreground placeholder:text-muted-foreground border-input focus:border-primary focus:ring-primary/20 w-full rounded-lg border py-4 pr-4 pl-12 transition-all focus:ring-2 focus:outline-none"
            />
          </div>
          {errors.name && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-destructive mt-2 text-sm"
              role="alert"
            >
              {errors.name.message}
            </motion.p>
          )}
        </div>

        {/* Bank Name */}
        <div>
          <label htmlFor="bankName" className="text-foreground mb-2 block text-sm font-medium">
            Entidad Bancaria
          </label>
          <div className="relative">
            <Building className="text-muted-foreground absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2" />
            <select
              {...register('bankName')}
              id="bankName"
              disabled={isLoading}
              className="bg-input text-foreground placeholder:text-muted-foreground border-input focus:border-primary focus:ring-primary/20 w-full appearance-none rounded-lg border py-4 pr-4 pl-12 transition-all focus:ring-2 focus:outline-none"
            >
              <option value="">Selecciona un banco</option>
              {COLOMBIAN_BANKS.map((bank) => (
                <option key={bank} value={bank}>
                  {bank}
                </option>
              ))}
            </select>
          </div>
          {errors.bankName && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-destructive mt-2 text-sm"
              role="alert"
            >
              {errors.bankName.message}
            </motion.p>
          )}
        </div>

        {/* Account Number (last 4 digits) */}
        <div>
          <label htmlFor="accountNumber" className="text-foreground mb-2 block text-sm font-medium">
            Últimos 4 Dígitos
          </label>
          <div className="relative">
            <Hash className="text-muted-foreground absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2" />
            <input
              {...register('accountNumber')}
              id="accountNumber"
              type="text"
              placeholder="1234"
              maxLength={4}
              disabled={isLoading}
              className="bg-input text-foreground placeholder:text-muted-foreground border-input focus:border-primary focus:ring-primary/20 w-full rounded-lg border py-4 pr-4 pl-12 transition-all focus:ring-2 focus:outline-none"
            />
          </div>
          {errors.accountNumber && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-destructive mt-2 text-sm"
              role="alert"
            >
              {errors.accountNumber.message}
            </motion.p>
          )}
          {!errors.accountNumber && (
            <p className="text-muted-foreground mt-2 text-xs">Se mostrará como ****1234</p>
          )}
        </div>

        {/* Type-Specific Fields with AnimatePresence */}
        <AnimatePresence mode="wait">
          {/* Current Balance (for SAVINGS, CHECKING, CASH, INVESTMENT, OTHER) */}
          {requiresBalance && (
            <motion.div
              key="balance-field"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <label
                htmlFor="currentBalance"
                className="text-foreground mb-2 block text-sm font-medium"
              >
                Saldo Actual
                <span className="text-destructive ml-1">*</span>
              </label>
              <div className="relative">
                <DollarSign className="text-muted-foreground absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2" />
                <span className="text-muted-foreground absolute top-1/2 left-11 -translate-y-1/2 text-sm">
                  $
                </span>
                <input
                  {...register('currentBalance', { valueAsNumber: true })}
                  id="currentBalance"
                  type="number"
                  placeholder="0"
                  disabled={isLoading}
                  className="bg-input text-foreground placeholder:text-muted-foreground border-input focus:border-primary focus:ring-primary/20 w-full rounded-lg border py-4 pr-16 pl-16 transition-all focus:ring-2 focus:outline-none"
                />
                <span className="text-muted-foreground absolute top-1/2 right-4 -translate-y-1/2 text-sm">
                  COP
                </span>
              </div>
              {errors.currentBalance && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-destructive mt-2 text-sm"
                  role="alert"
                >
                  {errors.currentBalance.message}
                </motion.p>
              )}
            </motion.div>
          )}

          {/* Credit Card Fields */}
          {isCreditCard && (
            <motion.div
              key="credit-card-fields"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Credit Limit */}
              <div>
                <label
                  htmlFor="creditLimit"
                  className="text-foreground mb-2 block text-sm font-medium"
                >
                  Cupo Total
                  <span className="text-destructive ml-1">*</span>
                </label>
                <div className="relative">
                  <DollarSign className="text-muted-foreground absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2" />
                  <span className="text-muted-foreground absolute top-1/2 left-11 -translate-y-1/2 text-sm">
                    $
                  </span>
                  <input
                    {...register('creditLimit', { valueAsNumber: true })}
                    id="creditLimit"
                    type="number"
                    placeholder="0"
                    disabled={isLoading}
                    className="bg-input text-foreground placeholder:text-muted-foreground border-input focus:border-primary focus:ring-primary/20 w-full rounded-lg border py-4 pr-16 pl-16 transition-all focus:ring-2 focus:outline-none"
                  />
                  <span className="text-muted-foreground absolute top-1/2 right-4 -translate-y-1/2 text-sm">
                    COP
                  </span>
                </div>
                {errors.creditLimit && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-destructive mt-2 text-sm"
                    role="alert"
                  >
                    {errors.creditLimit.message}
                  </motion.p>
                )}
              </div>

              {/* Current Debt */}
              <div>
                <label
                  htmlFor="currentDebt"
                  className="text-foreground mb-2 block text-sm font-medium"
                >
                  Deuda Actual
                </label>
                <div className="relative">
                  <DollarSign className="text-muted-foreground absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2" />
                  <span className="text-muted-foreground absolute top-1/2 left-11 -translate-y-1/2 text-sm">
                    $
                  </span>
                  <input
                    {...register('currentDebt', { valueAsNumber: true })}
                    id="currentDebt"
                    type="number"
                    placeholder="0"
                    disabled={isLoading}
                    className="bg-input text-foreground placeholder:text-muted-foreground border-input focus:border-primary focus:ring-primary/20 w-full rounded-lg border py-4 pr-16 pl-16 transition-all focus:ring-2 focus:outline-none"
                  />
                  <span className="text-muted-foreground absolute top-1/2 right-4 -translate-y-1/2 text-sm">
                    COP
                  </span>
                </div>
                {errors.currentDebt && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-destructive mt-2 text-sm"
                    role="alert"
                  >
                    {errors.currentDebt.message}
                  </motion.p>
                )}
              </div>
            </motion.div>
          )}

          {/* Loan Fields */}
          {isLoan && (
            <motion.div
              key="loan-fields"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Loan Amount */}
              <div>
                <label
                  htmlFor="loanAmount"
                  className="text-foreground mb-2 block text-sm font-medium"
                >
                  Monto Total del Préstamo
                  <span className="text-destructive ml-1">*</span>
                </label>
                <div className="relative">
                  <DollarSign className="text-muted-foreground absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2" />
                  <span className="text-muted-foreground absolute top-1/2 left-11 -translate-y-1/2 text-sm">
                    $
                  </span>
                  <input
                    {...register('loanAmount', { valueAsNumber: true })}
                    id="loanAmount"
                    type="number"
                    placeholder="0"
                    disabled={isLoading}
                    className="bg-input text-foreground placeholder:text-muted-foreground border-input focus:border-primary focus:ring-primary/20 w-full rounded-lg border py-4 pr-16 pl-16 transition-all focus:ring-2 focus:outline-none"
                  />
                  <span className="text-muted-foreground absolute top-1/2 right-4 -translate-y-1/2 text-sm">
                    COP
                  </span>
                </div>
                {errors.loanAmount && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-destructive mt-2 text-sm"
                    role="alert"
                  >
                    {errors.loanAmount.message}
                  </motion.p>
                )}
              </div>

              {/* Remaining Loan Balance */}
              <div>
                <label
                  htmlFor="remainingLoanBalance"
                  className="text-foreground mb-2 block text-sm font-medium"
                >
                  Saldo Pendiente
                </label>
                <div className="relative">
                  <DollarSign className="text-muted-foreground absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2" />
                  <span className="text-muted-foreground absolute top-1/2 left-11 -translate-y-1/2 text-sm">
                    $
                  </span>
                  <input
                    {...register('remainingLoanBalance', { valueAsNumber: true })}
                    id="remainingLoanBalance"
                    type="number"
                    placeholder="0"
                    disabled={isLoading}
                    className="bg-input text-foreground placeholder:text-muted-foreground border-input focus:border-primary focus:ring-primary/20 w-full rounded-lg border py-4 pr-16 pl-16 transition-all focus:ring-2 focus:outline-none"
                  />
                  <span className="text-muted-foreground absolute top-1/2 right-4 -translate-y-1/2 text-sm">
                    COP
                  </span>
                </div>
                {errors.remainingLoanBalance && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-destructive mt-2 text-sm"
                    role="alert"
                  >
                    {errors.remainingLoanBalance.message}
                  </motion.p>
                )}
              </div>

              {/* Monthly Payment */}
              <div>
                <label
                  htmlFor="monthlyPayment"
                  className="text-foreground mb-2 block text-sm font-medium"
                >
                  Cuota Mensual
                </label>
                <div className="relative">
                  <DollarSign className="text-muted-foreground absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2" />
                  <span className="text-muted-foreground absolute top-1/2 left-11 -translate-y-1/2 text-sm">
                    $
                  </span>
                  <input
                    {...register('monthlyPayment', { valueAsNumber: true })}
                    id="monthlyPayment"
                    type="number"
                    placeholder="0"
                    disabled={isLoading}
                    className="bg-input text-foreground placeholder:text-muted-foreground border-input focus:border-primary focus:ring-primary/20 w-full rounded-lg border py-4 pr-16 pl-16 transition-all focus:ring-2 focus:outline-none"
                  />
                  <span className="text-muted-foreground absolute top-1/2 right-4 -translate-y-1/2 text-sm">
                    COP
                  </span>
                </div>
                {errors.monthlyPayment && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-destructive mt-2 text-sm"
                    role="alert"
                  >
                    {errors.monthlyPayment.message}
                  </motion.p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={isLoading || !isValid}
          whileHover={{
            scale: isLoading ? 1 : 1.02,
            boxShadow: isLoading ? undefined : '0 10px 40px rgba(139, 92, 246, 0.3)',
          }}
          whileTap={{ scale: isLoading ? 1 : 0.98 }}
          className="group from-primary relative mt-8 w-full cursor-pointer overflow-hidden rounded-xl bg-gradient-to-r to-purple-600 px-6 py-4 font-semibold text-white shadow-lg transition-all hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

          <span className="relative flex items-center justify-center gap-2">
            {isLoading ? (
              <>
                <Spinner size="sm" className="text-white" />
                Creando cuenta...
              </>
            ) : (
              <>
                Crear Cuenta
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </span>
        </motion.button>
      </form>
    </motion.div>
  );
}
