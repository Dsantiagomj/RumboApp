# Component Standards & Templates

## Overview

This document defines the standard patterns and conventions for React components in the Rumbo codebase.

## Component Structure

### 1. File Organization

```
src/
├── features/              # Feature-based modules
│   └── [feature-name]/
│       ├── components/    # Feature components
│       ├── hooks/         # Feature-specific hooks
│       ├── types/         # Feature-specific types
│       └── utils/         # Feature utilities (validation, helpers)
└── shared/
    ├── components/
    │   └── ui/           # Reusable UI components (shadcn/ui)
    ├── hooks/            # Shared hooks
    └── lib/              # Shared utilities
```

### 2. Import Order

All imports must follow this order (enforced by ESLint):

```tsx
// 1. React and Next.js (external, alphabetical)
import { useState } from 'react';
import { useRouter } from 'next/navigation';

// 2. Other external packages (alphabetical)
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

// 3. Internal imports with @ alias (alphabetical)
import { Button } from '@/shared/components/ui/button';
import { Form, FormField } from '@/shared/components/ui/form';
import { useFormErrors } from '@/shared/hooks/use-form-errors';
import { logger } from '@/shared/lib/logger';

// 4. Relative imports
import { loginSchema } from '../utils/validation';
import type { LoginInput } from '../types';
```

### 3. Component Declaration

**Always use function declarations for named components:**

```tsx
// ✅ CORRECT
export function LoginForm() {
  // component logic
}

// ❌ INCORRECT
export const LoginForm = () => {
  // component logic
};

// ❌ INCORRECT
export default function LoginForm() {
  // component logic
}
```

### 4. Export Patterns

**Use named exports, not default exports:**

```tsx
// ✅ CORRECT
export function LoginForm() {}

// ❌ INCORRECT
export default function LoginForm() {}
```

**Exception:** Next.js page files (`page.tsx`, `layout.tsx`) must use default exports.

### 5. Client Components

Client components (using hooks, event handlers, or client-side APIs) must have the `'use client'` directive:

```tsx
'use client';

import { useState } from 'react';

export function InteractiveComponent() {
  const [count, setCount] = useState(0);
  // ...
}
```

### 6. Props Interface

**Extract props interfaces to the top of the file:**

```tsx
interface LoginFormProps {
  callbackUrl?: string;
  onSuccess?: () => void;
}

export function LoginForm({ callbackUrl, onSuccess }: LoginFormProps) {
  // ...
}
```

### 7. Error Handling

**Use the unified `useFormErrors` hook for form error handling:**

```tsx
import { useFormErrors } from '@/shared/hooks/use-form-errors';

export function LoginForm() {
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const { handleError, clearError } = useFormErrors({
    setError: form.setError,
    logContext: { formName: 'LoginForm' },
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      clearError();
      const result = await submitLogin(data);

      if (result?.error) {
        handleError(new Error(result.error), 'Error al iniciar sesión');
        return;
      }

      // Success handling
    } catch (error) {
      handleError(error, 'Ocurrió un error inesperado');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* Form fields */}

        {/* Error display */}
        {form.formState.errors.root && (
          <div className="bg-destructive/15 text-destructive rounded-md p-3 text-sm">
            {form.formState.errors.root.message}
          </div>
        )}
      </form>
    </Form>
  );
}
```

### 8. Validation Schemas

**Place validation schemas in feature utils:**

```
src/features/auth/
├── components/
│   └── login-form.tsx
└── utils/
    └── validation.ts        # Contains loginSchema, registerSchema, etc.
```

```tsx
// src/features/auth/utils/validation.ts
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
});

export type LoginInput = z.infer<typeof loginSchema>;
```

### 9. Styling Patterns

**Use design tokens from Tailwind config:**

```tsx
// ✅ CORRECT - Uses theme colors
<div className="bg-brand-primary-500 text-white">

// ❌ INCORRECT - Hardcoded colors
<div className="bg-blue-500 text-white">
```

**Common color mappings:**

- Primary brand: `brand-primary-{shade}`
- Secondary brand: `brand-secondary-{shade}`
- Success: `success-{shade}`
- Error/Destructive: `destructive`
- Warning: `warning-{shade}`
- Neutral: `neutral-{shade}`

### 10. Type Imports

**Use `type` imports for type-only imports:**

```tsx
// ✅ CORRECT
import type { LoginInput } from '../types';

// ❌ INCORRECT
import { LoginInput } from '../types';
```

## Complete Component Template

```tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/shared/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { useFormErrors } from '@/shared/hooks/use-form-errors';

import { exampleSchema } from '../utils/validation';

import type { ExampleInput } from '../utils/validation';

interface ExampleFormProps {
  onSuccess?: () => void;
  defaultValues?: Partial<ExampleInput>;
}

export function ExampleForm({ onSuccess, defaultValues }: ExampleFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ExampleInput>({
    resolver: zodResolver(exampleSchema),
    defaultValues: defaultValues || {
      field1: '',
      field2: '',
    },
  });

  const { handleError, clearError } = useFormErrors({
    setError: form.setError,
    logContext: { formName: 'ExampleForm' },
  });

  const onSubmit = async (data: ExampleInput) => {
    setIsLoading(true);

    try {
      clearError();

      // API call or business logic
      const result = await submitData(data);

      if (result?.error) {
        handleError(new Error(result.error), 'Error al enviar datos');
        return;
      }

      // Success handling
      onSuccess?.();
    } catch (error) {
      handleError(error, 'Ocurrió un error inesperado');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="field1"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Field Label</FormLabel>
              <FormControl>
                <Input placeholder="Enter value" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Error display */}
        {form.formState.errors.root && (
          <div className="bg-destructive/15 text-destructive rounded-md p-3 text-sm">
            {form.formState.errors.root.message}
          </div>
        )}

        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Enviando...' : 'Enviar'}
        </Button>
      </form>
    </Form>
  );
}
```

## ESLint Configuration

The following ESLint rules enforce these standards:

- `import/order`: Enforces import ordering
- `import/newline-after-import`: Requires newline after imports
- `react/function-component-definition`: Enforces function declarations
- `no-restricted-syntax`: Prevents default exports for components
- `@typescript-eslint/consistent-type-imports`: Enforces type imports

Run `pnpm lint` to check for violations.
Run `pnpm lint --fix` to auto-fix violations where possible.

## Migration Checklist

When updating existing components:

- [ ] Add `'use client'` if component uses hooks or event handlers
- [ ] Convert default exports to named exports (except Next.js pages)
- [ ] Convert arrow functions to function declarations
- [ ] Extract props interface to top of file
- [ ] Organize imports according to standard order
- [ ] Replace `form.setError` with `useFormErrors` hook
- [ ] Move validation schemas to `utils/validation.ts`
- [ ] Replace hardcoded colors with design tokens
- [ ] Use `type` imports for type-only imports
