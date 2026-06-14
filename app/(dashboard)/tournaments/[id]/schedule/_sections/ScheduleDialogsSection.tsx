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

import { MatchCorrectionModal } from '../_components/MatchCorrectionModal';
import { RepackCourtScheduleDialog } from '../_components/RepackCourtScheduleDialog';
import { CascadeRescheduleDialog } from '../_components/CascadeRescheduleDialog';
import { calendarKeyFromIso } from '../_hooks/schedule-page.derived';
import type { SchedulePageActions } from '../_hooks/useScheduleActions';
import type { SchedulePageData } from '../_hooks/useScheduleData';

interface ScheduleDialogsSectionProps {
  data: SchedulePageData;
  actions: SchedulePageActions;
}

export function ScheduleDialogsSection({
  data,
  actions,
}: ScheduleDialogsSectionProps) {
  const {
    correctionMatch,
    setCorrectionMatch,
    repackAnchor,
    repackOpen,
    setRepackOpen,
    repackPreview,
    cascadeAnchor,
    cascadeOpen,
    setCascadeOpen,
    matches,
    refetch,
  } = data;
  const {
    repackPreviewData,
    repackPreviewLoading,
    repackPreviewQueryError,
    repackOverdueMatchIds,
    repacking,
    cascading,
    handleRepackConfirm,
    handleCascadeConfirm,
  } = actions;

  return (
    <>
      <MatchCorrectionModal
        match={correctionMatch}
        onClose={() => setCorrectionMatch(null)}
        onSuccess={() => void refetch()}
      />

      <RepackCourtScheduleDialog
        open={repackOpen}
        anchorMatch={repackAnchor}
        courtName={repackAnchor?.court?.name ?? ''}
        calendarDate={
          repackAnchor?.scheduledAt
            ? calendarKeyFromIso(repackAnchor.scheduledAt)
            : ''
        }
        previewRows={repackPreviewData?.preview}
        overdueCount={repackPreviewData?.overdueCount ?? 0}
        overdueMatchIds={repackOverdueMatchIds}
        previewLoading={repackPreviewLoading}
        previewError={repackPreviewQueryError?.message ?? null}
        onClose={() => setRepackOpen(false)}
        onConfirm={handleRepackConfirm}
        loading={repacking}
        lastPreview={repackPreview}
      />

      <CascadeRescheduleDialog
        open={cascadeOpen}
        anchorMatch={cascadeAnchor}
        allMatches={matches}
        onConfirm={handleCascadeConfirm}
        onDismiss={() => setCascadeOpen(false)}
        loading={cascading}
      />
    </>
  );
}
