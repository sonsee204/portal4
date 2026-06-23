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

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { Input } from '@/components/atoms/Input';
import { Textarea } from '@/components/atoms/Textarea';
import { Button } from '@/components/atoms/Button';
import { VenueActionGate } from '@/components/atoms/VenueActionGate';
import { VenueAction } from '@/graphql/generated';
import { useUpdateVenue } from '@/hooks/owner';
import {
  venueEditSchema,
  type VenueEditFormValues,
} from '../_hooks/venue-detail.schemas';
import type { VenueDetailPageData } from '../_hooks/useVenueDetailPageData';

interface VenueEditFormSectionProps {
  data: VenueDetailPageData;
}

export function VenueEditFormSection({ data }: VenueEditFormSectionProps) {
  const { venueId, venue, refetchAll } = data;
  const { updateVenue, loading } = useUpdateVenue();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<VenueEditFormValues>({
    resolver: zodResolver(venueEditSchema),
    defaultValues: {
      name: '',
      description: '',
      phoneNumber: '',
      email: '',
      address: '',
      city: '',
      district: '',
    },
  });

  useEffect(() => {
    if (!venue) return;
    reset({
      name: venue.name,
      description: venue.description ?? '',
      phoneNumber: venue.phoneNumber ?? '',
      email: venue.email ?? '',
      address: venue.location.address,
      city: venue.location.city ?? '',
      district: venue.location.district ?? '',
    });
  }, [venue, reset]);

  const onSubmit = async (values: VenueEditFormValues) => {
    if (!venueId) return;
    await updateVenue({
      venueId,
      name: values.name,
      description: values.description || undefined,
      phoneNumber: values.phoneNumber || undefined,
      email: values.email || undefined,
      location: {
        address: values.address,
        city: values.city || undefined,
        district: values.district || undefined,
        latitude: venue?.location.latitude ?? undefined,
        longitude: venue?.location.longitude ?? undefined,
      },
    });
    refetchAll();
  };

  if (!venue) return null;

  return (
    <GlassPanel card>
      <h3 className="text-heading mb-4 text-sm font-bold">Thông tin sân</h3>

      <VenueActionGate
        action={VenueAction.Edit}
        fallback={
          <p className="text-muted text-sm">
            Bạn không có quyền chỉnh sửa thông tin sân này.
          </p>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              {...register('name')}
              label="Tên sân"
              error={errors.name?.message}
            />
            <Input
              {...register('phoneNumber')}
              label="Số điện thoại"
              error={errors.phoneNumber?.message}
            />
            <Input
              {...register('email')}
              label="Email"
              error={errors.email?.message}
            />
            <Input
              {...register('address')}
              label="Địa chỉ"
              error={errors.address?.message}
            />
            <Input {...register('city')} label="Thành phố" />
            <Input {...register('district')} label="Quận / Huyện" />
          </div>

          <Textarea
            {...register('description')}
            label="Mô tả"
            rows={3}
            error={Boolean(errors.description?.message)}
          />

          <div className="flex justify-end">
            <Button
              type="submit"
              variant="primary"
              size="sm"
              iconLeft="save-outline"
              disabled={loading || !isDirty}
            >
              {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
          </div>
        </form>
      </VenueActionGate>
    </GlassPanel>
  );
}
