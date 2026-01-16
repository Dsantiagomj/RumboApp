'use client';

import { AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import type { IdentityVerificationFormData } from '@/features/onboarding/schemas/identity-verification-schema';
import type { PersonalInfoFormData } from '@/features/onboarding/schemas/personal-info-schema';

import { IdentityVerificationStep } from '@/features/onboarding/components/identity-verification-step';
import { PersonalInfoStep } from '@/features/onboarding/components/personal-info-step';
import { ProgressIndicator } from '@/features/onboarding/components/progress-indicator';
import { SuccessStep } from '@/features/onboarding/components/success-step';
import { WelcomeStep } from '@/features/onboarding/components/welcome-step';
import { trpc } from '@/lib/trpc/react';

const ONBOARDING_STEPS = [
  {
    id: 'personal-info',
    label: 'Info Personal',
    description: 'Datos básicos',
  },
  {
    id: 'identity',
    label: 'Verificación',
    description: 'Confirma tu identidad',
  },
];

/**
 * OnboardingClient Component
 */
export function OnboardingClient() {
  const router = useRouter();
  const { data: session, update } = useSession();
  const [currentStep, setCurrentStep] = useState(0);

  // Form data storage
  const [personalInfo, setPersonalInfo] = useState<PersonalInfoFormData | null>(null);

  // tRPC mutations
  const savePersonalInfo = trpc.onboarding.savePersonalInfo.useMutation();
  const completeIdentityVerification = trpc.onboarding.completeIdentityVerification.useMutation();

  // Step 0: Welcome Handler
  const handleWelcomeStart = () => {
    setCurrentStep(1);
  };

  // Step 1: Personal Info Handler
  const handlePersonalInfoSubmit = async (data: PersonalInfoFormData) => {
    try {
      // Save to backend
      await savePersonalInfo.mutateAsync({
        dateOfBirth: data.dateOfBirth.toISOString(),
        phoneNumber: data.phoneNumber,
      });

      // Store for display
      setPersonalInfo(data);

      // Move to next step
      setCurrentStep(2);
    } catch (error) {
      console.error('Failed to save personal info:', error);
      // Error is handled by tRPC error boundary
    }
  };

  // Step 2: Identity Verification Handler
  const handleIdentityVerificationSubmit = async (data: IdentityVerificationFormData) => {
    try {
      // Complete onboarding
      const result = await completeIdentityVerification.mutateAsync({
        documentType: data.documentType,
        documentNumber: data.documentNumber,
      });

      // Update session with onboarding completion timestamp
      await update({
        onboardingCompletedAt: result.onboardingCompletedAt.toISOString(),
      });

      // Move to success screen
      setCurrentStep(3);
    } catch (error) {
      console.error('Failed to complete verification:', error);
      // Error is handled by tRPC error boundary
    }
  };

  // Step 3: Success Handler
  const handleSuccessContinue = () => {
    router.push('/dashboard');
  };

  // Back button handler
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-2xl space-y-8">
        {/* Progress Indicator - Hide on Welcome and Success screens */}
        {currentStep > 0 && currentStep < 3 && (
          <ProgressIndicator steps={ONBOARDING_STEPS} currentStep={currentStep - 1} />
        )}

        {/* Step Content */}
        <div className="bg-card rounded-lg border p-6 shadow-sm sm:p-8">
          <AnimatePresence mode="wait">
            {/* Welcome Screen */}
            {currentStep === 0 && <WelcomeStep key="welcome" onStart={handleWelcomeStart} />}

            {/* Personal Info */}
            {currentStep === 1 && (
              <PersonalInfoStep
                key="personal-info"
                onSubmit={handlePersonalInfoSubmit}
                isLoading={savePersonalInfo.isPending}
                defaultValues={personalInfo || undefined}
              />
            )}

            {/* Identity Verification */}
            {currentStep === 2 && (
              <IdentityVerificationStep
                key="identity"
                onSubmit={handleIdentityVerificationSubmit}
                onBack={handleBack}
                isLoading={completeIdentityVerification.isPending}
              />
            )}

            {/* Success Screen */}
            {currentStep === 3 && (
              <SuccessStep
                key="success"
                userName={session?.user?.name || undefined}
                onContinue={handleSuccessContinue}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
