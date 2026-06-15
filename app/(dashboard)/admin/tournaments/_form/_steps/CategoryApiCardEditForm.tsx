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
import { CurrencyInput } from '@/components/atoms/CurrencyInput';
import { Input } from '@/components/atoms/Input';
import { IonIcon } from '@/components/atoms/IonIcon';
import { Select } from '@/components/atoms/Select';
import { Textarea } from '@/components/atoms/Textarea';
import { MatchType, TournamentFormat } from '@/graphql/generated';

import type { EditState } from './category-api-card.types';
import {
  BRACKET_SIZE_OPTIONS,
  FORMAT_OPTIONS,
  ICON_OPTIONS,
  MATCH_TYPE_OPTIONS,
} from './step-categories.constants';

export interface CategoryApiCardEditFormProps {
  draft: EditState;
  updating: boolean;
  onUpdate: (partial: Partial<EditState>) => void;
  onCancel: () => void;
  onSave: () => void;
}

export function CategoryApiCardEditForm({
  draft,
  updating,
  onUpdate,
  onCancel,
  onSave,
}: CategoryApiCardEditFormProps) {
  return (
    <div className="border-primary/30 bg-surface space-y-4 rounded-xl border p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-heading text-sm font-semibold">
          Chỉnh sửa nội dung
        </span>
        <div className="flex items-center gap-2">
          <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
            Huỷ
          </Button>
          <Button
            type="button"
            variant="primary"
            size="sm"
            disabled={updating || !draft.title.trim()}
            iconLeft="checkmark-outline"
            onClick={onSave}
          >
            Lưu
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Tên nội dung"
          placeholder="VD: Đơn Nam U11"
          leftIcon="trophy-outline"
          value={draft.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
        />
        <Input
          label="Nhóm tuổi"
          placeholder="VD: U11, 12-13"
          leftIcon="calendar-outline"
          value={draft.ageLabel}
          onChange={(e) => onUpdate({ ageLabel: e.target.value })}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Select
          label="Loại thi đấu"
          options={MATCH_TYPE_OPTIONS}
          value={draft.matchType}
          onChange={(e) =>
            onUpdate({ matchType: e.target.value as MatchType })
          }
        />
        <Select
          label="Thể thức"
          options={FORMAT_OPTIONS}
          value={draft.format}
          onChange={(e) =>
            onUpdate({ format: e.target.value as TournamentFormat })
          }
        />
        <Select
          label="Icon"
          options={ICON_OPTIONS}
          value={draft.icon}
          onChange={(e) => onUpdate({ icon: e.target.value })}
        />
      </div>

      <div
        className={`grid gap-4 ${draft.format === TournamentFormat.RoundRobin || draft.format === TournamentFormat.GroupKnockout ? 'sm:grid-cols-2' : 'sm:grid-cols-3'}`}
      >
        <Input
          label="Số VĐV tối đa"
          placeholder="0 = Không giới hạn"
          type="number"
          min={0}
          value={String(draft.maxRegistrations)}
          onChange={(e) =>
            onUpdate({ maxRegistrations: parseInt(e.target.value, 10) || 0 })
          }
        />
        {draft.format !== TournamentFormat.RoundRobin &&
          draft.format !== TournamentFormat.GroupKnockout && (
            <Select
              label="Kích thước nhánh đấu"
              value={String(draft.bracketSize)}
              onChange={(e) =>
                onUpdate({ bracketSize: Number(e.target.value) })
              }
              options={BRACKET_SIZE_OPTIONS}
            />
          )}
        <div className="flex items-end pb-1">
          <label className="flex cursor-pointer items-center gap-2.5">
            <button
              type="button"
              role="switch"
              aria-checked={draft.popular}
              onClick={() => onUpdate({ popular: !draft.popular })}
              className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
                draft.popular ? 'bg-primary' : 'bg-surface-border'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
                  draft.popular ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className="text-heading text-sm">
              Nổi bật trên trang giới thiệu
            </span>
          </label>
        </div>
      </div>

      {draft.format === TournamentFormat.SingleElimination && (
        <div className="flex items-end pb-1">
          <label className="flex cursor-pointer items-center gap-2.5">
            <button
              type="button"
              role="switch"
              aria-checked={draft.sharedThirdPlace}
              onClick={() =>
                onUpdate({ sharedThirdPlace: !draft.sharedThirdPlace })
              }
              className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
                draft.sharedThirdPlace ? 'bg-primary' : 'bg-surface-border'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
                  draft.sharedThirdPlace ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className="text-heading text-sm">
              Đồng giải ba (không đánh trận tranh hạng 3-4)
            </span>
          </label>
        </div>
      )}

      {draft.format === TournamentFormat.GroupKnockout && (
        <div className="space-y-2">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Số bảng"
              placeholder="VD: 4"
              type="number"
              min={2}
              value={String(draft.groupCount)}
              onChange={(e) =>
                onUpdate({ groupCount: parseInt(e.target.value, 10) || 4 })
              }
            />
            <Input
              label="VĐV đi tiếp / bảng"
              placeholder="VD: 2"
              type="number"
              min={1}
              value={String(draft.advancingPerGroup)}
              onChange={(e) =>
                onUpdate({
                  advancingPerGroup: parseInt(e.target.value, 10) || 2,
                })
              }
            />
          </div>
          <p className="text-muted text-xs">
            {draft.groupCount} bảng × {draft.advancingPerGroup} VĐV đi tiếp ={' '}
            <strong className="text-heading">
              {draft.groupCount * draft.advancingPerGroup} VĐV
            </strong>{' '}
            vào vòng loại trực tiếp
          </p>
        </div>
      )}

      <Textarea
        label="Mô tả"
        placeholder="Mô tả ngắn về nội dung thi đấu..."
        rows={2}
        value={draft.description}
        onChange={(e) => onUpdate({ description: e.target.value })}
      />

      <div className="border-surface-border mt-4 rounded-lg border-t pt-4">
        <div className="mb-3 flex items-center justify-between">
          <h4 className="text-heading flex items-center gap-2 text-xs font-semibold">
            <IonIcon name="medal-outline" size="sm" className="text-primary" />
            Giải thưởng
          </h4>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            iconLeft="add-outline"
            onClick={() =>
              onUpdate({
                prizes: [
                  ...draft.prizes,
                  {
                    rank: String(draft.prizes.length + 1),
                    title: `Giải ${draft.prizes.length + 1}`,
                    amount: '',
                    perks: [''],
                  },
                ],
              })
            }
          >
            Thêm giải
          </Button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {draft.prizes.map((prize, pi) => (
            <div
              key={pi}
              className="border-surface-border rounded-lg border p-3"
            >
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-heading text-sm font-medium">
                    {prize.rank === 'gold'
                      ? 'Giải Nhất'
                      : prize.rank === 'silver'
                        ? 'Giải Nhì'
                        : prize.rank === 'bronze'
                          ? 'Giải Ba'
                          : `Giải ${pi + 1}`}
                  </span>
                  {draft.sharedThirdPlace && prize.rank === 'bronze' && (
                    <span
                      className="rounded-full bg-orange-500/15 px-2 py-0.5 text-[10px] font-semibold text-orange-600 dark:text-orange-400"
                      title="Đồng giải ba - 2 VĐV"
                    >
                      ×2
                    </span>
                  )}
                </div>
                {draft.prizes.length > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      onUpdate({
                        prizes: draft.prizes.filter((_, i) => i !== pi),
                      })
                    }
                    className="text-faint hover:text-danger rounded p-1"
                  >
                    <IonIcon name="trash-outline" size="sm" />
                  </button>
                )}
              </div>
              <CurrencyInput
                label="Giá trị"
                placeholder="VD: 600.000đ"
                value={prize.amount}
                onChange={(value) =>
                  onUpdate({
                    prizes: draft.prizes.map((p, i) =>
                      i === pi ? { ...p, amount: value } : p
                    ),
                  })
                }
              />
              <div className="mt-2">
                <label className="text-body mb-1 block text-xs font-medium">
                  Phần thưởng kèm theo
                </label>
                {prize.perks.map((perk, ki) => (
                  <div key={ki} className="mb-1 flex gap-1">
                    <Input
                      placeholder="VD: Huy chương Vàng"
                      value={perk}
                      onChange={(e) =>
                        onUpdate({
                          prizes: draft.prizes.map((p, i) =>
                            i === pi
                              ? {
                                  ...p,
                                  perks: p.perks.map((pk, k) =>
                                    k === ki ? e.target.value : pk
                                  ),
                                }
                              : p
                          ),
                        })
                      }
                      className="flex-1"
                    />
                    {prize.perks.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          onUpdate({
                            prizes: draft.prizes.map((p, i) =>
                              i === pi
                                ? {
                                    ...p,
                                    perks: p.perks.filter((_, k) => k !== ki),
                                  }
                                : p
                            ),
                          })
                        }
                        className="text-faint hover:text-danger shrink-0 rounded p-1"
                      >
                        <IonIcon name="close-outline" size="sm" />
                      </button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="mt-1"
                  iconLeft="add-outline"
                  onClick={() =>
                    onUpdate({
                      prizes: draft.prizes.map((p, i) =>
                        i === pi ? { ...p, perks: [...p.perks, ''] } : p
                      ),
                    })
                  }
                >
                  Thêm phần thưởng
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
