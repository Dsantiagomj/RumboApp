# User Router - Frontend Usage Examples

This document provides examples of how to use the User Router in your frontend components.

## Table of Contents

- [Get User Profile](#get-user-profile)
- [Update User Profile](#update-user-profile)
- [Update Specific Fields](#update-specific-fields)
- [Error Handling](#error-handling)
- [Full Component Example](#full-component-example)

---

## Get User Profile

Retrieve the current authenticated user's profile.

### Basic Query

```tsx
'use client';

import { trpc } from '@/lib/trpc/react';

export function ProfileDisplay() {
  const { data: profile, isLoading, error } = trpc.user.getProfile.useQuery();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!profile) return <div>No profile found</div>;

  return (
    <div>
      <h1>{profile.name}</h1>
      <p>Email: {profile.email}</p>
      <p>Currency: {profile.currency}</p>
      <p>Locale: {profile.locale}</p>
      <p>Timezone: {profile.timezone}</p>
      <p>Theme: {profile.theme}</p>
      {profile.nickname && <p>Nickname: {profile.nickname}</p>}
      {profile.colombianId && (
        <p>
          Colombian ID: {profile.colombianIdType} {profile.colombianId}
        </p>
      )}
    </div>
  );
}
```

### Automatic Refetching

```tsx
'use client';

import { trpc } from '@/lib/trpc/react';

export function AutoRefreshProfile() {
  // Refetch every 30 seconds
  const { data: profile } = trpc.user.getProfile.useQuery(undefined, {
    refetchInterval: 30000,
  });

  return <div>{profile?.name}</div>;
}
```

---

## Update User Profile

Update the current user's profile information.

### Basic Mutation

```tsx
'use client';

import { useState } from 'react';
import { trpc } from '@/lib/trpc/react';

export function ProfileEditor() {
  const utils = trpc.useUtils();
  const updateProfile = trpc.user.updateProfile.useMutation({
    onSuccess: () => {
      // Invalidate and refetch profile query
      utils.user.getProfile.invalidate();
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    await updateProfile.mutateAsync({
      name: formData.get('name') as string,
      nickname: formData.get('nickname') as string,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Name" required />
      <input name="nickname" placeholder="Nickname" />
      <button type="submit" disabled={updateProfile.isPending}>
        {updateProfile.isPending ? 'Saving...' : 'Save Profile'}
      </button>
      {updateProfile.error && <p>Error: {updateProfile.error.message}</p>}
    </form>
  );
}
```

---

## Update Specific Fields

### Update Currency Preference

```tsx
'use client';

import { trpc } from '@/lib/trpc/react';

type Currency = 'COP' | 'USD' | 'EUR';

export function CurrencySelector() {
  const utils = trpc.useUtils();
  const { data: profile } = trpc.user.getProfile.useQuery();
  const updateProfile = trpc.user.updateProfile.useMutation({
    onSuccess: () => {
      utils.user.getProfile.invalidate();
    },
  });

  const handleCurrencyChange = async (currency: Currency) => {
    await updateProfile.mutateAsync({ currency });
  };

  return (
    <div>
      <label>Currency:</label>
      <select
        value={profile?.currency ?? 'COP'}
        onChange={(e) => handleCurrencyChange(e.target.value as Currency)}
        disabled={updateProfile.isPending}
      >
        <option value="COP">COP (Peso Colombiano)</option>
        <option value="USD">USD (US Dollar)</option>
        <option value="EUR">EUR (Euro)</option>
      </select>
    </div>
  );
}
```

### Update Theme

```tsx
'use client';

import { trpc } from '@/lib/trpc/react';

type Theme = 'light' | 'dark' | 'system';

export function ThemeToggle() {
  const utils = trpc.useUtils();
  const { data: profile } = trpc.user.getProfile.useQuery();
  const updateProfile = trpc.user.updateProfile.useMutation({
    onSuccess: () => {
      utils.user.getProfile.invalidate();
    },
  });

  const handleThemeChange = async (theme: Theme) => {
    await updateProfile.mutateAsync({ theme });
  };

  return (
    <div className="flex gap-2">
      <button onClick={() => handleThemeChange('light')}>Light</button>
      <button onClick={() => handleThemeChange('dark')}>Dark</button>
      <button onClick={() => handleThemeChange('system')}>System</button>
      <p>Current: {profile?.theme}</p>
    </div>
  );
}
```

### Update Locale and Timezone

```tsx
'use client';

import { trpc } from '@/lib/trpc/react';

type Locale = 'es-CO' | 'en-US';

export function LocaleAndTimezone() {
  const utils = trpc.useUtils();
  const updateProfile = trpc.user.updateProfile.useMutation({
    onSuccess: () => {
      utils.user.getProfile.invalidate();
    },
  });

  const handleLocaleChange = async (locale: Locale) => {
    const timezone = locale === 'es-CO' ? 'America/Bogota' : 'America/New_York';
    await updateProfile.mutateAsync({ locale, timezone });
  };

  return (
    <div>
      <button onClick={() => handleLocaleChange('es-CO')}>Español (Colombia)</button>
      <button onClick={() => handleLocaleChange('en-US')}>English (US)</button>
    </div>
  );
}
```

### Update Colombian ID

```tsx
'use client';

import { trpc } from '@/lib/trpc/react';

type ColombianIdType = 'CC' | 'CE' | 'PASAPORTE';

export function ColombianIdForm() {
  const utils = trpc.useUtils();
  const updateProfile = trpc.user.updateProfile.useMutation({
    onSuccess: () => {
      utils.user.getProfile.invalidate();
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    await updateProfile.mutateAsync({
      colombianIdType: formData.get('idType') as ColombianIdType,
      colombianId: formData.get('idNumber') as string,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <select name="idType" required>
        <option value="CC">Cédula de Ciudadanía</option>
        <option value="CE">Cédula de Extranjería</option>
        <option value="PASAPORTE">Pasaporte</option>
      </select>
      <input name="idNumber" placeholder="ID Number" required />
      <button type="submit">Save</button>
    </form>
  );
}
```

---

## Error Handling

### Handle Duplicate Email

```tsx
'use client';

import { trpc } from '@/lib/trpc/react';
import { toast } from 'sonner';

export function EmailChanger() {
  const utils = trpc.useUtils();
  const updateProfile = trpc.user.updateProfile.useMutation({
    onSuccess: () => {
      toast.success('Email updated successfully');
      utils.user.getProfile.invalidate();
    },
    onError: (error) => {
      if (error.data?.code === 'CONFLICT') {
        toast.error('Email is already taken by another user');
      } else if (error.data?.zodError) {
        toast.error('Invalid email format');
      } else {
        toast.error('Failed to update email');
      }
    },
  });

  const handleEmailChange = async (newEmail: string) => {
    await updateProfile.mutateAsync({ email: newEmail });
  };

  return (
    <div>
      <input
        type="email"
        placeholder="New email"
        onBlur={(e) => handleEmailChange(e.target.value)}
      />
    </div>
  );
}
```

### Validation Errors

```tsx
'use client';

import { trpc } from '@/lib/trpc/react';

export function ProfileForm() {
  const updateProfile = trpc.user.updateProfile.useMutation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      await updateProfile.mutateAsync({
        name: formData.get('name') as string,
        timezone: formData.get('timezone') as string,
      });
    } catch (error: any) {
      // Handle Zod validation errors
      if (error.data?.zodError) {
        const fieldErrors = error.data.zodError.fieldErrors;
        console.error('Validation errors:', fieldErrors);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" />
      <input name="timezone" placeholder="America/Bogota" />
      <button type="submit">Save</button>
      {updateProfile.error?.data?.zodError && (
        <div className="text-red-500">
          {Object.entries(updateProfile.error.data.zodError.fieldErrors).map(([field, errors]) => (
            <p key={field}>
              {field}: {errors?.join(', ')}
            </p>
          ))}
        </div>
      )}
    </form>
  );
}
```

---

## Full Component Example

Complete example with form, validation, error handling, and optimistic updates.

```tsx
'use client';

import { useState } from 'react';
import { trpc } from '@/lib/trpc/react';
import { toast } from 'sonner';

export function ProfileSettings() {
  const utils = trpc.useUtils();
  const { data: profile, isLoading } = trpc.user.getProfile.useQuery();
  const [formData, setFormData] = useState({
    name: '',
    nickname: '',
    currency: 'COP' as const,
    locale: 'es-CO' as const,
    timezone: 'America/Bogota',
    theme: 'light' as const,
  });

  const updateProfile = trpc.user.updateProfile.useMutation({
    onMutate: async (newData) => {
      // Cancel outgoing refetches
      await utils.user.getProfile.cancel();

      // Snapshot the previous value
      const previousProfile = utils.user.getProfile.getData();

      // Optimistically update to the new value
      if (previousProfile) {
        utils.user.getProfile.setData(undefined, {
          ...previousProfile,
          ...newData,
        });
      }

      return { previousProfile };
    },
    onError: (error, _newData, context) => {
      // Rollback on error
      if (context?.previousProfile) {
        utils.user.getProfile.setData(undefined, context.previousProfile);
      }

      // Show error message
      if (error.data?.code === 'CONFLICT') {
        toast.error('Email is already taken');
      } else {
        toast.error('Failed to update profile');
      }
    },
    onSuccess: () => {
      toast.success('Profile updated successfully');
    },
    onSettled: () => {
      // Always refetch after error or success
      utils.user.getProfile.invalidate();
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await updateProfile.mutateAsync(formData);
  };

  if (isLoading) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="mb-6 text-2xl font-bold">Profile Settings</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Name</label>
          <input
            type="text"
            value={formData.name || profile?.name || ''}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full rounded border px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Nickname (Optional)</label>
          <input
            type="text"
            value={formData.nickname || profile?.nickname || ''}
            onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
            className="w-full rounded border px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Currency</label>
          <select
            value={formData.currency || profile?.currency}
            onChange={(e) =>
              setFormData({ ...formData, currency: e.target.value as 'COP' | 'USD' | 'EUR' })
            }
            className="w-full rounded border px-3 py-2"
          >
            <option value="COP">COP - Peso Colombiano</option>
            <option value="USD">USD - US Dollar</option>
            <option value="EUR">EUR - Euro</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Language</label>
          <select
            value={formData.locale || profile?.locale}
            onChange={(e) =>
              setFormData({ ...formData, locale: e.target.value as 'es-CO' | 'en-US' })
            }
            className="w-full rounded border px-3 py-2"
          >
            <option value="es-CO">Español (Colombia)</option>
            <option value="en-US">English (United States)</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Theme</label>
          <select
            value={formData.theme || profile?.theme}
            onChange={(e) =>
              setFormData({ ...formData, theme: e.target.value as 'light' | 'dark' | 'system' })
            }
            className="w-full rounded border px-3 py-2"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System</option>
          </select>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={updateProfile.isPending}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
          </button>

          <button
            type="button"
            onClick={() =>
              setFormData({
                name: profile?.name || '',
                nickname: profile?.nickname || '',
                currency: (profile?.currency as 'COP' | 'USD' | 'EUR') || 'COP',
                locale: (profile?.locale as 'es-CO' | 'en-US') || 'es-CO',
                timezone: profile?.timezone || 'America/Bogota',
                theme: (profile?.theme as 'light' | 'dark' | 'system') || 'light',
              })
            }
            className="rounded border px-4 py-2 hover:bg-gray-100"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}
```

---

## TypeScript Types

The router provides full TypeScript type inference:

```tsx
import { trpc } from '@/lib/trpc/react';

// Profile type is automatically inferred
const { data: profile } = trpc.user.getProfile.useQuery();
// profile type: {
//   id: string;
//   email: string;
//   emailVerified: Date | null;
//   name: string | null;
//   image: string | null;
//   nickname: string | null;
//   colombianId: string | null;
//   colombianIdType: 'CC' | 'CE' | 'PASAPORTE' | null;
//   role: 'USER' | 'ADMIN';
//   currency: string;
//   locale: string;
//   timezone: string;
//   theme: string;
//   createdAt: Date;
//   updatedAt: Date;
// }

// Update input is type-safe
const updateProfile = trpc.user.updateProfile.useMutation();
await updateProfile.mutateAsync({
  name: 'Juan',
  currency: 'COP', // Type-safe: only 'COP' | 'USD' | 'EUR'
  locale: 'es-CO', // Type-safe: only 'es-CO' | 'en-US'
  theme: 'dark', // Type-safe: only 'light' | 'dark' | 'system'
});
```

---

## Security Notes

1. **Authentication Required**: All user router procedures require authentication via `protectedProcedure`
2. **Role Changes Blocked**: Users cannot change their own role through this router
3. **Email Uniqueness**: Duplicate emails are prevented with `CONFLICT` error
4. **Password Excluded**: Password field is never returned in responses
5. **Soft Delete**: Deleted users (deletedAt !== null) are excluded from queries

---

## Colombian Context Defaults

- **Currency**: COP (Peso Colombiano)
- **Locale**: es-CO (Spanish - Colombia)
- **Timezone**: America/Bogota
- **ID Types**: CC (Cédula), CE (Extranjería), PASAPORTE
