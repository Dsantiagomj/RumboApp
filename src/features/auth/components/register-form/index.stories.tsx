import type { Meta, StoryObj } from '@storybook/react';
import { RegisterForm } from './index';

const meta = {
  title: 'Auth/Forms/RegisterForm',
  component: RegisterForm,
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
} satisfies Meta<typeof RegisterForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onSubmit: (data) => console.log('Register submitted:', data),
    onGoogleClick: () => console.log('Google OAuth clicked'),
    onAppleClick: () => console.log('Apple OAuth clicked'),
    isLoading: false,
  },
};

export const Loading: Story = {
  args: {
    onSubmit: (data) => console.log('Register submitted:', data),
    onGoogleClick: () => console.log('Google OAuth clicked'),
    onAppleClick: () => console.log('Apple OAuth clicked'),
    isLoading: true,
  },
};

export const WithoutSocialAuth: Story = {
  args: {
    onSubmit: (data) => console.log('Register submitted:', data),
    isLoading: false,
  },
};

export const GoogleOnly: Story = {
  args: {
    onSubmit: (data) => console.log('Register submitted:', data),
    onGoogleClick: () => console.log('Google OAuth clicked'),
    isLoading: false,
  },
};
