/**
 * Personal Information schema
 *
 * Validation for step 1 of onboarding: basic personal details
 */

import { z } from 'zod';

/**
 * Personal info validation schema
 */
export const personalInfoSchema = z.object({
  dateOfBirth: z.coerce
    .date()
    .refine((date) => {
      const age = new Date().getFullYear() - date.getFullYear();
      return age >= 18;
    }, 'Debes ser mayor de 18 años')
    .refine((date) => {
      const age = new Date().getFullYear() - date.getFullYear();
      return age <= 120;
    }, 'Fecha de nacimiento inválida'),

  phoneNumber: z
    .string()
    .min(1, 'El número de teléfono es requerido')
    .regex(/^\+?[0-9]{10,15}$/, 'Número de teléfono inválido (10-15 dígitos)'),
});

/**
 * Personal info form data type
 */
export type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;
