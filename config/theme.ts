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

/**
 * Portal design system tokens — keeps component styling DRY.
 * All components reference these maps instead of hard-coding classes.
 *
 * Colors use semantic tokens from globals.css that automatically
 * switch between light and dark themes via CSS custom properties.
 */

/* ------------------------------------------------------------------ */
/* Color variant maps                                                  */
/* ------------------------------------------------------------------ */

export const badgeVariants = {
  success:
    'bg-emerald-500/10 text-status-success-text border border-emerald-500/20',
  warning:
    'bg-amber-500/10 text-status-warning-text border border-amber-500/20',
  danger:
    'bg-red-500/10 text-status-danger-text border border-red-500/20',
  info:
    'bg-blue-500/10 text-status-info-text border border-blue-500/20',
  neutral:
    'bg-slate-500/10 text-muted border border-slate-500/20',
  live:
    'bg-emerald-500/10 text-status-success-text border border-emerald-500/20',
  purple:
    'bg-violet-500/10 text-status-purple-text border border-violet-500/20',
} as const;

export type BadgeVariant = keyof typeof badgeVariants;

export const buttonVariants = {
  primary:
    'bg-primary text-white hover:bg-primary-hover shadow-lg shadow-primary/25',
  secondary:
    'bg-surface text-heading border border-surface-border hover:bg-surface-hover',
  outline:
    'border border-surface-border bg-transparent text-body hover:bg-surface-hover hover:text-heading',
  ghost:
    'bg-transparent text-muted hover:bg-surface-hover hover:text-heading',
  danger:
    'bg-red-500/10 text-status-danger-text border border-red-500/20 hover:bg-red-500/20',
} as const;

export type ButtonVariant = keyof typeof buttonVariants;

export const buttonSizes = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2.5',
} as const;

export type ButtonSize = keyof typeof buttonSizes;

/* ------------------------------------------------------------------ */
/* Icon-size helpers (used by IonIcon, IconButton, etc.)               */
/* ------------------------------------------------------------------ */

export const iconSizes = {
  xs: 'h-3.5 w-3.5',
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-7 w-7',
  xl: 'h-9 w-9',
} as const;

export type IconSize = keyof typeof iconSizes;

/* ------------------------------------------------------------------ */
/* Avatar status dot colors                                            */
/* ------------------------------------------------------------------ */

export const avatarStatusColors = {
  online: 'bg-emerald-500',
  offline: 'bg-slate-500',
  away: 'bg-amber-400',
  busy: 'bg-red-500',
} as const;

export type AvatarStatus = keyof typeof avatarStatusColors;

/* ------------------------------------------------------------------ */
/* Progress bar variants                                               */
/* ------------------------------------------------------------------ */

export const progressVariants = {
  primary: 'from-violet-600 to-violet-400',
  success: 'from-emerald-600 to-emerald-400',
  warning: 'from-amber-600 to-amber-400',
  danger: 'from-red-600 to-red-400',
  info: 'from-blue-600 to-blue-400',
} as const;

export type ProgressVariant = keyof typeof progressVariants;
