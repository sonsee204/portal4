/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 *
 * This source code is the intellectual property of Lê Trung Hiếu.
 * Unauthorized copying, modification, distribution, or use of this code
 * is strictly prohibited without prior written consent.
 */

'use client';

import { Modal } from '@/components/molecules/Modal';
import { Stepper } from '@/components/molecules/Stepper';
import { ConfirmDialog } from '@/components/molecules/ConfirmDialog';
import { TOURNAMENT } from '@/lib/strings';
import type { TournamentCategory } from '@/graphql/generated';
import {
  LATE_ENTRY_STEPS,
  useLateEntryModal,
} from '../_hooks/useLateEntryModal';
import { LateEntryCategoryStep } from './late-entry/LateEntryCategoryStep';
import { LateEntryFormStep } from './late-entry/LateEntryFormStep';
import { LateEntryConfirmStep } from './late-entry/LateEntryConfirmStep';
import { LateEntryResultStep } from './late-entry/LateEntryResultStep';

interface LateEntryModalProps {
  open: boolean;
  onClose: () => void;
  tournamentId: string;
  categories: TournamentCategory[];
  onSuccess?: () => void;
}

export function LateEntryModal({
  open,
  onClose,
  tournamentId,
  categories,
  onSuccess,
}: LateEntryModalProps) {
  const modal = useLateEntryModal({
    open,
    onClose,
    tournamentId,
    categories,
    onSuccess,
  });

  const {
    step,
    confirmOpen,
    setConfirmOpen,
    selectedCategory,
    preview,
    submitting,
    handleClose,
    handleSubmit,
  } = modal;

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        title={TOURNAMENT.LATE_ENTRY_TITLE}
        size="xl"
      >
        <div className="space-y-6">
          <Stepper steps={LATE_ENTRY_STEPS} currentStep={step} />

          {step === 0 && <LateEntryCategoryStep modal={modal} />}
          {step === 1 && <LateEntryFormStep modal={modal} />}
          {step === 2 && <LateEntryConfirmStep modal={modal} />}
          {step === 3 && <LateEntryResultStep modal={modal} />}
        </div>
      </Modal>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => void handleSubmit()}
        title={TOURNAMENT.LATE_ENTRY_CONFIRM_TITLE}
        description={
          selectedCategory && preview
            ? TOURNAMENT.LATE_ENTRY_CONFIRM_DESC(
                selectedCategory.title,
                preview.eligibleByeMatchCount
              )
            : ''
        }
        confirmLabel="Thêm muộn"
        loading={submitting}
        variant="warning"
      />
    </>
  );
}
