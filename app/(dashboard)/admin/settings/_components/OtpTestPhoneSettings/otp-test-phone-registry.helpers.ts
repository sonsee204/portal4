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

import type { DataTableColumn } from '@/components/organisms/DataTable';
import { OTP_TEST_PHONES } from '@/lib/strings';

import { PURPOSE_OPTIONS } from './otp-test-phone-registry.schemas';

export const OTP_TEST_PHONE_REGISTRY_COLUMNS: DataTableColumn[] = [
  { key: 'phone', label: OTP_TEST_PHONES.COLUMNS.PHONE },
  { key: 'label', label: OTP_TEST_PHONES.COLUMNS.LABEL },
  { key: 'testCode', label: OTP_TEST_PHONES.COLUMNS.CODE },
  { key: 'purposes', label: OTP_TEST_PHONES.COLUMNS.PURPOSES },
  { key: 'status', label: OTP_TEST_PHONES.COLUMNS.STATUS },
  { key: 'expires', label: OTP_TEST_PHONES.COLUMNS.EXPIRES },
  { key: 'actions', label: OTP_TEST_PHONES.COLUMNS.ACTIONS, align: 'right' },
];

export function maskPhone(phone: string): string {
  if (phone.length <= 6) return phone;
  return `${phone.slice(0, 4)}•••${phone.slice(-3)}`;
}

export function formatPurposes(purposes: string[]): string {
  if (!purposes.length) return OTP_TEST_PHONES.ALL_PURPOSES;
  return purposes
    .map((p) => PURPOSE_OPTIONS.find((o) => o.value === p)?.label ?? p)
    .join(', ');
}
