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

import { useOwnerOrdersPageActions } from './_hooks/useOwnerOrdersPageActions';
import { useOwnerOrdersPageData } from './_hooks/useOwnerOrdersPageData';
import { CancelOrderRefundModal } from './_components/CancelOrderRefundModal';
import { OrderDetailModal } from './_components/OrderDetailModal';
import { OwnerOrdersHeaderSection } from './_sections/OwnerOrdersHeaderSection';
import { OwnerOrdersTableSection } from './_sections/OwnerOrdersTableSection';

export default function OwnerOrdersPage() {
  const data = useOwnerOrdersPageData();
  const actions = useOwnerOrdersPageActions(data);

  return (
    <>
      <OwnerOrdersHeaderSection />
      <OwnerOrdersTableSection data={data} actions={actions} />
      <CancelOrderRefundModal actions={actions} />
      <OrderDetailModal
        orderId={actions.detailOrderId}
        open={Boolean(actions.detailOrderId)}
        onClose={actions.closeOrderDetail}
        actions={actions}
      />
    </>
  );
}
