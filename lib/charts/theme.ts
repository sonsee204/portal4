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

export const CHART_COLORS = [
  '#7c3aed',
  '#10b981',
  '#3b82f6',
  '#f59e0b',
  '#ef4444',
  '#06b6d4',
  '#a78bfa',
  '#34d399',
] as const;

export const CHART_THEME = {
  primary: '#7c3aed',
  primaryLight: '#a78bfa',
  grid: 'var(--chart-grid-line)',
  axis: 'var(--text-muted)',
  tooltipBg: 'var(--surface)',
  tooltipBorder: 'var(--surface-border)',
  tooltipText: 'var(--text-heading)',
} as const;

export interface ChartDataPoint {
  label: string;
  value: number;
  [key: string]: string | number;
}
