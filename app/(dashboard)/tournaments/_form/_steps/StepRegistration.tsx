'use client';

import { useEffect, useRef, useCallback, type ChangeEvent } from 'react';
import { Controller, useFieldArray, type UseFormReturn } from 'react-hook-form';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { Input } from '@/components/atoms/Input';
import { Button } from '@/components/atoms/Button';
import { IonIcon } from '@/components/atoms/IonIcon';
import { FeeRow } from '../_parts/FeeRow';
import { ContactRow } from '../_parts/ContactRow';
import { useTournamentCategories } from '@/hooks/tournament';
import { useUploadTournamentImage } from '@/hooks/shared/useUploadTournamentImage';
import type { TournamentFormData } from '@/types/tournament-form';

interface StepRegistrationProps {
  form: UseFormReturn<TournamentFormData>;
  tournamentId?: string;
}

export function StepRegistration({
  form,
  tournamentId,
}: StepRegistrationProps) {
  const { control, watch, getValues, setValue } = form;
  const startDate = watch('startDate');

  const {
    fields: feeFields,
    append: appendFee,
    remove: removeFee,
    replace: replaceFees,
  } = useFieldArray({ control, name: 'fees' });

  const {
    fields: contactFields,
    append: appendContact,
    remove: removeContact,
  } = useFieldArray({ control, name: 'contacts' });

  const { categories } = useTournamentCategories(
    tournamentId ?? '',
    !tournamentId
  );
  const { upload: uploadImage, loading: uploading } =
    useUploadTournamentImage(tournamentId);

  const handleQrFileChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        const url = await uploadImage(base64);
        if (url) setValue('paymentQrImage', url);
      };
      reader.readAsDataURL(file);
    },
    [uploadImage, setValue]
  );

  const formCategories = watch('categories');
  const categoryTitles = tournamentId
    ? categories.map((c) => c.title)
    : formCategories.filter((c) => c.title.trim()).map((c) => c.title);

  const hasPopulated = useRef(false);

  const populateFeesFromCategories = useCallback(() => {
    if (categoryTitles.length === 0) return;
    const currentFees = getValues('fees');

    const feeMap = new Map(
      currentFees.filter((f) => f.label).map((f) => [f.label, f.amount])
    );

    const merged = categoryTitles.map((title) => ({
      label: title,
      amount: feeMap.get(title) ?? '',
    }));

    const extras = currentFees.filter(
      (f) => f.label && !categoryTitles.includes(f.label)
    );

    const newFees = [...merged, ...extras];
    if (newFees.length === 0) newFees.push({ label: '', amount: '' });

    replaceFees(newFees);
  }, [categoryTitles, getValues, replaceFees]);

  useEffect(() => {
    if (categoryTitles.length > 0 && !hasPopulated.current) {
      hasPopulated.current = true;
      populateFeesFromCategories();
    }
  }, [categoryTitles, populateFeesFromCategories]);

  return (
    <div className="space-y-6">
      {/* Deadline */}
      <GlassPanel card>
        <h3 className="text-heading mb-4 flex items-center gap-2 text-sm font-bold">
          <IonIcon name="time-outline" size="sm" className="text-primary" />
          Hạn đăng ký
        </h3>
        <Controller
          name="registrationDeadline"
          control={control}
          render={({ field, fieldState }) => (
            <Input
              {...field}
              label="Hạn chót đăng ký"
              type="date"
              leftIcon="calendar-outline"
              max={startDate || undefined}
              error={fieldState.error?.message}
            />
          )}
        />
      </GlassPanel>

      {/* Fees */}
      <GlassPanel card>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-heading flex items-center gap-2 text-sm font-bold">
            <IonIcon name="cash-outline" size="sm" className="text-primary" />
            Lệ phí thi đấu
          </h3>
          <div className="flex gap-2">
            {categoryTitles.length > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                iconLeft="refresh-outline"
                onClick={populateFeesFromCategories}
              >
                Đồng bộ nội dung
              </Button>
            )}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              iconLeft="add-outline"
              onClick={() => appendFee({ label: '', amount: '' })}
            >
              Thêm lệ phí
            </Button>
          </div>
        </div>
        {categoryTitles.length > 0 && (
          <p className="text-muted mb-3 text-xs">
            Lệ phí được tự động tạo theo các nội dung thi đấu đã cấu hình.
          </p>
        )}
        <div className="space-y-3">
          {feeFields.map((field, i) => (
            <FeeRow
              key={field.id}
              index={i}
              control={control}
              onRemove={() => removeFee(i)}
              canRemove={feeFields.length > 1}
            />
          ))}
        </div>
      </GlassPanel>

      {/* Contacts */}
      <GlassPanel card>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-heading flex items-center gap-2 text-sm font-bold">
            <IonIcon name="call-outline" size="sm" className="text-primary" />
            Liên hệ
          </h3>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            iconLeft="add-outline"
            onClick={() =>
              appendContact({ icon: 'call-outline', label: '', value: '' })
            }
          >
            Thêm liên hệ
          </Button>
        </div>
        <div className="space-y-3">
          {contactFields.map((field, i) => (
            <ContactRow
              key={field.id}
              index={i}
              control={control}
              onRemove={() => removeContact(i)}
              canRemove={contactFields.length > 1}
            />
          ))}
        </div>
      </GlassPanel>

      {/* Payment */}
      <GlassPanel card>
        <h3 className="text-heading mb-4 flex items-center gap-2 text-sm font-bold">
          <IonIcon name="card-outline" size="sm" className="text-primary" />
          Thông tin thanh toán
        </h3>
        <div className="space-y-4">
          <Controller
            name="paymentBank"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Ngân hàng"
                placeholder="VD: MB Bank"
                leftIcon="business-outline"
              />
            )}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Controller
              name="paymentAccountNumber"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Số tài khoản"
                  placeholder="VD: 0333 444 555"
                  leftIcon="keypad-outline"
                />
              )}
            />
            <Controller
              name="paymentAccountName"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Tên chủ tài khoản"
                  placeholder="VD: NGUYEN VAN A"
                  leftIcon="person-outline"
                />
              )}
            />
          </div>

          {/* QR Code */}
          <div>
            <label className="text-body mb-1.5 flex items-center gap-2 text-sm font-medium">
              <IonIcon
                name="qr-code-outline"
                size="sm"
                className="text-primary"
              />
              QR Code Thanh toán
            </label>
            <Controller
              name="paymentQrImage"
              control={control}
              render={({ field }) =>
                field.value ? (
                  <div className="relative inline-block">
                    <img
                      src={field.value}
                      alt="QR Code"
                      className="border-surface-border h-40 w-40 rounded-lg border object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => setValue('paymentQrImage', '')}
                      className="bg-danger absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full text-white shadow"
                    >
                      <IonIcon name="close-outline" size="xs" />
                    </button>
                  </div>
                ) : (
                  <label className="border-surface-border bg-overlay-faint hover:border-primary/40 hover:bg-primary/5 flex h-40 w-40 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed transition-colors">
                    {uploading ? (
                      <span className="text-muted text-xs">
                        Đang tải lên...
                      </span>
                    ) : (
                      <>
                        <IonIcon
                          name="cloud-upload-outline"
                          size="md"
                          className="text-muted"
                        />
                        <span className="text-muted text-xs">
                          Tải lên QR Code
                        </span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={uploading}
                      onChange={handleQrFileChange}
                    />
                  </label>
                )
              }
            />
          </div>
        </div>
      </GlassPanel>
    </div>
  );
}
