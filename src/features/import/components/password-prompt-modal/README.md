# PasswordPromptModal

A modal component for prompting users to enter a password to unlock password-protected Excel files during the import process.

## Features

- **Conditional UI**: Shows different messages based on whether the user has a Colombian ID configured
- **Auto-unlock hint**: For users with Colombian ID, shows a hint that the system will try their ID first
- **Onboarding prompt**: For users without Colombian ID, shows a banner to complete their profile for automatic unlock
- **Error handling**: Displays error messages with shake animation when password is incorrect
- **Loading states**: Shows spinner during password verification
- **Animations**: Smooth Framer Motion animations for modal entrance/exit and error states
- **Accessibility**: Proper ARIA labels and keyboard navigation support

## Usage

```tsx
import { PasswordPromptModal } from '@/features/import/components/password-prompt-modal';

function ImportPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userHasColombianId, setUserHasColombianId] = useState(false);

  const handlePasswordSubmit = async (password: string) => {
    try {
      await decryptFile(fileName, password);
      setIsModalOpen(false);
    } catch (error) {
      throw new Error('Contraseña incorrecta');
    }
  };

  return (
    <PasswordPromptModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      onSubmit={handlePasswordSubmit}
      userHasColombianId={userHasColombianId}
      fileName="extracto_bancario.xlsx"
    />
  );
}
```

## Props

| Prop                 | Type                                  | Required | Description                                                                    |
| -------------------- | ------------------------------------- | -------- | ------------------------------------------------------------------------------ |
| `isOpen`             | `boolean`                             | Yes      | Controls modal visibility                                                      |
| `onClose`            | `() => void`                          | Yes      | Called when user clicks cancel or backdrop                                     |
| `onSubmit`           | `(password: string) => Promise<void>` | Yes      | Called when user submits password. Should throw error if password is incorrect |
| `userHasColombianId` | `boolean`                             | Yes      | Whether user has Colombian ID configured                                       |
| `fileName`           | `string`                              | Yes      | Name of the file being unlocked (displayed to user)                            |

## Behavior

### With Colombian ID (`userHasColombianId: true`)

Shows a hint message:

> "Intentaremos con tu cédula primero. Si no funciona, podrás ingresar otra contraseña."

### Without Colombian ID (`userHasColombianId: false`)

Shows a call-to-action banner with:

- Title: "Desbloqueo Automático"
- Description explaining automatic unlock with Colombian ID
- "Completar Perfil" button that navigates to `/onboarding`

### Error Handling

When `onSubmit` throws an error:

1. Error message is displayed below the password input
2. Error container has a shake animation
3. User can try again with a different password
4. Error clears when user starts typing

### Loading State

While `onSubmit` is executing:

1. Submit button shows spinner and "Desbloqueando..." text
2. Both buttons are disabled
3. Password input is disabled
4. Modal cannot be closed by clicking backdrop

## Animations

- **Modal entrance**: Fade in with scale and slide up
- **Modal exit**: Fade out with scale and slide down
- **Error message**: Fade in with shake animation (horizontal oscillation)
- **Buttons**: Scale on hover/tap
- **Shimmer effect**: On submit button hover

## Styling

The component uses Tailwind CSS classes and follows the existing design system:

- Primary purple gradient buttons
- Consistent border and background colors
- Responsive spacing and typography
- Dark theme support via CSS variables

## Accessibility

- Proper ARIA labels on input and error messages
- Form validation with required fields
- Keyboard navigation support
- Focus management (auto-focus on password input)
- Screen reader friendly error announcements

## Related Components

- `Spinner` - Loading indicator
- Icons from `lucide-react`: `Lock`, `AlertCircle`, `ExternalLink`
- `motion` from `framer-motion` for animations
