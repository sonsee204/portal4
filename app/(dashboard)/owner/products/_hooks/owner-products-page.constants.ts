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

import type { FilterChip } from '@/components/molecules/FilterChips';
import type { TabItem } from '@/components/molecules/TabGroup';
import { ProductStatus } from '@/graphql/generated';
import { PRODUCT_STATUS_LABEL } from '@/lib/constants/product-status';

export const PAGE_SIZE = 20;

export const PRODUCT_VIEW_TABS: TabItem[] = [
  { label: 'Sản phẩm', value: 'products' },
  { label: 'Danh mục', value: 'categories' },
];

export const PRODUCT_STATUS_CHIPS: FilterChip[] = [
  { label: 'Tất cả', value: 'ALL' },
  {
    label: PRODUCT_STATUS_LABEL.ACTIVE ?? 'Đang bán',
    value: ProductStatus.Active,
  },
  {
    label: PRODUCT_STATUS_LABEL.DRAFT ?? 'Nháp',
    value: ProductStatus.Draft,
  },
  {
    label: PRODUCT_STATUS_LABEL.INACTIVE ?? 'Ngừng bán',
    value: ProductStatus.Inactive,
  },
  {
    label: PRODUCT_STATUS_LABEL.OUT_OF_STOCK ?? 'Hết hàng',
    value: ProductStatus.OutOfStock,
  },
];

export const EMPTY_PRODUCT_FORM = {
  name: '',
  sku: '',
  price: '',
  stockQuantity: '',
  lowStockThreshold: '5',
  categoryId: '',
};

export const EMPTY_IMPORT_STOCK_FORM = {
  productId: '',
  quantity: '',
  importPrice: '',
  supplierName: '',
  supplierContact: '',
  invoiceNumber: '',
  note: '',
};

export const EMPTY_CATEGORY_FORM = {
  name: '',
  displayOrder: '0',
};
