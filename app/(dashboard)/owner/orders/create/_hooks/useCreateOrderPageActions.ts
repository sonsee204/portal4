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

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { FieldErrors } from 'react-hook-form';
import type { VenueProductNode } from '@/hooks/owner';
import {
  addProductToCart,
  getCartQuantity,
  removeProductFromCart,
  setCartQuantity,
} from '@/lib/order/create-order-cart';
import type { CreateOrderFormValues } from '@/lib/order/create-order.schema';
import { mapCreateOrderInput } from '@/lib/order/map-create-order-input';
import { showError, showSuccess } from '@/lib/toast';
import type { CreateOrderPageData } from './useCreateOrderPageData';

export function useCreateOrderPageActions(data: CreateOrderPageData) {
  const router = useRouter();
  const {
    venueId,
    venueLoading,
    getValues,
    setValue,
    rhfHandleSubmit,
    setCartItems,
    cartItemCount,
    promoCode,
    setPromoCode,
    appliedPromotion,
    setAppliedPromotion,
    setPromoDiscount,
    setPromoError,
    subtotal,
    productCategoryIds,
    validatePromoCode,
    createStaffOrder,
    isCreating,
    productById,
  } = data;

  const [abandonDialogOpen, setAbandonDialogOpen] = useState(false);

  useEffect(() => {
    if (venueLoading) return;
    if (!venueId) {
      showError('Chọn cơ sở trước khi tạo đơn');
      router.replace('/owner/orders');
    }
  }, [venueId, venueLoading, router]);

  useEffect(() => {
    const hasDraft = cartItemCount > 0;
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!hasDraft) return;
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [cartItemCount]);

  const getQuantity = useCallback(
    (productId: string) => getCartQuantity(getValues('cartItems'), productId),
    [getValues],
  );

  const toProductSource = (product: VenueProductNode) => ({
    _id: product._id,
    name: product.name,
    price: product.price,
    trackInventory: product.trackInventory,
    stockQuantity: product.stockQuantity,
    categoryId: product.category?._id ?? null,
  });

  const handleAddProduct = useCallback(
    (product: VenueProductNode) => {
      setCartItems((prev) =>
        addProductToCart(prev, toProductSource(product)),
      );
    },
    [setCartItems],
  );

  const handleRemoveProduct = useCallback(
    (productId: string) => {
      setCartItems((prev) => removeProductFromCart(prev, productId));
    },
    [setCartItems],
  );

  const handleSetQuantity = useCallback(
    (productId: string, quantity: number) => {
      const product = productById.get(productId);
      setCartItems((prev) =>
        setCartQuantity(
          prev,
          productId,
          quantity,
          product ? toProductSource(product) : undefined,
        ),
      );
    },
    [productById, setCartItems],
  );

  const handleManualPriceToggle = useCallback(
    (enabled: boolean) => {
      setValue('isManualPrice', enabled, {
        shouldValidate: true,
        shouldDirty: true,
      });
      if (enabled) {
        setAppliedPromotion(null);
        setPromoCode('');
        setPromoDiscount(0);
        setPromoError(null);
      } else {
        setValue('manualAmount', '', { shouldDirty: true });
        setValue('manualPriceNote', '', { shouldDirty: true });
      }
    },
    [
      setAppliedPromotion,
      setPromoCode,
      setPromoDiscount,
      setPromoError,
      setValue,
    ],
  );

  const handleApplyPromoCode = useCallback(async () => {
    if (!promoCode.trim() || !venueId || getValues('isManualPrice')) return;

    setPromoError(null);
    const result = await validatePromoCode({
      code: promoCode.trim().toUpperCase(),
      venueId,
      subtotal,
      productCategoryIds,
    });

    if (!result) {
      setPromoError('Không thể kiểm tra mã khuyến mãi');
      return;
    }

    if (!result.isValid) {
      setPromoError(result.errorMessage ?? 'Mã khuyến mãi không hợp lệ');
      return;
    }

    if (result.promotion && result.estimatedDiscount != null) {
      setAppliedPromotion(result.promotion);
      setPromoDiscount(result.estimatedDiscount);
      setPromoCode('');
    }
  }, [
    getValues,
    promoCode,
    productCategoryIds,
    setAppliedPromotion,
    setPromoCode,
    setPromoDiscount,
    setPromoError,
    subtotal,
    validatePromoCode,
    venueId,
  ]);

  const handleRemovePromotion = useCallback(() => {
    setAppliedPromotion(null);
    setPromoDiscount(0);
    setPromoError(null);
  }, [setAppliedPromotion, setPromoDiscount, setPromoError]);

  const submitOrder = useCallback(async () => {
    if (!venueId) return;

    try {
      const values = getValues();
      const input = mapCreateOrderInput({
        venueId,
        values,
        discountCode: appliedPromotion?.code,
      });
      const order = await createStaffOrder(input);
      if (order?._id) {
        showSuccess(`Đã tạo đơn ${order.orderCode}`);
        router.replace(`/owner/orders?orderId=${order._id}`);
      }
    } catch {
      // Toast handled by mutation helper
    }
  }, [appliedPromotion, createStaffOrder, getValues, router, venueId]);

  const onInvalidOrder = useCallback((errors: FieldErrors<CreateOrderFormValues>) => {
    const message =
      errors.cartItems?.message ||
      errors.selectedOrderType?.message ||
      errors.courtNumber?.message ||
      errors.serviceDate?.message ||
      'Vui lòng kiểm tra lại thông tin đơn hàng';
    showError(String(message));
  }, []);

  const handleCreateOrder = useCallback(() => {
    void rhfHandleSubmit(submitOrder, onInvalidOrder)();
  }, [onInvalidOrder, rhfHandleSubmit, submitOrder]);

  const handleBack = useCallback(() => {
    if (cartItemCount > 0) {
      setAbandonDialogOpen(true);
      return;
    }
    router.push('/owner/orders');
  }, [cartItemCount, router]);

  const confirmAbandon = useCallback(() => {
    setAbandonDialogOpen(false);
    router.push('/owner/orders');
  }, [router]);

  const cancelAbandon = useCallback(() => {
    setAbandonDialogOpen(false);
  }, []);

  return {
    getQuantity,
    handleAddProduct,
    handleRemoveProduct,
    handleSetQuantity,
    handleManualPriceToggle,
    handleApplyPromoCode,
    handleRemovePromotion,
    handleCreateOrder,
    handleBack,
    abandonDialogOpen,
    confirmAbandon,
    cancelAbandon,
    isCreating,
  };
}

export type CreateOrderPageActions = ReturnType<typeof useCreateOrderPageActions>;
