'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { IonIcon } from '@/components/atoms/IonIcon';
import { useCreateQrCampaign } from '@/hooks/qr-campaign';
import { showSuccess, showError } from '@/lib/toast';

const schema = z.object({
  name: z.string().min(2, 'Tên chiến dịch tối thiểu 2 ký tự').max(100),
  location: z.string().max(200).optional(),
  description: z.string().max(500).optional(),
  expiresAt: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface CreateQrCampaignModalProps {
  onCreated?: () => void;
}

export function CreateQrCampaignModal({
  onCreated,
}: CreateQrCampaignModalProps) {
  const [open, setOpen] = useState(false);
  const { createCampaign, loading } = useCreateQrCampaign();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    try {
      await createCampaign({
        name: values.name,
        location: values.location || undefined,
        description: values.description || undefined,
        expiresAt: values.expiresAt ? values.expiresAt : undefined,
      });
      showSuccess('Tạo chiến dịch QR thành công');
      reset();
      setOpen(false);
      onCreated?.();
    } catch {
      showError('Không thể tạo chiến dịch. Vui lòng thử lại.');
    }
  };

  if (!open) {
    return (
      <Button
        variant="primary"
        size="sm"
        iconLeft="add-outline"
        onClick={() => setOpen(true)}
      >
        Tạo QR mới
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-surface border-surface-border w-full max-w-md rounded-2xl border shadow-2xl">
        <div className="border-surface-border flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-heading text-lg font-semibold">
            Tạo chiến dịch QR mới
          </h2>
          <button
            onClick={() => setOpen(false)}
            className="text-faint hover:text-heading rounded-lg p-1 transition-colors"
          >
            <IonIcon name="close-outline" className="text-xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-6">
          <div>
            <label className="text-body mb-1.5 block text-sm font-medium">
              Tên chiến dịch <span className="text-red-500">*</span>
            </label>
            <Input
              {...register('name')}
              placeholder="VD: Poster Hà Nội Q2 2026"
              error={errors.name?.message}
            />
          </div>

          <div>
            <label className="text-body mb-1.5 block text-sm font-medium">
              Địa điểm dán QR
            </label>
            <Input
              {...register('location')}
              placeholder="VD: Sân Mỹ Đình, Gym Hà Nội..."
            />
            <p className="text-faint mt-1 text-xs">
              Giúp bạn biết QR nào hiệu quả hơn theo địa điểm
            </p>
          </div>

          <div>
            <label className="text-body mb-1.5 block text-sm font-medium">
              Mô tả
            </label>
            <Input
              {...register('description')}
              placeholder="Mô tả ngắn về chiến dịch..."
            />
          </div>

          <div>
            <label className="text-body mb-1.5 block text-sm font-medium">
              Ngày hết hạn
            </label>
            <Input type="date" {...register('expiresAt')} />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              className="flex-1"
              onClick={() => setOpen(false)}
            >
              Huỷ
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
              disabled={loading}
            >
              {loading ? 'Đang tạo...' : 'Tạo chiến dịch'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
