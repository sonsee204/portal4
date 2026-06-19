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

import Link from 'next/link';
import { VenueAction } from '@/graphql/generated';
import { VenueActionGate } from '@/components/atoms/VenueActionGate';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { IonIcon } from '@/components/atoms/IonIcon';
import { formatCurrency } from '@/lib/utils';
import type { OwnerDashboardData } from '../_hooks/useOwnerDashboardData';

interface OwnerDashboardAlertsSectionProps {
  data: OwnerDashboardData;
}

export function OwnerDashboardAlertsSection({
  data,
}: OwnerDashboardAlertsSectionProps) {
  const { selectedVenue, bookingStats, orderStats, lowStockProducts } = data;

  if (!selectedVenue) return null;

  const pendingBookings = bookingStats?.pendingBookings ?? 0;
  const pendingOrders = orderStats?.pendingOrders ?? 0;
  const lowStockCount = lowStockProducts.length;

  if (pendingBookings === 0 && pendingOrders === 0 && lowStockCount === 0) {
    return null;
  }

  return (
    <GlassPanel card className="mt-6">
      <h3 className="text-heading mb-4 flex items-center gap-2 text-sm font-bold">
        <IonIcon
          name="notifications-outline"
          size="sm"
          className="text-amber-400"
        />
        Cảnh báo — {selectedVenue.name}
      </h3>
      <div className="grid gap-3 sm:grid-cols-3">
        <VenueActionGate action={VenueAction.ViewBookings}>
          {pendingBookings > 0 ? (
            <Link
              key="pending-bookings"
              href="/owner/bookings"
              className="border-surface-border hover:bg-surface-hover flex items-start gap-3 rounded-xl border p-4 transition-colors"
            >
              <IonIcon
                name="calendar-outline"
                size="md"
                className="mt-0.5 text-emerald-400"
              />
              <div>
                <p className="text-heading text-sm font-semibold">
                  {pendingBookings} đặt sân chờ xử lý
                </p>
                <p className="text-muted mt-0.5 text-xs">
                  Xem danh sách đặt sân
                </p>
              </div>
            </Link>
          ) : null}
        </VenueActionGate>

        <VenueActionGate action={VenueAction.ViewOrders}>
          {pendingOrders > 0 ? (
            <div
              key="pending-orders"
              className="border-surface-border flex items-start gap-3 rounded-xl border p-4"
            >
              <IonIcon
                name="receipt-outline"
                size="md"
                className="mt-0.5 text-blue-400"
              />
              <div>
                <p className="text-heading text-sm font-semibold">
                  {pendingOrders} đơn hàng chờ xử lý
                </p>
                <p className="text-muted mt-0.5 text-xs">
                  Doanh thu hôm nay:{' '}
                  {formatCurrency(orderStats?.todayRevenue ?? 0)}
                </p>
              </div>
            </div>
          ) : null}
        </VenueActionGate>

        <VenueActionGate action={VenueAction.ManageProducts}>
          {lowStockCount > 0 ? (
            <div
              key="low-stock"
              className="border-surface-border flex items-start gap-3 rounded-xl border p-4"
            >
              <IonIcon
                name="cube-outline"
                size="md"
                className="mt-0.5 text-red-400"
              />
              <div>
                <p className="text-heading text-sm font-semibold">
                  {lowStockCount} sản phẩm sắp hết hàng
                </p>
                <p className="text-muted mt-0.5 text-xs">
                  {lowStockProducts
                    .slice(0, 2)
                    .map((p) => p.name)
                    .join(', ')}
                  {lowStockCount > 2 ? '…' : ''}
                </p>
              </div>
            </div>
          ) : null}
        </VenueActionGate>
      </div>
    </GlassPanel>
  );
}
