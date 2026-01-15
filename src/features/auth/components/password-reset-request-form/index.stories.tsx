import type { Meta, StoryObj } from '@storybook/react';
import { PasswordResetRequestForm } from './index';

const meta = {
  title: 'Auth/Forms/PasswordResetRequestForm',
  component: PasswordResetRequestForm,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-full max-w-md">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PasswordResetRequestForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onSubmit: (data) => console.log('Password reset requested:', data),
    isLoading: false,
    isSuccess: false,
  },
};

export const Loading: Story = {
  args: {
    onSubmit: (data) => console.log('Password reset requested:', data),
    isLoading: true,
    isSuccess: false,
  },
};

export const Success: Story = {
  args: {
    onSubmit: (data) => console.log('Password reset requested:', data),
    isLoading: false,
    isSuccess: true,
  },
};
