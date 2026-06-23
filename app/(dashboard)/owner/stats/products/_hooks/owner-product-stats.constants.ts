/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 */

export const PRODUCT_STATS_PAGE_SIZE = 20;

export const PRODUCT_STATS_COMPARE_MODE_OPTIONS = [
  { label: 'Kỳ trước (cùng độ dài)', value: 'PREVIOUS_PERIOD' },
  { label: 'Cùng kỳ năm trước', value: 'SAME_PERIOD_LAST_YEAR' },
] as const;

export const PRODUCT_STATUS_FILTER_OPTIONS = [
  { label: 'Tất cả trạng thái', value: '' },
  { label: 'Đang bán', value: 'ACTIVE' },
  { label: 'Ẩn', value: 'HIDDEN' },
  { label: 'Hết hàng', value: 'OUT_OF_STOCK' },
  { label: 'Ngừng kinh doanh', value: 'DISCONTINUED' },
];

export type ProductDetailTab =
  | 'overview'
  | 'finance'
  | 'inventory'
  | 'movements'
  | 'info';

export const PRODUCT_DETAIL_TABS: Array<{ id: ProductDetailTab; label: string }> =
  [
    { id: 'overview', label: 'Tổng quan' },
    { id: 'finance', label: 'Tài chính' },
    { id: 'inventory', label: 'Tồn kho' },
    { id: 'movements', label: 'Xuất nhập' },
    { id: 'info', label: 'Thông tin' },
  ];
