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

const timeRangeSchema = z.object({
  startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Giờ bắt đầu không hợp lệ'),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, 'Giờ kết thúc không hợp lệ'),
});

export const createPromotionSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, 'Tên khuyến mãi là bắt buộc')
      .max(120, 'Tên khuyến mãi tối đa 120 ký tự'),
    description: z.string().max(500, 'Mô tả tối đa 500 ký tự'),
    type: z.enum(['PERCENTAGE', 'FIXED_AMOUNT']),
    value: z.string(),
    maxDiscountAmount: z.string(),
    category: z.enum(['VOUCHER', 'FIRST_BOOKING', 'LOYALTY', 'RECURRING']),
    trigger: z.enum(['AUTO', 'CODE']),
    scope: z.enum([
      'ALL_COURTS',
      'SPECIFIC_COURTS',
      'SPECIFIC_SPORT',
      'PRODUCTS',
      'ALL',
    ]),
    applyLevel: z.enum(['TOTAL', 'PER_HOUR']),
    hasTimeRanges: z.boolean(),
    applicableTimeRanges: z.array(timeRangeSchema),
    code: z.string(),
    startDate: z.date(),
    endDate: z.date(),
    minBookingAmount: z.string(),
    totalUsageLimit: z.string(),
    perUserLimit: z.string(),
    isStackable: z.boolean(),
    showOnVenueCard: z.boolean(),
    showAsBanner: z.boolean(),
    badgeText: z.string(),
    badgeColor: z.string(),
    submitForApproval: z.boolean(),
    selectedCourtIds: z.array(z.string()),
    selectedSportTypes: z.array(z.string()),
    selectedProductCategoryIds: z.array(z.string()),
  })
  .superRefine((data, ctx) => {
    const numericValue = Number(data.value);
    if (!data.value || Number.isNaN(numericValue) || numericValue <= 0) {
      ctx.addIssue({
        code: 'custom',
        path: ['value'],
        message: 'Giá trị giảm phải lớn hơn 0',
      });
    } else if (data.type === 'PERCENTAGE' && numericValue > 100) {
      ctx.addIssue({
        code: 'custom',
        path: ['value'],
        message: 'Phần trăm giảm không được quá 100%',
      });
    }

    if (data.trigger === 'CODE' && !data.code.trim()) {
      ctx.addIssue({
        code: 'custom',
        path: ['code'],
        message: 'Mã code là bắt buộc',
      });
    }

    if (data.startDate >= data.endDate) {
      ctx.addIssue({
        code: 'custom',
        path: ['startDate'],
        message: 'Ngày bắt đầu phải trước ngày kết thúc',
      });
      ctx.addIssue({
        code: 'custom',
        path: ['endDate'],
        message: 'Ngày kết thúc phải sau ngày bắt đầu',
      });
    }

    if (
      data.category === 'RECURRING' &&
      (data.scope === 'PRODUCTS' || data.scope === 'ALL')
    ) {
      ctx.addIssue({
        code: 'custom',
        path: ['scope'],
        message: 'Khuyến mãi đặt cố định không áp dụng cho sản phẩm',
      });
    }

    if (data.scope === 'SPECIFIC_COURTS' && data.selectedCourtIds.length === 0) {
      ctx.addIssue({
        code: 'custom',
        path: ['selectedCourtIds'],
        message: 'Chọn ít nhất một sân',
      });
    }

    if (
      data.scope === 'SPECIFIC_SPORT' &&
      data.selectedSportTypes.length === 0
    ) {
      ctx.addIssue({
        code: 'custom',
        path: ['selectedSportTypes'],
        message: 'Chọn ít nhất một môn thể thao',
      });
    }

    if (
      data.scope === 'PRODUCTS' &&
      data.selectedProductCategoryIds.length === 0
    ) {
      ctx.addIssue({
        code: 'custom',
        path: ['selectedProductCategoryIds'],
        message: 'Chọn ít nhất một danh mục sản phẩm',
      });
    }
  });

export type CreatePromotionFormValues = z.infer<typeof createPromotionSchema>;

export const CREATE_PROMOTION_DEFAULT_VALUES: CreatePromotionFormValues = {
  name: '',
  description: '',
  type: 'PERCENTAGE',
  value: '',
  maxDiscountAmount: '',
  category: 'VOUCHER',
  trigger: 'CODE',
  scope: 'ALL_COURTS',
  applyLevel: 'TOTAL',
  hasTimeRanges: false,
  applicableTimeRanges: [{ startTime: '06:00', endTime: '08:00' }],
  code: '',
  startDate: new Date(),
  endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  minBookingAmount: '',
  totalUsageLimit: '',
  perUserLimit: '',
  isStackable: false,
  showOnVenueCard: true,
  showAsBanner: false,
  badgeText: '',
  badgeColor: '#8B5CF6',
  submitForApproval: false,
  selectedCourtIds: [],
  selectedSportTypes: [],
  selectedProductCategoryIds: [],
};
