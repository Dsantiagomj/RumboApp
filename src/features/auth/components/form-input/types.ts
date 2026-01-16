import type { InputHTMLAttributes } from 'react';

/**
 * Form input props
 */
export interface FormInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> {
  /**
   * Input label
   */
  label?: string;

  /**
   * Error message to display
   */
  error?: string;

  /**
   * Success state
   */
  success?: boolean;

  /**
   * Helper text to display below input
   */
  helperText?: string;

  /**
   * Show required asterisk
   */
  showRequired?: boolean;
}
