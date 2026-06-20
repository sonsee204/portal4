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

import { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/atoms/Button';
import { IonIcon } from '@/components/atoms/IonIcon';
import { VenueActionGate } from '@/components/atoms/VenueActionGate';
import { Modal } from '@/components/molecules/Modal';
import { VenueAction, StockMovementType } from '@/graphql/generated';
import {
  useMoveProductsToVenue,
  useMyVenuesForProductTransfer,
} from '@/hooks/owner';
import {
  buildTransferProductsInput,
  getDefaultTransferQuantity,
  validateTransferQuantity,
  type TransferProductSnapshot,
} from '@/lib/inventory/product-transfer';
import type { OwnerProductsPageActions } from '../_hooks/useOwnerProductsPageActions';
import type { OwnerProductsPageData } from '../_hooks/useOwnerProductsPageData';
import { TransferDestinationVenueSection } from './TransferDestinationVenueSection';
import { TransferProductsListSection } from './TransferProductsListSection';

interface TransferProductsModalProps {
  data: OwnerProductsPageData;
  actions: OwnerProductsPageActions;
}

function buildInitialQuantities(
  products: TransferProductSnapshot[]
): Record<string, number> {
  const initialQuantities: Record<string, number> = {};
  for (const product of products) {
    initialQuantities[product._id] = getDefaultTransferQuantity(product);
  }
  return initialQuantities;
}

interface TransferProductsModalBodyProps {
  venueId: string;
  selectedProducts: TransferProductSnapshot[];
  onClose: () => void;
  onSuccess: () => void;
}

function TransferProductsModalBody({
  venueId,
  selectedProducts,
  onClose,
  onSuccess,
}: TransferProductsModalBodyProps) {
  const router = useRouter();
  const { moveProducts, transferring } = useMoveProductsToVenue();
  const { venues, loading: loadingVenues } = useMyVenuesForProductTransfer();

  const [selectedVenueId, setSelectedVenueId] = useState<string | null>(null);
  const [quantities, setQuantities] = useState(() =>
    buildInitialQuantities(selectedProducts)
  );
  const [submitError, setSubmitError] = useState<string | null>(null);

  const availableVenues = useMemo(
    () => venues.filter((venue) => venue._id !== venueId),
    [venues, venueId]
  );

  const isQuantitiesValid = useMemo(
    () =>
      selectedProducts.every(
        (product) =>
          validateTransferQuantity(product, quantities[product._id] ?? 0).valid
      ),
    [selectedProducts, quantities]
  );

  const canSubmit =
    Boolean(selectedVenueId) &&
    selectedProducts.length > 0 &&
    isQuantitiesValid &&
    !transferring;

  const handleQuantityChange = useCallback(
    (productId: string, value: string) => {
      const parsed = parseInt(value, 10);
      setQuantities((prev) => ({
        ...prev,
        [productId]:
          value === '' || Number.isNaN(parsed) ? 0 : Math.max(0, parsed),
      }));
    },
    []
  );

  const handleSubmit = useCallback(async () => {
    if (!selectedVenueId || !canSubmit) {
      return;
    }

    setSubmitError(null);

    try {
      const result = await moveProducts(
        buildTransferProductsInput({
          sourceVenueId: venueId,
          destinationVenueId: selectedVenueId,
          items: selectedProducts.map((product) => ({
            productId: product._id,
            quantity: quantities[product._id] ?? 1,
          })),
        })
      );

      if (result && result.success > 0) {
        onSuccess();
        onClose();
      } else if (result && result.success === 0) {
        setSubmitError('Không thể lưu chuyển sản phẩm. Vui lòng thử lại.');
      }
    } catch {
      // Error toast handled in hook
    }
  }, [
    venueId,
    selectedVenueId,
    canSubmit,
    moveProducts,
    selectedProducts,
    quantities,
    onSuccess,
    onClose,
  ]);

  return (
    <>
      <div className="space-y-4 p-6">
        <TransferProductsListSection
          products={selectedProducts}
          quantities={quantities}
          onQuantityChange={handleQuantityChange}
        />

        <TransferDestinationVenueSection
          venues={availableVenues}
          loading={loadingVenues}
          selectedVenueId={selectedVenueId}
          onSelectVenue={setSelectedVenueId}
        />

        <div className="border-surface-border bg-surface-hover/40 flex gap-3 rounded-xl border px-4 py-3">
          <IonIcon
            name="information-circle-outline"
            size="md"
            className="text-primary mt-0.5 shrink-0"
          />
          <p className="text-muted text-sm">
            Sản phẩm trùng tên, danh mục và giá ở cơ sở đích sẽ được cộng tồn
            thay vì tạo mới.
          </p>
        </div>

        {submitError && <p className="text-sm text-red-400">{submitError}</p>}
      </div>

      <div className="border-surface-border flex flex-wrap items-center justify-between gap-3 border-t px-6 py-4">
        <button
          type="button"
          onClick={() =>
            router.push(
              `/owner/inventory/history?type=${StockMovementType.TransferOut}`
            )
          }
          className="text-primary hover:text-primary/80 text-sm font-medium"
        >
          Xem lịch sử kho
        </button>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={onClose}>
            Hủy
          </Button>
          <Button
            variant="primary"
            iconLeft="swap-horizontal-outline"
            disabled={!canSubmit || transferring}
            onClick={() => void handleSubmit()}
          >
            {transferring ? 'Đang lưu chuyển...' : 'Lưu chuyển'}
          </Button>
        </div>
      </div>
    </>
  );
}

export function TransferProductsModal({
  data,
  actions,
}: TransferProductsModalProps) {
  const { venueId } = data;
  const {
    transferModalOpen,
    transferSessionId,
    selectedProducts,
    closeTransferModal,
    handleTransferSuccess,
  } = actions;

  return (
    <Modal
      open={transferModalOpen}
      onClose={closeTransferModal}
      title="Lưu chuyển sản phẩm"
      size="lg"
    >
      <VenueActionGate action={VenueAction.ManageProducts}>
        {transferModalOpen && venueId && selectedProducts.length > 0 ? (
          <TransferProductsModalBody
            key={transferSessionId}
            venueId={venueId}
            selectedProducts={selectedProducts}
            onClose={closeTransferModal}
            onSuccess={handleTransferSuccess}
          />
        ) : null}
      </VenueActionGate>
    </Modal>
  );
}
