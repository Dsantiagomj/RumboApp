import { z } from 'zod';

/**
 * Login form validation schema
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'El correo electrónico es requerido')
    .email('Correo electrónico inválido')
    .toLowerCase()
    .trim(),

  password: z.string().min(1, 'La contraseña es requerida'),
});

/**
 * Login form data type
 */
export type LoginFormData = z.infer<typeof loginSchema>;
