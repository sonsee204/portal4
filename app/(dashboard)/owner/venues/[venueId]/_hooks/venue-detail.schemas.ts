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

import { z } from 'zod';
import { CourtStatus, SportType } from '@/graphql/generated';

export const venueEditSchema = z.object({
  name: z.string().min(2, 'Tên sân tối thiểu 2 ký tự'),
  description: z.string().max(2000).optional(),
  phoneNumber: z.string().optional(),
  email: z
    .string()
    .email('Email không hợp lệ')
    .optional()
    .or(z.literal('')),
  address: z.string().min(1, 'Địa chỉ bắt buộc'),
  city: z.string().optional(),
  district: z.string().optional(),
});

export type VenueEditFormValues = z.infer<typeof venueEditSchema>;

export const courtFormSchema = z.object({
  name: z.string().min(1, 'Tên sân con bắt buộc'),
  sportType: z.nativeEnum(SportType),
  status: z.nativeEnum(CourtStatus).optional(),
  defaultPricePerHour: z.number().min(0, 'Giá không được âm'),
  peakPricePerHour: z.number().min(0, 'Giá không được âm'),
});

export type CourtFormValues = z.infer<typeof courtFormSchema>;
