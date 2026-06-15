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

export function totalPagesFromCount(total: number, pageSize: number): number {
  return Math.ceil(total / pageSize);
}

export function resolveEffectiveReportId<T extends { _id: string }>(
  reports: T[],
  selectedId: string | null,
): string | null {
  return reports.find((r) => r._id === selectedId)?._id ?? reports[0]?._id ?? null;
}

export function findReportById<T extends { _id: string }>(
  reports: T[],
  id: string | null,
): T | undefined {
  return id ? reports.find((r) => r._id === id) : undefined;
}

export function buildStatusFilter<T extends string>(
  status: T | 'ALL',
): { status: T } | undefined {
  return status === 'ALL' ? undefined : { status };
}

export function shortDisplayId(id: string): string {
  return id.slice(-6).toUpperCase();
}

export function truncateText(text: string, maxLength: number): string {
  return text.length > maxLength ? `${text.slice(0, maxLength)}…` : text;
}
