import type { Meta, StoryObj } from '@storybook/react';
import { LoginForm } from './index';

const meta = {
  title: 'Auth/Forms/LoginForm',
  component: LoginForm,
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
} satisfies Meta<typeof LoginForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onSubmit: (data) => console.log('Login submitted:', data),
    onGoogleClick: () => console.log('Google OAuth clicked'),
    onAppleClick: () => console.log('Apple OAuth clicked'),
    isLoading: false,
  },
};

export const Loading: Story = {
  args: {
    onSubmit: (data) => console.log('Login submitted:', data),
    onGoogleClick: () => console.log('Google OAuth clicked'),
    onAppleClick: () => console.log('Apple OAuth clicked'),
    isLoading: true,
  },
};

export const WithoutSocialAuth: Story = {
  args: {
    onSubmit: (data) => console.log('Login submitted:', data),
    isLoading: false,
  },
};

export const GoogleOnly: Story = {
  args: {
    onSubmit: (data) => console.log('Login submitted:', data),
    onGoogleClick: () => console.log('Google OAuth clicked'),
    isLoading: false,
  },
};
