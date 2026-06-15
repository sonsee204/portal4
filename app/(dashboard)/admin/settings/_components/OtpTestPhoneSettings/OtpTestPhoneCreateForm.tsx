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

import { Controller, type UseFormReturn } from 'react-hook-form';

import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { OTP_TEST_PHONES } from '@/lib/strings';
import type { OtpTestPhone } from '@/lib/api/otp-test-phones';

import {
  PURPOSE_OPTIONS,
  type CreateForm,
  type EditForm,
} from './otp-test-phone-registry.schemas';

type OtpTestPhoneCreateFormProps = {
  form: UseFormReturn<CreateForm>;
  purposesValue: string[];
  submitting: boolean;
  onSubmit: (data: CreateForm) => Promise<void>;
};

export function OtpTestPhoneCreateForm({
  form,
  purposesValue,
  submitting,
  onSubmit,
}: OtpTestPhoneCreateFormProps) {
  return (
    <GlassPanel card className="max-w-xl space-y-4">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Controller
          name="phone"
          control={form.control}
          render={({ field }) => (
            <Input
              label={OTP_TEST_PHONES.FORM.PHONE}
              placeholder={OTP_TEST_PHONES.FORM.PHONE_PLACEHOLDER}
              error={form.formState.errors.phone?.message}
              {...field}
            />
          )}
        />
        <Controller
          name="testCode"
          control={form.control}
          render={({ field }) => (
            <Input
              label={OTP_TEST_PHONES.FORM.CODE}
              placeholder={OTP_TEST_PHONES.FORM.CODE_PLACEHOLDER}
              maxLength={6}
              error={form.formState.errors.testCode?.message}
              {...field}
            />
          )}
        />
        <Controller
          name="label"
          control={form.control}
          render={({ field }) => (
            <Input
              label={OTP_TEST_PHONES.FORM.LABEL}
              placeholder={OTP_TEST_PHONES.FORM.LABEL_PLACEHOLDER}
              error={form.formState.errors.label?.message}
              {...field}
            />
          )}
        />
        <div>
          <p className="text-heading mb-2 text-sm font-medium">
            {OTP_TEST_PHONES.FORM.PURPOSES}
          </p>
          <div className="flex flex-wrap gap-2">
            {PURPOSE_OPTIONS.map((opt) => {
              const checked = purposesValue.includes(opt.value);
              return (
                <label
                  key={opt.value}
                  className="border-surface-border flex cursor-pointer items-center gap-2 rounded border px-3 py-1.5 text-xs"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => {
                      const next = e.target.checked
                        ? [...purposesValue, opt.value]
                        : purposesValue.filter((v) => v !== opt.value);
                      form.setValue('allowedPurposes', next);
                    }}
                  />
                  {opt.label}
                </label>
              );
            })}
          </div>
        </div>
        <Controller
          name="expiresAt"
          control={form.control}
          render={({ field }) => (
            <Input
              label={OTP_TEST_PHONES.FORM.EXPIRES}
              type="datetime-local"
              {...field}
            />
          )}
        />
        <Button type="submit" disabled={submitting}>
          {submitting
            ? OTP_TEST_PHONES.SUBMITTING
            : OTP_TEST_PHONES.SUBMIT_CREATE}
        </Button>
      </form>
    </GlassPanel>
  );
}

type OtpTestPhoneEditFormProps = {
  editing: OtpTestPhone;
  form: UseFormReturn<EditForm>;
  purposesValue: string[];
  submitting: boolean;
  onSubmit: (data: EditForm) => Promise<void>;
  onCancel: () => void;
};

export function OtpTestPhoneEditForm({
  editing,
  form,
  purposesValue,
  submitting,
  onSubmit,
  onCancel,
}: OtpTestPhoneEditFormProps) {
  return (
    <GlassPanel card className="max-w-xl space-y-4">
      <p className="text-faint text-xs">{OTP_TEST_PHONES.FORM.PHONE_READONLY}</p>
      <p className="text-heading font-mono text-sm">{editing.phone}</p>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Controller
          name="testCode"
          control={form.control}
          render={({ field }) => (
            <Input
              label={OTP_TEST_PHONES.FORM.CODE}
              maxLength={6}
              error={form.formState.errors.testCode?.message}
              {...field}
            />
          )}
        />
        <Controller
          name="label"
          control={form.control}
          render={({ field }) => (
            <Input
              label={OTP_TEST_PHONES.FORM.LABEL}
              error={form.formState.errors.label?.message}
              {...field}
            />
          )}
        />
        <div>
          <p className="text-heading mb-2 text-sm font-medium">
            {OTP_TEST_PHONES.FORM.PURPOSES}
          </p>
          <div className="flex flex-wrap gap-2">
            {PURPOSE_OPTIONS.map((opt) => {
              const checked = purposesValue.includes(opt.value);
              return (
                <label
                  key={opt.value}
                  className="border-surface-border flex cursor-pointer items-center gap-2 rounded border px-3 py-1.5 text-xs"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => {
                      const next = e.target.checked
                        ? [...purposesValue, opt.value]
                        : purposesValue.filter((v) => v !== opt.value);
                      form.setValue('allowedPurposes', next);
                    }}
                  />
                  {opt.label}
                </label>
              );
            })}
          </div>
        </div>
        <Controller
          name="expiresAt"
          control={form.control}
          render={({ field }) => (
            <Input
              label={OTP_TEST_PHONES.FORM.EXPIRES}
              type="datetime-local"
              {...field}
            />
          )}
        />
        <div className="flex gap-2">
          <Button type="submit" disabled={submitting}>
            {submitting
              ? OTP_TEST_PHONES.SUBMITTING
              : OTP_TEST_PHONES.SUBMIT_UPDATE}
          </Button>
          <Button type="button" variant="ghost" onClick={onCancel}>
            {OTP_TEST_PHONES.TOGGLE_HIDE}
          </Button>
        </div>
      </form>
    </GlassPanel>
  );
}
