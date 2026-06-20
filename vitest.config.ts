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

import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: [
      '**/schedule-page.derived.test.ts',
      '**/draw-page.derived.test.ts',
      '**/lib/tournament/draw/manual-draw.test.ts',
      '**/lib/tournament/draw/bracket-topology.test.ts',
      '**/registrations-page.derived.test.ts',
      '**/moderation-page.derived.test.ts',
      '**/lib/permissions/access.test.ts',
      '**/lib/permissions/nav-filter.test.ts',
      '**/lib/auth/post-login-redirect.test.ts',
      '**/hooks/shared/useCursorConnection.test.ts',
      '**/components/molecules/ConnectionInfiniteScroll/connection-infinite-scroll.utils.test.ts',
      '**/lib/date/calendar.test.ts',
      '**/lib/date/format-display.test.ts',
      '**/lib/venue/operating-hours.test.ts',
      '**/lib/venue/calendar-booking-segments.test.ts',
      '**/lib/venue/calendar-availability-segments.test.ts',
      '**/lib/venue/booking-slots-display.test.ts',
      '**/lib/venue/permissions.test.ts',
      '**/lib/venue/staff-row-actions.test.ts',
      '**/lib/promotion/map-promotion-form.test.ts',
      '**/lib/promotion/promotion-row-actions.test.ts',
      '**/lib/owner/payment-proof.test.ts',
      '**/lib/order/create-order.test.ts',
      '**/lib/upload/prepare-image-for-upload.test.ts',
      '**/lib/finance/portfolio-aggregate.test.ts',
      '**/lib/finance/aggregate-court-revenue.test.ts',
      '**/lib/charts/format-currency.test.ts',
      '**/lib/inventory/stock-movement-display.test.ts',
      '**/lib/inventory/product-transfer.test.ts',
      '**/lib/booking/staff-booking.test.ts',
      '**/lib/booking/recurring-exclude-pricing.test.ts',
    ],
    environment: 'node',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
});
