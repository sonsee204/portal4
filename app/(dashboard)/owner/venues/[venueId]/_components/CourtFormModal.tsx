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
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/components/molecules/Modal';
import { Input } from '@/components/atoms/Input';
import { Select } from '@/components/atoms/Select';
import { Button } from '@/components/atoms/Button';
import { CourtStatus, SportType } from '@/graphql/generated';
import { useCreateCourt, useUpdateCourt } from '@/hooks/owner';
import {
  courtFormSchema,
  type CourtFormValues,
} from '../_hooks/venue-detail.schemas';
import {
  COURT_STATUS_OPTIONS,
  SPORT_TYPE_OPTIONS,
} from '../_hooks/owner-court.constants';
import type { VenueDetailPageActions } from '../_hooks/useVenueDetailPageActions';

interface CourtFormModalProps {
  venueId: string;
  actions: VenueDetailPageActions;
  onSaved: () => void;
}

export function CourtFormModal({
  venueId,
  actions,
  onSaved,
}: CourtFormModalProps) {
  const { courtModalOpen, courtModalMode, editingCourt, closeCourtModal } =
    actions;

  const { createCourt, loading: creating } = useCreateCourt();
  const { updateCourt, loading: updating } = useUpdateCourt(venueId);
  const loading = creating || updating;

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CourtFormValues>({
    resolver: zodResolver(courtFormSchema),
    defaultValues: {
      name: '',
      sportType: SportType.Badminton,
      status: CourtStatus.Active,
      defaultPricePerHour: 0,
      peakPricePerHour: 0,
    },
  });

  useEffect(() => {
    if (!courtModalOpen) return;
    if (courtModalMode === 'edit' && editingCourt) {
      reset({
        name: editingCourt.name,
        sportType: editingCourt.sportType,
        status: editingCourt.status,
        defaultPricePerHour: editingCourt.defaultPricePerHour,
        peakPricePerHour: editingCourt.peakPricePerHour,
      });
      return;
    }
    reset({
      name: '',
      sportType: SportType.Badminton,
      status: CourtStatus.Active,
      defaultPricePerHour: 0,
      peakPricePerHour: 0,
    });
  }, [courtModalOpen, courtModalMode, editingCourt, reset]);

  const onSubmit = async (values: CourtFormValues) => {
    if (courtModalMode === 'create') {
      await createCourt({
        venueId,
        name: values.name,
        sportType: values.sportType,
        defaultPricePerHour: values.defaultPricePerHour,
        peakPricePerHour: values.peakPricePerHour,
      });
    } else if (editingCourt) {
      await updateCourt({
        courtId: editingCourt._id,
        name: values.name,
        sportType: values.sportType,
        status: values.status,
        defaultPricePerHour: values.defaultPricePerHour,
        peakPricePerHour: values.peakPricePerHour,
      });
    }
    closeCourtModal();
    onSaved();
  };

  return (
    <Modal
      open={courtModalOpen}
      onClose={closeCourtModal}
      title={courtModalMode === 'create' ? 'Thêm sân con' : 'Sửa sân con'}
      size="md"
      footer={
        <>
          <Button variant="ghost" size="sm" onClick={closeCourtModal}>
            Huỷ
          </Button>
          <Button
            variant="primary"
            size="sm"
            disabled={loading}
            onClick={handleSubmit(onSubmit)}
          >
            {loading ? 'Đang lưu...' : 'Lưu'}
          </Button>
        </>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <Input
          {...register('name')}
          label="Tên sân con"
          placeholder="VD: Sân 1"
          error={errors.name?.message}
        />

        <Controller
          name="sportType"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              label="Môn thể thao"
              options={SPORT_TYPE_OPTIONS}
            />
          )}
        />

        {courtModalMode === 'edit' && (
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                value={field.value ?? CourtStatus.Active}
                label="Trạng thái"
                options={COURT_STATUS_OPTIONS}
              />
            )}
          />
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            {...register('defaultPricePerHour', { valueAsNumber: true })}
            type="number"
            label="Giá mặc định / giờ (VND)"
            error={errors.defaultPricePerHour?.message}
          />
          <Input
            {...register('peakPricePerHour', { valueAsNumber: true })}
            type="number"
            label="Giá cao điểm / giờ (VND)"
            error={errors.peakPricePerHour?.message}
          />
        </div>
      </form>
    </Modal>
  );
}
