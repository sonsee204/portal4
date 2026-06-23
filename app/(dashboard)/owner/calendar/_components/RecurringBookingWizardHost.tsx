/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 */

'use client';

import type { OwnerCalendarPageData } from '../_hooks/useOwnerCalendarPageData';
import { useOwnerCalendarRecurringFlow } from '../_hooks/useOwnerCalendarRecurringFlow';
import { RecurringBookingWizardModal } from './RecurringBookingWizardModal';

interface RecurringBookingWizardHostProps {
  open: boolean;
  onClose: () => void;
  data: OwnerCalendarPageData;
}

function RecurringBookingWizardActive({
  onClose,
  data,
}: Omit<RecurringBookingWizardHostProps, 'open'>) {
  const flow = useOwnerCalendarRecurringFlow(data);

  return (
    <RecurringBookingWizardModal
      open
      onClose={onClose}
      data={data}
      flow={flow}
    />
  );
}

export function RecurringBookingWizardHost({
  open,
  onClose,
  data,
}: RecurringBookingWizardHostProps) {
  if (!open) {
    return null;
  }

  const resetKey = [
    data.dateStr,
    ...data.selectedSlots.map(
      (slot) =>
        `${slot.courtId}:${slot.startTime}-${slot.endTime}:${slot.price}`
    ),
  ].join('|');

  return (
    <RecurringBookingWizardActive
      key={resetKey}
      onClose={onClose}
      data={data}
    />
  );
}
