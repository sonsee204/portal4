/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 */

'use client';

import { useCreateOrderPageActions } from './_hooks/useCreateOrderPageActions';
import { useCreateOrderPageData } from './_hooks/useCreateOrderPageData';
import { CreateOrderCheckoutSection } from './_sections/CreateOrderCheckoutSection';
import { CreateOrderCustomerSection } from './_sections/CreateOrderCustomerSection';
import { CreateOrderHeaderSection } from './_sections/CreateOrderHeaderSection';
import { CreateOrderMetaSection } from './_sections/CreateOrderMetaSection';
import { CreateOrderProductsSection } from './_sections/CreateOrderProductsSection';

export default function CreateOrderPage() {
  const data = useCreateOrderPageData();
  const actions = useCreateOrderPageActions(data);

  return (
    <>
      <CreateOrderHeaderSection data={data} actions={actions} />
      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
        <div className="space-y-6">
          <CreateOrderMetaSection data={data} />
          <CreateOrderCustomerSection data={data} />
          <CreateOrderProductsSection data={data} actions={actions} />
        </div>
        <CreateOrderCheckoutSection data={data} actions={actions} />
      </div>
    </>
  );
}
