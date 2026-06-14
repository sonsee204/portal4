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

import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Select } from '@/components/atoms/Select';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import type { SchedulePageActions } from '../_hooks/useScheduleActions';
import type { SchedulePageData } from '../_hooks/useScheduleData';

interface ScheduleFormSectionProps {
  data: SchedulePageData;
  actions: SchedulePageActions;
}

export function ScheduleFormSection({
  data,
  actions,
}: ScheduleFormSectionProps) {
  const {
    scheduleDate,
    setScheduleDate,
    scheduleCourt,
    setScheduleCourt,
    courtOptions,
  } = data;
  const { isActionLoading, closeScheduleForm, handleScheduleSubmit } = actions;

  return (
    <GlassPanel card className="mt-4">
      <h3 className="text-heading mb-4 text-sm font-semibold">
        Lên lịch trận đấu
      </h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Thời gian (YYYY-MM-DDTHH:mm)"
          value={scheduleDate}
          onChange={(e) => setScheduleDate(e.target.value)}
          placeholder="2026-06-15T08:00"
        />
        {courtOptions.length > 0 ? (
          <Select
            label="Sân thi đấu"
            value={scheduleCourt}
            onChange={(e) => setScheduleCourt(e.target.value)}
            options={courtOptions}
          />
        ) : (
          <Input
            label="Tên sân"
            value={scheduleCourt}
            onChange={(e) => setScheduleCourt(e.target.value)}
            placeholder="Sân 1"
          />
        )}
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={closeScheduleForm}>
          Huỷ
        </Button>
        <Button
          size="sm"
          disabled={!scheduleDate || isActionLoading}
          onClick={handleScheduleSubmit}
        >
          Xác nhận
        </Button>
      </div>
    </GlassPanel>
  );
}
