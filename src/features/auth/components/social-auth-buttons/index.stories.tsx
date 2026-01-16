import type { Meta, StoryObj } from '@storybook/react';
import { SocialAuthButtons } from './index';

const meta = {
  title: 'Auth/SocialAuthButtons',
  component: SocialAuthButtons,
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
} satisfies Meta<typeof SocialAuthButtons>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onGoogleClick: () => console.log('Google clicked'),
    onAppleClick: () => console.log('Apple clicked'),
  },
};

export const Loading: Story = {
  args: {
    onGoogleClick: () => console.log('Google clicked'),
    onAppleClick: () => console.log('Apple clicked'),
    isLoading: true,
  },
};

export const GoogleOnly: Story = {
  args: {
    onGoogleClick: () => console.log('Google clicked'),
  },
};

export const AppleOnly: Story = {
  args: {
    onAppleClick: () => console.log('Apple clicked'),
  },
};
