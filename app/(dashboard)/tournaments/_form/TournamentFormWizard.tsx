'use client';

import { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'sonner';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { IonIcon } from '@/components/atoms/IonIcon';
import {
  tournamentFormSchema,
  STEP_FIELDS,
  COURTS_ONLY_STEP_FIELDS,
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
  mapFormToCourtsUpdateInput,
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
import { TOURNAMENT } from '@/lib/strings';
import { TournamentStatus } from '@/graphql/generated';

const SCHEDULE_VENUE_STEP = 2;

interface TournamentFormWizardProps {
  defaultValues?: TournamentFormData;
  isEditMode?: boolean;
  tournamentId?: string;
  tournamentStatus?: TournamentStatus;
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
  tournamentStatus,
}: TournamentFormWizardProps) {
  const router = useRouter();
  const isCourtsOnlyMode =
    isEditMode &&
    (tournamentStatus === TournamentStatus.RegistrationOpen ||
      tournamentStatus === TournamentStatus.RegistrationClosed);

  const [step, setStep] = useState(isCourtsOnlyMode ? SCHEDULE_VENUE_STEP : 0);
  const [direction, setDirection] = useState(0);
  const [createdTournamentId] = useState<string | undefined>(tournamentId);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(() =>
    isCourtsOnlyMode ? new Set([SCHEDULE_VENUE_STEP]) : new Set()
  );

  const effectiveTournamentId = createdTournamentId ?? tournamentId;

  const form = useForm<TournamentFormData>({
    resolver: zodResolver(tournamentFormSchema),
    defaultValues: defaultValues ?? DEFAULT_TOURNAMENT_FORM,
    mode: 'onTouched',
  });

  const { createCategory } = useCreateCategory(effectiveTournamentId ?? '', {});

  const { createTournament, loading: creating } = useCreateTournament({
    onSuccess: async (created) => {
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
    successMessage: isCourtsOnlyMode
      ? TOURNAMENT.SUCCESS_UPDATE_COURTS
      : TOURNAMENT.SUCCESS_UPDATE,
    onSuccess: () => router.push('/tournaments'),
  });

  const validateCurrentStep = useCallback(async () => {
    if (isCourtsOnlyMode && step === SCHEDULE_VENUE_STEP) {
      return form.trigger(COURTS_ONLY_STEP_FIELDS);
    }

    let fields = STEP_FIELDS[step];
    if (!fields || fields.length === 0) return true;

    if (isEditMode && step === 1) {
      fields = fields.filter((f) => f !== 'categories') as typeof fields;
      if (fields.length === 0) return true;
    }

    const result = await form.trigger(fields as (keyof TournamentFormData)[]);
    return result;
  }, [form, step, isEditMode, isCourtsOnlyMode]);

  const goToStep = useCallback(
    (target: number) => {
      if (isCourtsOnlyMode && target !== SCHEDULE_VENUE_STEP) return;
      setDirection(target > step ? 1 : -1);
      setStep(target);
    },
    [step, isCourtsOnlyMode]
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
    if (isCourtsOnlyMode) return;
    setDirection(-1);
    setStep((s) => Math.max(0, s - 1));
  }, [isCourtsOnlyMode]);

  const handleSaveDraft = useCallback(() => {
    const data = form.getValues();
    if (isEditMode && tournamentId) {
      if (isCourtsOnlyMode) {
        void updateTournament(mapFormToCourtsUpdateInput(tournamentId, data));
      } else {
        void updateTournament(mapFormToUpdateInput(tournamentId, data));
      }
    } else {
      void createTournament(mapFormToCreateInput(data));
    }
  }, [
    form,
    isEditMode,
    tournamentId,
    isCourtsOnlyMode,
    createTournament,
    updateTournament,
  ]);

  const handleSubmit = useCallback(async () => {
    if (isCourtsOnlyMode && isEditMode && tournamentId) {
      const valid = await form.trigger(COURTS_ONLY_STEP_FIELDS);
      if (!valid) {
        toast.error('Vui lòng kiểm tra lại các trường bắt buộc');
        return;
      }
      void updateTournament(
        mapFormToCourtsUpdateInput(tournamentId, form.getValues())
      );
      return;
    }

    for (let s = 0; s <= FORM_STEPS.length - 2; s++) {
      let fields = STEP_FIELDS[s];
      if (!fields || fields.length === 0) continue;

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
    isCourtsOnlyMode,
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

  const courtsOnlyBanner = useMemo(() => {
    if (!isCourtsOnlyMode) return null;
    return tournamentStatus === TournamentStatus.RegistrationOpen
      ? TOURNAMENT.COURTS_ONLY_MODE_BANNER_OPEN
      : TOURNAMENT.COURTS_ONLY_MODE_BANNER_CLOSED;
  }, [isCourtsOnlyMode, tournamentStatus]);

  const clickableSteps = useMemo(
    () => (isCourtsOnlyMode ? new Set([SCHEDULE_VENUE_STEP]) : undefined),
    [isCourtsOnlyMode]
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
        return (
          <StepScheduleVenue form={form} courtsOnlyMode={isCourtsOnlyMode} />
        );
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
  }, [step, form, goToStep, effectiveTournamentId, isCourtsOnlyMode]);

  return (
    <div className="mx-auto max-w-4xl">
      {courtsOnlyBanner && (
        <GlassPanel className="mb-4 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
          <p className="text-secondary flex items-start gap-2 text-sm">
            <IonIcon
              name="information-circle-outline"
              size="sm"
              className="mt-0.5 shrink-0 text-amber-500"
            />
            {courtsOnlyBanner}
          </p>
        </GlassPanel>
      )}

      <GlassPanel className="mb-6 rounded-xl p-4">
        <FormStepIndicator
          currentStep={step}
          completedSteps={completedSteps}
          onStepClick={handleStepClick}
          clickableSteps={clickableSteps}
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
            transition={{ duration: 0.25, ease: 'easeInOut' as const }}
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
            isCourtsOnlyMode={isCourtsOnlyMode}
            isSubmitting={creating || updating}
            submitLabel={TOURNAMENT.SAVE_COURTS_BUTTON}
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
