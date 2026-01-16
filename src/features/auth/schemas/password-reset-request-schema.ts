import { z } from 'zod';

/**
 * Password reset request form validation schema
 */
export const passwordResetRequestSchema = z.object({
  email: z
    .string()
    .min(1, 'El correo electrónico es requerido')
    .email('Correo electrónico inválido')
    .toLowerCase()
    .trim(),
});

/**
 * Password reset request form data type
 */
export type PasswordResetRequestFormData = z.infer<typeof passwordResetRequestSchema>;
