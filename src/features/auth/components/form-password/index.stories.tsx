import type { Meta, StoryObj } from '@storybook/react';
import { FormPassword } from './index';

const meta = {
  title: 'Auth/Form Inputs/FormPassword',
  component: FormPassword,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FormPassword>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: 'password',
    label: 'Password',
    placeholder: '••••••••',
  },
};

export const WithValue: Story = {
  args: {
    id: 'password',
    label: 'Password',
    placeholder: '••••••••',
    defaultValue: 'MySecurePassword123',
  },
};

export const WithError: Story = {
  args: {
    id: 'password',
    label: 'Password',
    placeholder: '••••••••',
    error: 'Password must be at least 8 characters',
  },
};

export const Required: Story = {
  args: {
    id: 'password',
    label: 'Password',
    placeholder: '••••••••',
    showRequired: true,
  },
};

export const Disabled: Story = {
  args: {
    id: 'password',
    label: 'Password',
    placeholder: '••••••••',
    disabled: true,
    defaultValue: 'MyPassword123',
  },
};

export const WithHelperText: Story = {
  args: {
    id: 'password',
    label: 'Password',
    placeholder: '••••••••',
    helperText: 'Must contain at least one uppercase, lowercase, and number',
    showRequired: true,
  },
};

export const NewPassword: Story = {
  args: {
    id: 'newPassword',
    label: 'New Password',
    placeholder: '••••••••',
    autoComplete: 'new-password',
    helperText: 'Minimum 8 characters, one uppercase, one lowercase, one number',
    showRequired: true,
  },
};

export const ConfirmPassword: Story = {
  args: {
    id: 'confirmPassword',
    label: 'Confirm Password',
    placeholder: '••••••••',
    autoComplete: 'new-password',
    showRequired: true,
  },
};
