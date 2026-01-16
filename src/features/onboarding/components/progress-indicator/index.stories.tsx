import type { Meta, StoryObj } from '@storybook/react';
import { ProgressIndicator } from './index';

const meta = {
  title: 'Onboarding/ProgressIndicator',
  component: ProgressIndicator,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-full max-w-2xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ProgressIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockSteps = [
  {
    id: 'personal-info',
    label: 'Personal Info',
    description: 'Basic details',
  },
  {
    id: 'identity',
    label: 'Identity',
    description: 'Verify your identity',
  },
  {
    id: 'preferences',
    label: 'Preferences',
    description: 'Set your preferences',
  },
];

export const FirstStep: Story = {
  args: {
    steps: mockSteps,
    currentStep: 0,
  },
};

export const SecondStep: Story = {
  args: {
    steps: mockSteps,
    currentStep: 1,
  },
};

export const LastStep: Story = {
  args: {
    steps: mockSteps,
    currentStep: 2,
  },
};

export const TwoSteps: Story = {
  args: {
    steps: mockSteps.slice(0, 2),
    currentStep: 0,
  },
};

export const TwoStepsCompleted: Story = {
  args: {
    steps: mockSteps.slice(0, 2),
    currentStep: 1,
  },
};
