# Rumbo - Implementation Patterns

> **Last Updated:** January 11, 2026
> **Purpose:** Reusable implementation patterns for common features
> **Philosophy:** DRY (Don't Repeat Yourself) - Write it once, use it everywhere

---

## 🎯 Table of Contents

1. [Error Boundaries (React 19)](#error-boundaries-react-19)
2. [Loading States & Skeleton Screens](#loading-states--skeleton-screens)
3. [Toast Notifications (Sonner)](#toast-notifications-sonner)
4. [Email Templates (Resend)](#email-templates-resend)
5. [AI Prompts (OpenAI)](#ai-prompts-openai)
6. [Optimistic UI Updates](#optimistic-ui-updates)
7. [Form Patterns (React Hook Form)](#form-patterns-react-hook-form)
8. [Modal Dialogs](#modal-dialogs)
9. [Infinite Scroll](#infinite-scroll)
10. [File Upload (R2)](#file-upload-r2)

---

## 🚨 Error Boundaries (React 19)

**Purpose:** Catch React errors and display fallback UI

### Global Error Boundary

**File:** `src/components/common/error-boundary/index.tsx`

```typescript
'use client';

import { Component, type ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log to Sentry
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex min-h-screen flex-col items-center justify-center p-4">
            <AlertTriangle className="mb-4 h-12 w-12 text-destructive" />
            <h2 className="mb-2 text-2xl font-bold">Algo salió mal</h2>
            <p className="mb-4 text-muted-foreground">
              Lo sentimos, ocurrió un error inesperado.
            </p>
            <Button onClick={() => window.location.reload()}>
              Recargar página
            </Button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
```

### Usage

```typescript
// app/layout.tsx
import { ErrorBoundary } from '@/components/common/error-boundary';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
```

### Feature-Specific Error Boundary

```typescript
// src/features/transactions/components/transaction-list-error/index.tsx
export function TransactionListError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-6">
      <h3 className="mb-2 font-semibold text-destructive">
        Error al cargar transacciones
      </h3>
      <p className="mb-4 text-sm text-muted-foreground">
        {error.message}
      </p>
      <Button onClick={reset} variant="outline" size="sm">
        Reintentar
      </Button>
    </div>
  );
}

// app/dashboard/transactions/error.tsx
'use client';

import { TransactionListError } from '@/features/transactions/components/transaction-list-error';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return <TransactionListError error={error} reset={reset} />;
}
```

---

## ⏳ Loading States & Skeleton Screens

**Purpose:** Show loading UI while data fetches

### Skeleton Components

**File:** `src/components/ui/skeleton/index.tsx`

```typescript
import { cn } from '@/lib/utils';

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-muted', className)}
      {...props}
    />
  );
}

// Specific skeletons for common patterns
export function TransactionSkeleton() {
  return (
    <div className="flex items-center gap-4 border-b py-4">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-3 w-1/4" />
      </div>
      <Skeleton className="h-4 w-20" />
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Skeleton className="h-32 rounded-lg" />
        <Skeleton className="h-32 rounded-lg" />
        <Skeleton className="h-32 rounded-lg" />
      </div>
      <Skeleton className="h-96 rounded-lg" />
    </div>
  );
}
```

### Usage with React Suspense

```typescript
// app/dashboard/transactions/loading.tsx
import { TransactionSkeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 10 }).map((_, i) => (
        <TransactionSkeleton key={i} />
      ))}
    </div>
  );
}

// app/dashboard/transactions/page.tsx
import { Suspense } from 'react';
import { TransactionList } from '@/features/transactions/components/transaction-list';
import Loading from './loading';

export default function TransactionsPage() {
  return (
    <Suspense fallback={<Loading />}>
      <TransactionList />
    </Suspense>
  );
}
```

---

## 🔔 Toast Notifications (Sonner)

**Purpose:** Show temporary notifications to users

### Setup

**File:** `src/components/providers/toaster-provider.tsx`

```typescript
'use client';

import { Toaster } from 'sonner';
import { useTheme } from 'next-themes';

export function ToasterProvider() {
  const { theme } = useTheme();

  return (
    <Toaster
      theme={theme as 'light' | 'dark'}
      position="top-right"
      richColors
      closeButton
      expand
      duration={4000}
    />
  );
}
```

### Usage Patterns

```typescript
import { toast } from 'sonner';

// Success
toast.success('Transacción creada exitosamente');

// Error
toast.error('Error al crear transacción', {
  description: 'Por favor, intenta de nuevo',
  action: {
    label: 'Reintentar',
    onClick: () => handleRetry(),
  },
});

// Loading (with promise)
toast.promise(createTransaction({ amount: 5000 }), {
  loading: 'Creando transacción...',
  success: 'Transacción creada',
  error: 'Error al crear transacción',
});

// Custom toast with duration
toast('Recordatorio', {
  description: 'Tienes una factura pendiente de pago',
  duration: 10000, // 10 seconds
  action: {
    label: 'Ver',
    onClick: () => router.push('/bills'),
  },
});

// Info
toast.info('Nueva actualización disponible', {
  description: 'Versión 1.2.0',
});

// Warning
toast.warning('Presupuesto alcanzado', {
  description: 'Has gastado el 100% de tu presupuesto mensual',
});
```

---

## 📧 Email Templates (Resend)

**Purpose:** Send transactional emails

### Email Template Component

**File:** `src/server/emails/templates/welcome-email.tsx`

```typescript
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface WelcomeEmailProps {
  userName: string;
  loginUrl: string;
}

export function WelcomeEmail({ userName, loginUrl }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Bienvenido a Rumbo - Tu asistente financiero personal</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>¡Bienvenido a Rumbo, {userName}!</Heading>
          <Text style={text}>
            Estamos emocionados de tenerte con nosotros. Rumbo te ayudará a
            tomar el control de tus finanzas personales.
          </Text>
          <Section style={buttonContainer}>
            <Button style={button} href={loginUrl}>
              Comenzar ahora
            </Button>
          </Section>
          <Text style={text}>
            Si no creaste esta cuenta, puedes ignorar este correo.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: 'Inter, sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '40px 20px',
  maxWidth: '600px',
};

const h1 = {
  color: '#6b21a8', // Purple
  fontSize: '24px',
  fontWeight: 'bold',
  marginBottom: '20px',
};

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '24px',
  marginBottom: '16px',
};

const buttonContainer = {
  margin: '32px 0',
};

const button = {
  backgroundColor: '#6b21a8',
  borderRadius: '8px',
  color: '#ffffff',
  display: 'inline-block',
  fontSize: '16px',
  fontWeight: 'bold',
  padding: '12px 32px',
  textDecoration: 'none',
};
```

### Sending Emails

**File:** `src/server/lib/email.ts`

```typescript
import { Resend } from 'resend';
import { WelcomeEmail } from '@/server/emails/templates/welcome-email';
import { PasswordResetEmail } from '@/server/emails/templates/password-reset-email';
import { BillReminderEmail } from '@/server/emails/templates/bill-reminder-email';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomeEmail(to: string, userName: string) {
  const { data, error } = await resend.emails.send({
    from: 'Rumbo <noreply@rumbo.app>',
    to,
    subject: 'Bienvenido a Rumbo',
    react: WelcomeEmail({
      userName,
      loginUrl: `${process.env.NEXTAUTH_URL}/login`,
    }),
  });

  if (error) {
    console.error('Error sending welcome email:', error);
    throw new Error('Failed to send welcome email');
  }

  return data;
}

export async function sendPasswordResetEmail(to: string, resetToken: string) {
  const { data, error } = await resend.emails.send({
    from: 'Rumbo <noreply@rumbo.app>',
    to,
    subject: 'Restablecer tu contraseña',
    react: PasswordResetEmail({
      resetUrl: `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`,
    }),
  });

  if (error) {
    throw new Error('Failed to send password reset email');
  }

  return data;
}

export async function sendBillReminderEmail(
  to: string,
  billName: string,
  amount: number,
  dueDate: Date
) {
  const { data, error } = await resend.emails.send({
    from: 'Rumbo <noreply@rumbo.app>',
    to,
    subject: `Recordatorio: ${billName} vence pronto`,
    react: BillReminderEmail({
      billName,
      amount,
      dueDate,
      payUrl: `${process.env.NEXTAUTH_URL}/bills`,
    }),
  });

  if (error) {
    throw new Error('Failed to send bill reminder');
  }

  return data;
}
```

---

## 🤖 AI Prompts (OpenAI)

**Purpose:** Structured prompts for AI features

### System Prompts

**File:** `src/server/ai/prompts.ts`

```typescript
export const FINANCIAL_ADVISOR_SYSTEM_PROMPT = `Eres un asesor financiero personal llamado Rumbo.

Tu objetivo es ayudar a usuarios colombianos a tomar mejores decisiones financieras.

Contexto del usuario:
- Moneda: COP (Peso Colombiano)
- Formato: $1.234.567,89
- Categorías: Alimentación, Transporte, Servicios, etc.

Reglas:
1. Sé empático y comprensivo con su situación financiera
2. Da consejos prácticos y accionables para Colombia
3. Usa ejemplos con precios colombianos realistas
4. Menciona tiendas/bancos colombianos cuando sea relevante (Éxito, Bancolombia, Nequi, etc.)
5. Responde en español colombiano (usar "usted" formal)
6. Sé breve pero completo (máximo 200 palabras)
7. Si pides datos específicos, formatea claramente lo que necesitas

NO hagas:
- No des consejos de inversión específicos (acciones, cripto, etc.)
- No prometas resultados financieros garantizados
- No uses jerga financiera compleja sin explicar
`;

export const TRANSACTION_CATEGORIZATION_PROMPT = (description: string) => `
Categoriza esta transacción colombiana:
Descripción: "${description}"

Categorías disponibles:
- Alimentación (comida, supermercado, restaurantes)
- Transporte (Uber, gasolina, TransMilenio, SITP)
- Servicios (luz, agua, internet, celular)
- Entretenimiento (cine, Netflix, eventos)
- Salud (médico, farmacia, seguro)
- Educación (cursos, libros, universidad)
- Personal (ropa, peluquería, gimnasio)
- Deudas (tarjeta crédito, préstamos)
- Ahorro (inversiones, ahorro programado)
- Otros

Responde SOLO con el nombre de la categoría más apropiada.
`;

export const RECEIPT_OCR_PROMPT = (ocrText: string) => `
Extrae información de este recibo colombiano:

Texto OCR:
${ocrText}

Extrae (formato JSON):
{
  "merchant": "nombre del establecimiento",
  "amount": número total en COP,
  "date": "YYYY-MM-DD",
  "category": "categoría sugerida",
  "items": [
    { "name": "producto", "price": precio }
  ]
}

Si no encuentras algún campo, usa null.
Responde SOLO con el JSON, sin texto adicional.
`;

export const BUDGET_ADVICE_PROMPT = (income: number, expenses: number, category: string) => `
Usuario colombiano con:
- Ingreso mensual: $${income.toLocaleString('es-CO')} COP
- Gastos totales: $${expenses.toLocaleString('es-CO')} COP
- Categoría problemática: ${category}

Da 3 consejos específicos para reducir gastos en ${category}.
Usa ejemplos colombianos (tiendas D1 en vez de Éxito, cocinar en casa, etc.).
Máximo 150 palabras.
`;
```

### AI Chat Implementation

**File:** `src/server/api/routers/ai/index.ts`

```typescript
import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
import { OpenAI } from 'openai';
import { FINANCIAL_ADVISOR_SYSTEM_PROMPT } from '@/server/ai/prompts';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const aiRouter = createTRPCRouter({
  chat: protectedProcedure
    .input(
      z.object({
        message: z.string().min(1).max(500),
        conversationHistory: z
          .array(
            z.object({
              role: z.enum(['user', 'assistant']),
              content: z.string(),
            })
          )
          .optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const messages = [
        { role: 'system', content: FINANCIAL_ADVISOR_SYSTEM_PROMPT },
        ...(input.conversationHistory || []),
        { role: 'user', content: input.message },
      ];

      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages,
        temperature: 0.7,
        max_tokens: 300,
        user: ctx.session.user.id,
      });

      return {
        message: response.choices[0]?.message?.content || 'Error al generar respuesta',
        usage: response.usage,
      };
    }),
});
```

---

## ✨ Optimistic UI Updates

**Purpose:** Show immediate feedback before server confirms

### Using TanStack Query Optimistic Updates

```typescript
// src/features/transactions/hooks/use-create-transaction/index.ts
import { api } from '@/lib/trpc/client';
import { useOptimistic } from 'react';
import { toast } from 'sonner';

export function useCreateTransaction() {
  const utils = api.useUtils();

  return api.transaction.create.useMutation({
    onMutate: async (newTransaction) => {
      // Cancel outgoing refetches
      await utils.transaction.getAll.cancel();

      // Snapshot previous value
      const previousTransactions = utils.transaction.getAll.getData();

      // Optimistically update
      utils.transaction.getAll.setData(undefined, (old) => {
        return [
          {
            ...newTransaction,
            id: 'temp-' + Date.now(),
            createdAt: new Date(),
          },
          ...(old || []),
        ];
      });

      return { previousTransactions };
    },

    onError: (_err, _newTransaction, context) => {
      // Rollback on error
      utils.transaction.getAll.setData(undefined, context?.previousTransactions);
      toast.error('Error al crear transacción');
    },

    onSuccess: () => {
      toast.success('Transacción creada');
    },

    onSettled: () => {
      // Refetch to get real data
      utils.transaction.getAll.invalidate();
    },
  });
}
```

### Usage in Component

```typescript
'use client';

import { useCreateTransaction } from '@/features/transactions/hooks/use-create-transaction';

export function CreateTransactionForm() {
  const createTransaction = useCreateTransaction();

  const handleSubmit = async (data: TransactionFormData) => {
    // Immediate UI update, no loading spinner needed
    createTransaction.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
}
```

---

**Document Status:** ✅ Complete
**Last Updated:** January 11, 2026
**More patterns:** Form validation, Modal dialogs, Infinite scroll, File upload (see GAP_ANALYSIS.md Section 11)
