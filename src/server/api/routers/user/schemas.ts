/**
 * Zod schemas for User router
 *
 * Validation schemas for user profile operations.
 * Follows Colombian context defaults (COP, es-CO, America/Bogota).
 */

import { z } from 'zod';

/**
 * Colombian ID types enum
 */
export const colombianIdTypeSchema = z.enum(['CC', 'CE', 'PASAPORTE'], {
  errorMap: () => ({ message: 'ID type must be CC, CE, or PASAPORTE' }),
});

/**
 * Currency enum
 */
export const currencySchema = z.enum(['COP', 'USD', 'EUR'], {
  errorMap: () => ({ message: 'Currency must be COP, USD, or EUR' }),
});

/**
 * Locale enum
 */
export const localeSchema = z.enum(['es-CO', 'en-US'], {
  errorMap: () => ({ message: 'Locale must be es-CO or en-US' }),
});

/**
 * Theme enum
 */
export const themeSchema = z.enum(['light', 'dark', 'system'], {
  errorMap: () => ({ message: 'Theme must be light, dark, or system' }),
});

/**
 * Timezone schema
 * Validates IANA timezone strings
 */
export const timezoneSchema = z.string().refine(
  (tz) => {
    try {
      // Test if timezone is valid by trying to use it
      Intl.DateTimeFormat(undefined, { timeZone: tz });
      return true;
    } catch {
      return false;
    }
  },
  {
    message: 'Invalid timezone. Must be a valid IANA timezone string (e.g., America/Bogota)',
  }
);

/**
 * Update profile input schema
 *
 * All fields are optional (partial update).
 * Validates:
 * - Name: 1-100 characters
 * - Email: valid email format
 * - Currency: COP, USD, EUR
 * - Locale: es-CO, en-US
 * - Timezone: valid IANA timezone
 * - Theme: light, dark, system
 *
 * NOTE: Role updates are NOT allowed here (security)
 */
export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(1, 'Name must be at least 1 character')
    .max(100, 'Name must be at most 100 characters')
    .optional(),
  email: z.string().email('Invalid email address').optional(),
  image: z.string().url('Image must be a valid URL').nullable().optional(),
  nickname: z
    .string()
    .min(1, 'Nickname must be at least 1 character')
    .max(50, 'Nickname must be at most 50 characters')
    .nullable()
    .optional(),
  colombianId: z
    .string()
    .min(1, 'Colombian ID must be at least 1 character')
    .max(20, 'Colombian ID must be at most 20 characters')
    .nullable()
    .optional(),
  colombianIdType: colombianIdTypeSchema.nullable().optional(),
  currency: currencySchema.optional(),
  locale: localeSchema.optional(),
  timezone: timezoneSchema.optional(),
  theme: themeSchema.optional(),
});

/**
 * Type inference for updateProfileSchema
 */
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

/**
 * Profile output schema (what we return from getProfile)
 *
 * Excludes sensitive fields:
 * - password
 * - deletedAt
 */
export const profileOutputSchema = z.object({
  id: z.string(),
  email: z.string(),
  emailVerified: z.date().nullable(),
  name: z.string().nullable(),
  image: z.string().nullable(),
  nickname: z.string().nullable(),
  colombianId: z.string().nullable(),
  colombianIdType: z.enum(['CC', 'CE', 'PASAPORTE']).nullable(),
  role: z.enum(['USER', 'ADMIN']),
  currency: z.string(),
  locale: z.string(),
  timezone: z.string(),
  theme: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

/**
 * Type inference for profileOutputSchema
 */
export type ProfileOutput = z.infer<typeof profileOutputSchema>;
