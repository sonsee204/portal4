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

import { useState } from 'react';
import { Button } from '@/components/atoms/Button';
import { IonIcon } from '@/components/atoms/IonIcon';
import { useCreatePickupGameCampaign } from '@/hooks/pickup-game-campaign';

interface CreateCampaignModalProps {
  onCreated: () => void;
}

export function CreateCampaignModal({ onCreated }: CreateCampaignModalProps) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
  });

  const { createCampaign, loading } = useCreatePickupGameCampaign();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    await createCampaign({
      name: form.name.trim(),
      description: form.description.trim() || undefined,
      startDate: form.startDate || undefined,
      endDate: form.endDate || undefined,
    });
    setOpen(false);
    setForm({ name: '', description: '', startDate: '', endDate: '' });
    onCreated();
  };

  if (!open) {
    return (
      <Button
        variant="primary"
        size="sm"
        iconLeft="add-outline"
        onClick={() => setOpen(true)}
      >
        Tạo Campaign
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-surface w-full max-w-md rounded-2xl p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-heading text-lg font-semibold">
            Tạo Campaign Giao Lưu
          </h2>
          <button
            onClick={() => setOpen(false)}
            className="text-faint hover:text-body rounded-lg p-1 transition-colors"
          >
            <IonIcon name="close-outline" className="text-xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-body mb-1 block text-sm font-medium">
              Tên campaign <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="VD: Campaign cầu lông tháng 4"
              className="border-surface-border bg-surface w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label className="text-body mb-1 block text-sm font-medium">
              Mô tả
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              placeholder="Mô tả ngắn về mục tiêu campaign..."
              rows={3}
              className="border-surface-border bg-surface w-full resize-none rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-body mb-1 block text-sm font-medium">
                Ngày bắt đầu
              </label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) =>
                  setForm((f) => ({ ...f, startDate: e.target.value }))
                }
                className="border-surface-border bg-surface w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="text-body mb-1 block text-sm font-medium">
                Ngày kết thúc
              </label>
              <input
                type="date"
                value={form.endDate}
                onChange={(e) =>
                  setForm((f) => ({ ...f, endDate: e.target.value }))
                }
                className="border-surface-border bg-surface w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={() => setOpen(false)}
            >
              Hủy
            </Button>
            <Button
              variant="primary"
              size="sm"
              type="submit"
              disabled={loading || !form.name.trim()}
            >
              {loading ? 'Đang tạo...' : 'Tạo Campaign'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
