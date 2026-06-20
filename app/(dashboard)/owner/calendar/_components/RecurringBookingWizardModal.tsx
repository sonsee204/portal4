/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 */

'use client';

import { Button } from '@/components/atoms/Button';
import { Modal } from '@/components/molecules/Modal';
import { Stepper } from '@/components/molecules/Stepper';
import type { OwnerCalendarPageData } from '../_hooks/useOwnerCalendarPageData';
import type { OwnerCalendarRecurringFlow } from '../_hooks/useOwnerCalendarRecurringFlow';
import { RecurringConfirmStep } from './RecurringConfirmStep';
import { RecurringSetupStep } from './RecurringSetupStep';

interface RecurringBookingWizardModalProps {
  open: boolean;
  onClose: () => void;
  data: OwnerCalendarPageData;
  flow: OwnerCalendarRecurringFlow;
}

export function RecurringBookingWizardModal({
  open,
  onClose,
  data,
  flow,
}: RecurringBookingWizardModalProps) {
  const isSetup = flow.step === 0;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Lịch cố định"
      size="xl"
      footer={
        <>
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={flow.creatingRecurring}
          >
            Hủy
          </Button>
          {isSetup ? (
            <>
              {flow.availabilityResult &&
              !flow.availabilityResult.allAvailable &&
              flow.availabilityResult.availableDates.length > 0 ? (
                <Button
                  variant="outline"
                  disabled={flow.checkingAvailability}
                  onClick={flow.handleContinueWithAvailable}
                >
                  Tiếp tục với ngày khả dụng
                </Button>
              ) : null}
              <Button
                disabled={
                  flow.checkingAvailability || flow.selectedDays.length === 0
                }
                onClick={() => void flow.handleCheckAvailability()}
              >
                {flow.checkingAvailability ? 'Đang kiểm tra…' : 'Tiếp tục'}
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                onClick={() => flow.setStep(0)}
                disabled={flow.creatingRecurring}
              >
                Quay lại
              </Button>
              <Button
                disabled={!flow.canSubmit || flow.creatingRecurring}
                onClick={() => void flow.handleSubmit()}
              >
                {flow.creatingRecurring ? 'Đang đặt…' : 'Xác nhận lịch cố định'}
              </Button>
            </>
          )}
        </>
      }
    >
      <Stepper
        steps={[...flow.steps]}
        currentStep={flow.step}
        className="mb-6"
      />
      {isSetup ? (
        <RecurringSetupStep data={data} flow={flow} />
      ) : (
        <RecurringConfirmStep flow={flow} />
      )}
    </Modal>
  );
}
