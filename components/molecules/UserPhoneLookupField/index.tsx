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

import { useEffect, useState } from 'react';
import { Input } from '@/components/atoms/Input';
import { UserCell } from '@/components/molecules/UserCell';
import {
  useSearchUserByPhone,
  type UserPhoneLookupResult,
} from '@/hooks/user/useSearchUserByPhone';
import { PHONE_REGEX } from '@/lib/validation/constants';

export type { UserPhoneLookupResult };

export interface UserPhoneLookupFieldProps {
  phone: string;
  onPhoneChange: (phone: string) => void;
  selectedUser: UserPhoneLookupResult | null;
  onUserChange: (user: UserPhoneLookupResult | null) => void;
  phoneLabel?: string;
  phonePlaceholder?: string;
  /** Auto-bind found user (default: true). */
  autoApply?: boolean;
  showNameInput?: boolean;
  customerName?: string;
  onCustomerNameChange?: (name: string) => void;
  autoFillName?: boolean;
  nameLabel?: string;
  namePlaceholder?: string;
  showWalkInHint?: boolean;
  requireRegisteredUser?: boolean;
  debounceMs?: number;
  disabled?: boolean;
}

function formatUserLabel(user: UserPhoneLookupResult): string {
  return user.fullName || user.displayName || user.phone;
}

export function UserPhoneLookupField({
  phone,
  onPhoneChange,
  selectedUser,
  onUserChange,
  phoneLabel = 'Số điện thoại',
  phonePlaceholder = '0901234567',
  autoApply = true,
  showNameInput = false,
  customerName = '',
  onCustomerNameChange,
  autoFillName = true,
  nameLabel = 'Tên khách',
  namePlaceholder = 'Nguyễn Văn A',
  showWalkInHint = false,
  requireRegisteredUser = false,
  debounceMs = 500,
  disabled = false,
}: UserPhoneLookupFieldProps) {
  const { searchUserByPhone, loading: searching } = useSearchUserByPhone();
  const [lookupForPhone, setLookupForPhone] = useState<string | null>(null);
  const [lookupCompleted, setLookupCompleted] = useState(false);

  const normalizedPhone = phone.trim().replace(/\s/g, '');
  const phoneIsValid = PHONE_REGEX.test(normalizedPhone);
  const lookupIsCurrent = lookupForPhone === normalizedPhone;

  useEffect(() => {
    if (!phoneIsValid) {
      return;
    }

    const timer = window.setTimeout(() => {
      void searchUserByPhone(normalizedPhone).then((user) => {
        setLookupForPhone(normalizedPhone);
        setLookupCompleted(true);

        if (autoApply) {
          onUserChange(user);
          if (
            user &&
            autoFillName &&
            onCustomerNameChange &&
            !customerName.trim()
          ) {
            onCustomerNameChange(user.fullName || user.displayName);
          }
        }
      });
    }, debounceMs);

    return () => window.clearTimeout(timer);
  }, [
    autoApply,
    autoFillName,
    customerName,
    normalizedPhone,
    onCustomerNameChange,
    onUserChange,
    phoneIsValid,
    searchUserByPhone,
    debounceMs,
  ]);

  const showStatus =
    phoneIsValid && lookupIsCurrent && lookupCompleted && !searching;

  return (
    <div className="space-y-3">
      {selectedUser ? (
        <div className="border-emerald-500/20 bg-emerald-500/5 rounded-xl border p-4">
          <UserCell
            name={formatUserLabel(selectedUser)}
            subtitle={[selectedUser.phone, selectedUser.email]
              .filter(Boolean)
              .join(' · ')}
            src={selectedUser.photoURL ?? undefined}
          />
        </div>
      ) : null}

      <Input
        label={phoneLabel}
        value={phone}
        onChange={(event) => onPhoneChange(event.target.value)}
        placeholder={phonePlaceholder}
        inputMode="tel"
        leftIcon="call-outline"
        disabled={disabled || Boolean(selectedUser)}
        required
      />

      {!selectedUser && searching ? (
        <p className="text-faint text-xs">Đang tra cứu tài khoản…</p>
      ) : !selectedUser && showStatus && requireRegisteredUser ? (
        <p className="text-xs text-red-500">
          Không tìm thấy tài khoản với số này
        </p>
      ) : !selectedUser && showStatus && showWalkInHint ? (
        <p className="text-faint text-xs">Khách walk-in (chưa có tài khoản)</p>
      ) : null}

      {showNameInput && !selectedUser ? (
        <Input
          label={nameLabel}
          value={customerName}
          onChange={(event) => onCustomerNameChange?.(event.target.value)}
          placeholder={namePlaceholder}
          leftIcon="person-outline"
          disabled={disabled}
          required
        />
      ) : null}
    </div>
  );
}
