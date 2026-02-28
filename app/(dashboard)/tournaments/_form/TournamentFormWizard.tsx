'use client';

import { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'sonner';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import {
  tournamentFormSchema,
  STEP_FIELDS,
  FORM_STEPS,
  DEFAULT_TOURNAMENT_FORM,
  type TournamentFormData,
} from '@/types/tournament-form';
import {
  useCreateTournament,
  useUpdateTournament,
  useCreateCategory,
} from '@/hooks/tournament';
import {
  mapFormToCreateInput,
  mapFormToUpdateInput,
  mapCategoryEntryToInput,
} from './_utils/mapFormToInput';
import { FormStepIndicator } from './FormStepIndicator';
import { FormActions } from './FormActions';
import { StepBasicInfo } from './_steps/StepBasicInfo';
import { StepCategories } from './_steps/StepCategories';
import { StepScheduleVenue } from './_steps/StepScheduleVenue';
import { StepRulesPrizes } from './_steps/StepRulesPrizes';
import { StepRegistration } from './_steps/StepRegistration';
import { StepReview } from './_steps/StepReview';

interface TournamentFormWizardProps {
  defaultValues?: TournamentFormData;
  isEditMode?: boolean;
  tournamentId?: string;
}

const stepVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 60 : -60,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction > 0 ? -60 : 60,
    opacity: 0,
  }),
};

export function TournamentFormWizard({
  defaultValues,
  isEditMode = false,
  tournamentId,
}: TournamentFormWizardProps) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const [createdTournamentId] = useState<string | undefined>(tournamentId);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(
    () => new Set()
  );

  const effectiveTournamentId = createdTournamentId ?? tournamentId;

  const form = useForm<TournamentFormData>({
    resolver: zodResolver(tournamentFormSchema),
    defaultValues: defaultValues ?? DEFAULT_TOURNAMENT_FORM,
    mode: 'onTouched',
  });

  // Category creation is used after tournament is created in create-mode
  const { createCategory } = useCreateCategory(effectiveTournamentId ?? '', {});

  const { createTournament, loading: creating } = useCreateTournament({
    onSuccess: async (created) => {
      // After tournament is created, create queued categories then navigate
      const data = form.getValues();
      const validCategories = data.categories.filter((c) => c.title.trim());
      if (validCategories.length > 0 && created?._id) {
        const sport = data.sport;
        await Promise.all(
          validCategories.map((entry) =>
            createCategory(mapCategoryEntryToInput(entry, created._id, sport))
          )
        );
      }
      router.push('/tournaments');
    },
  });

  const { updateTournament, loading: updating } = useUpdateTournament({
    onSuccess: () => router.push('/tournaments'),
  });

  const validateCurrentStep = useCallback(async () => {
    let fields = STEP_FIELDS[step];
    if (!fields || fields.length === 0) return true;

    // In edit mode, categories are managed directly via API (not form state)
    // so skip form validation for the categories field
    if (isEditMode && step === 1) {
      fields = fields.filter((f) => f !== 'categories') as typeof fields;
      if (fields.length === 0) return true;
    }

    const result = await form.trigger(fields as (keyof TournamentFormData)[]);
    return result;
  }, [form, step, isEditMode]);

  const goToStep = useCallback(
    (target: number) => {
      setDirection(target > step ? 1 : -1);
      setStep(target);
    },
    [step]
  );

  const handleNext = useCallback(async () => {
    const valid = await validateCurrentStep();
    if (!valid) {
      toast.error('Vui lòng kiểm tra lại các trường bắt buộc');
      return;
    }
    setCompletedSteps((prev) => new Set([...prev, step]));
    setDirection(1);
    setStep((s) => Math.min(FORM_STEPS.length - 1, s + 1));
  }, [step, validateCurrentStep]);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setStep((s) => Math.max(0, s - 1));
  }, []);

  const handleSaveDraft = useCallback(() => {
    const data = form.getValues();
    if (isEditMode && tournamentId) {
      void updateTournament(mapFormToUpdateInput(tournamentId, data));
    } else {
      void createTournament(mapFormToCreateInput(data));
    }
  }, [form, isEditMode, tournamentId, createTournament, updateTournament]);

  const handleSubmit = useCallback(async () => {
    // Validate all steps in sequence using the same exceptions as validateCurrentStep.
    // This avoids full-schema validation which fails in edit mode (categories: []).
    for (let s = 0; s <= FORM_STEPS.length - 2; s++) {
      let fields = STEP_FIELDS[s];
      if (!fields || fields.length === 0) continue;

      // In edit mode, categories are managed via API — skip form validation
      if (isEditMode && s === 1) {
        fields = fields.filter((f) => f !== 'categories') as typeof fields;
        if (fields.length === 0) continue;
      }

      const valid = await form.trigger(fields as (keyof TournamentFormData)[]);
      if (!valid) {
        toast.error('Vui lòng kiểm tra lại các trường bắt buộc');
        goToStep(s);
        return;
      }
    }

    const data = form.getValues();
    if (isEditMode && tournamentId) {
      void updateTournament(mapFormToUpdateInput(tournamentId, data));
    } else {
      void createTournament(mapFormToCreateInput(data));
    }
  }, [
    form,
    isEditMode,
    tournamentId,
    createTournament,
    updateTournament,
    goToStep,
  ]);

  const handleStepClick = useCallback(
    (target: number) => {
      goToStep(target);
    },
    [goToStep]
  );

  const currentStepContent = useMemo(() => {
    switch (step) {
      case 0:
        return (
          <StepBasicInfo form={form} tournamentId={effectiveTournamentId} />
        );
      case 1:
        return (
          <StepCategories form={form} tournamentId={effectiveTournamentId} />
        );
      case 2:
        return <StepScheduleVenue form={form} />;
      case 3:
        return <StepRulesPrizes form={form} />;
      case 4:
        return (
          <StepRegistration form={form} tournamentId={effectiveTournamentId} />
        );
      case 5:
        return (
          <StepReview
            form={form}
            onGoToStep={goToStep}
            tournamentId={effectiveTournamentId}
          />
        );
      default:
        return null;
    }
  }, [step, form, goToStep, effectiveTournamentId]);

  return (
    <div className="mx-auto max-w-4xl">
      <GlassPanel className="mb-6 rounded-xl p-4">
        <FormStepIndicator
          currentStep={step}
          completedSteps={completedSteps}
          onStepClick={handleStepClick}
        />
      </GlassPanel>

      <div className="relative min-h-[400px] overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            {currentStepContent}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-6">
        <GlassPanel card>
          <FormActions
            currentStep={step}
            isEditMode={isEditMode}
            isSubmitting={creating || updating}
            onPrev={handlePrev}
            onNext={handleNext}
            onSaveDraft={handleSaveDraft}
            onSubmit={handleSubmit}
          />
        </GlassPanel>
      </div>
    </div>
  );
}
