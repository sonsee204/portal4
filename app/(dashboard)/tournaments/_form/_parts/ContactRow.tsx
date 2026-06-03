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

import { Controller, type Control } from 'react-hook-form';
import { Input } from '@/components/atoms/Input';
import { Select } from '@/components/atoms/Select';
import { IonIcon } from '@/components/atoms/IonIcon';
import type { TournamentFormData } from '@/types/tournament-form';

const iconOptions = [
  { label: 'Điện thoại', value: 'call-outline' },
  { label: 'Email', value: 'mail-outline' },
  { label: 'Facebook', value: 'logo-facebook' },
  { label: 'Zalo', value: 'chatbubble-outline' },
];

interface ContactRowProps {
  index: number;
  control: Control<TournamentFormData>;
  onRemove: () => void;
  canRemove: boolean;
}

export function ContactRow({ index, control, onRemove, canRemove }: ContactRowProps) {
  return (
    <div className="group flex items-end gap-3">
      <div className="w-36">
        <Controller
          name={`contacts.${index}.icon`}
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              label={index === 0 ? 'Loại' : undefined}
              options={iconOptions}
            />
          )}
        />
      </div>
      <div className="w-28">
        <Controller
          name={`contacts.${index}.label`}
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label={index === 0 ? 'Nhãn' : undefined}
              placeholder="VD: Hotline"
            />
          )}
        />
      </div>
      <div className="flex-1">
        <Controller
          name={`contacts.${index}.value`}
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label={index === 0 ? 'Thông tin' : undefined}
              placeholder="VD: 0987 654 321"
            />
          )}
        />
      </div>
      {canRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="mb-1 shrink-0 rounded-lg p-1.5 text-faint opacity-0 transition-all hover:bg-danger/10 hover:text-danger group-hover:opacity-100"
        >
          <IonIcon name="close-outline" size="sm" />
        </button>
      )}
    </div>
  );
}
