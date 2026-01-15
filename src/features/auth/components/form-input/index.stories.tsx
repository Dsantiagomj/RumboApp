import type { Meta, StoryObj } from '@storybook/react';
import { FormInput } from './index';

const meta = {
  title: 'Auth/Form Inputs/FormInput',
  component: FormInput,
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
} satisfies Meta<typeof FormInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: 'email',
    type: 'email',
    label: 'Email Address',
    placeholder: 'your@email.com',
  },
};

export const WithValue: Story = {
  args: {
    id: 'email',
    type: 'email',
    label: 'Email Address',
    placeholder: 'your@email.com',
    defaultValue: 'john.doe@example.com',
  },
};

export const WithError: Story = {
  args: {
    id: 'email',
    type: 'email',
    label: 'Email Address',
    placeholder: 'your@email.com',
    error: 'Please enter a valid email address',
  },
};

export const Required: Story = {
  args: {
    id: 'email',
    type: 'email',
    label: 'Email Address',
    placeholder: 'your@email.com',
    showRequired: true,
  },
};

export const Disabled: Story = {
  args: {
    id: 'email',
    type: 'email',
    label: 'Email Address',
    placeholder: 'your@email.com',
    disabled: true,
    defaultValue: 'john.doe@example.com',
  },
};

export const WithHelperText: Story = {
  args: {
    id: 'email',
    type: 'email',
    label: 'Email Address',
    placeholder: 'your@email.com',
    helperText: 'We will never share your email with anyone',
  },
};

export const PhoneNumber: Story = {
  args: {
    id: 'phone',
    type: 'tel',
    label: 'Phone Number',
    placeholder: '+57 300 123 4567',
    helperText: 'Include country code',
    showRequired: true,
  },
};

export const DateOfBirth: Story = {
  args: {
    id: 'dob',
    type: 'date',
    label: 'Date of Birth',
    showRequired: true,
    helperText: 'You must be 18 or older',
  },
};
