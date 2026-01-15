'use client';

import { AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import type { IdentityVerificationFormData } from '@/features/onboarding/schemas/identity-verification-schema';
import type { PersonalInfoFormData } from '@/features/onboarding/schemas/personal-info-schema';

import { IdentityVerificationStep } from '@/features/onboarding/components/identity-verification-step';
import { PersonalInfoStep } from '@/features/onboarding/components/personal-info-step';
import { ProgressIndicator } from '@/features/onboarding/components/progress-indicator';

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
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Form data storage (in production, this would be persisted)
  const [personalInfo, setPersonalInfo] = useState<PersonalInfoFormData | null>(null);

  // Step 1: Personal Info Handler
  const handlePersonalInfoSubmit = async (data: PersonalInfoFormData) => {
    setIsLoading(true);
    try {
      // TODO: Save to backend via tRPC
      console.log('Personal info:', data);
      setPersonalInfo(data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Move to next step
      setCurrentStep(1);
    } catch (error) {
      console.error('Failed to save personal info:', error);
      // TODO: Show error toast
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Identity Verification Handler
  const handleIdentityVerificationSubmit = async (data: IdentityVerificationFormData) => {
    setIsLoading(true);
    try {
      // TODO: Save to backend via tRPC
      console.log('Identity verification:', data);
      console.log('Complete onboarding data:', { ...personalInfo, ...data });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // TODO: Update user verification status in backend
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Failed to complete verification:', error);
      // TODO: Show error toast
    } finally {
      setIsLoading(false);
    }
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
        {/* Progress Indicator */}
        <ProgressIndicator steps={ONBOARDING_STEPS} currentStep={currentStep} />

        {/* Step Content */}
        <div className="bg-card rounded-lg border p-6 shadow-sm sm:p-8">
          <AnimatePresence mode="wait">
            {currentStep === 0 && (
              <PersonalInfoStep
                key="personal-info"
                onSubmit={handlePersonalInfoSubmit}
                isLoading={isLoading}
                defaultValues={personalInfo || undefined}
              />
            )}

            {currentStep === 1 && (
              <IdentityVerificationStep
                key="identity"
                onSubmit={handleIdentityVerificationSubmit}
                onBack={handleBack}
                isLoading={isLoading}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Skip Link (Optional) */}
        <div className="text-center">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-muted-foreground hover:text-foreground cursor-pointer text-sm transition-colors"
          >
            Completar más tarde →
          </button>
        </div>
      </div>
    </div>
  );
}
