'use client';

import { Button } from '@/components/atoms/Button';
import { FORM_STEPS } from '@/types/tournament-form';

interface FormActionsProps {
  currentStep: number;
  isEditMode: boolean;
  isSubmitting?: boolean;
  onPrev: () => void;
  onNext: () => void;
  onSaveDraft: () => void;
  onSubmit: () => void;
}

export function FormActions({
  currentStep,
  isEditMode,
  isSubmitting = false,
  onPrev,
  onNext,
  onSaveDraft,
  onSubmit,
}: FormActionsProps) {
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === FORM_STEPS.length - 1;

  return (
    <div className="flex items-center justify-between pt-2">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          disabled={isFirstStep}
          onClick={onPrev}
          iconLeft="arrow-back-outline"
        >
          Quay lại
        </Button>

        {!isLastStep && (
          <Button
            variant="outline"
            size="sm"
            onClick={onSaveDraft}
            disabled={isSubmitting}
            iconLeft="bookmark-outline"
            className="hidden sm:inline-flex"
          >
            Lưu nháp
          </Button>
        )}
      </div>

      <div>
        {isLastStep ? (
          <Button
            size="sm"
            onClick={onSubmit}
            disabled={isSubmitting}
            iconLeft={isEditMode ? 'save-outline' : 'checkmark-outline'}
          >
            {isSubmitting
              ? 'Đang xử lý...'
              : isEditMode
                ? 'Lưu thay đổi'
                : 'Tạo giải đấu'}
          </Button>
        ) : (
          <Button size="sm" onClick={onNext} iconRight="arrow-forward-outline">
            Tiếp theo
          </Button>
        )}
      </div>
    </div>
  );
}
