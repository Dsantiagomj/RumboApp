import type { Meta, StoryObj } from '@storybook/react';
import { PasswordResetForm } from './index';

const meta = {
  title: 'Auth/Forms/PasswordResetForm',
  component: PasswordResetForm,
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
} satisfies Meta<typeof PasswordResetForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onSubmit: (data) => console.log('Password reset:', data),
    isLoading: false,
    isSuccess: false,
  },
};

export const Loading: Story = {
  args: {
    onSubmit: (data) => console.log('Password reset:', data),
    isLoading: true,
    isSuccess: false,
  },
};

export const Success: Story = {
  args: {
    onSubmit: (data) => console.log('Password reset:', data),
    isLoading: false,
    isSuccess: true,
  },
};
