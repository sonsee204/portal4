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

import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useVenueContext } from '@/components/providers/VenueContextProvider';
import {
  useCreateStaffOrder,
  useLookupCustomerByPhone,
  useValidateOrderPromoCode,
  useVenueCategories,
  useVenueEnabledOrderTypes,
  useVenueProducts,
  type VenueProductNode,
} from '@/hooks/owner';
import { OrderType, ProductStatus, VenueAction } from '@/graphql/generated';
import type { ValidateOrderPromoCodeQuery } from '@/graphql/generated';
import { addDays, startOfDay } from '@/lib/date/calendar';
import {
  calcCartSubtotal,
  calcCartTotal,
} from '@/lib/order/create-order-cart';
import {
  createOrderSchema,
  getDefaultCreateOrderFormValues,
  type CreateOrderFormValues,
} from '@/lib/order/create-order.schema';
import {
  CREATE_ORDER_PAGE_SIZE,
  ORDER_TYPE_FIELD_RULES,
  SERVICE_DATE_MAX_DAYS_AGO,
} from './create-order-page.constants';

export function useCreateOrderPageData() {
  const searchParams = useSearchParams();
  const { selectedVenueId, selectedVenue, loading: venueLoading, canVenue } =
    useVenueContext();

  const form = useForm<CreateOrderFormValues>({
    resolver: zodResolver(createOrderSchema),
    mode: 'onChange',
    defaultValues: getDefaultCreateOrderFormValues(),
  });

  const { watch, setValue, getValues, handleSubmit: rhfHandleSubmit } = form;
  // RHF watch drives reactive POS form state (cart, customer, meta).
  // eslint-disable-next-line react-hooks/incompatible-library -- react-hook-form watch
  const formValues = watch();

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromotion, setAppliedPromotion] = useState<
    NonNullable<
      ValidateOrderPromoCodeQuery['validateOrderPromoCode']['promotion']
    > | null
  >(null);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [foundCustomer, setFoundCustomer] = useState<{
    _id: string;
    displayName?: string | null;
  } | null>(null);

  const phoneDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    venueName,
    hasOrderService,
    orderTypes,
    loading: orderTypesLoading,
  } = useVenueEnabledOrderTypes(selectedVenueId);

  const {
    products,
    loading: productsLoading,
    refetch: refetchProducts,
    hasNextPage: productsHasNextPage,
    loadMore: loadMoreProducts,
    isLoadingMore: productsLoadingMore,
  } = useVenueProducts(
    selectedVenueId,
    {
      status: ProductStatus.Active,
      ...(selectedCategoryId ? { categoryId: selectedCategoryId } : {}),
      ...(searchQuery.trim() ? { searchQuery: searchQuery.trim() } : {}),
    },
    undefined,
    { limit: CREATE_ORDER_PAGE_SIZE },
  );

  const { categories, loading: categoriesLoading } = useVenueCategories(
    selectedVenueId,
  );

  const { lookupCustomerByPhone, loading: customerLoading } =
    useLookupCustomerByPhone();
  const { validateCode: validatePromoCode, loading: promoLoading } =
    useValidateOrderPromoCode();
  const { createStaffOrder, loading: isCreating } = useCreateStaffOrder();

  const prefillOrderType = searchParams.get('orderType');

  useEffect(() => {
    if (!formValues.selectedOrderType && orderTypes.length > 0) {
      const match = prefillOrderType
        ? orderTypes.find((t) => t.orderType === prefillOrderType)
        : null;
      setValue('selectedOrderType', (match ?? orderTypes[0])!.orderType, {
        shouldValidate: true,
      });
    }
  }, [formValues.selectedOrderType, orderTypes, prefillOrderType, setValue]);

  useEffect(() => {
    const phone = formValues.customerPhone;
    if (phoneDebounceRef.current) clearTimeout(phoneDebounceRef.current);

    if (!phone || phone.length < 9) {
      setFoundCustomer(null);
      return;
    }

    phoneDebounceRef.current = setTimeout(async () => {
      const customer = await lookupCustomerByPhone(phone);
      if (customer?._id) {
        setFoundCustomer(customer);
        if (!formValues.customerName.trim() && customer.displayName) {
          setValue('customerName', customer.displayName, {
            shouldValidate: true,
          });
        }
      } else {
        setFoundCustomer(null);
      }
    }, 500);

    return () => {
      if (phoneDebounceRef.current) clearTimeout(phoneDebounceRef.current);
    };
  }, [
    formValues.customerName,
    formValues.customerPhone,
    lookupCustomerByPhone,
    setValue,
  ]);

  const selectedConfig = useMemo(
    () =>
      orderTypes.find((t) => t.orderType === formValues.selectedOrderType) ??
      null,
    [formValues.selectedOrderType, orderTypes],
  );

  const maxServiceDate = useMemo(() => {
    const d = new Date();
    d.setHours(23, 59, 59, 999);
    return d;
  }, []);

  const minServiceDate = useMemo(
    () => addDays(startOfDay(new Date()), -SERVICE_DATE_MAX_DAYS_AGO),
    [],
  );

  const subtotal = useMemo(
    () => calcCartSubtotal(formValues.cartItems),
    [formValues.cartItems],
  );

  const total = useMemo(
    () => calcCartTotal(subtotal, promoDiscount),
    [subtotal, promoDiscount],
  );

  const productCategoryIds = useMemo(() => {
    const ids = new Set<string>();
    formValues.cartItems.forEach((item) => {
      const product = products.find((p) => p._id === item.productId);
      const categoryId = product?.category?._id;
      if (categoryId) ids.add(categoryId);
    });
    return Array.from(ids);
  }, [formValues.cartItems, products]);

  const fieldRules = formValues.selectedOrderType
    ? ORDER_TYPE_FIELD_RULES[formValues.selectedOrderType as OrderType]
    : undefined;

  const productById = useMemo(() => {
    const map = new Map<string, VenueProductNode>();
    products.forEach((p) => map.set(p._id, p));
    return map;
  }, [products]);

  const setCartItems = (
    next:
      | CreateOrderFormValues['cartItems']
      | ((
          prev: CreateOrderFormValues['cartItems'],
        ) => CreateOrderFormValues['cartItems']),
  ) => {
    const resolved =
      typeof next === 'function' ? next(formValues.cartItems) : next;
    setValue('cartItems', resolved, { shouldValidate: true, shouldDirty: true });
  };

  return {
    venueId: selectedVenueId,
    venueName: venueName ?? selectedVenue?.name ?? null,
    venueLoading,
    hasOrderService,
    canOverridePrice: canVenue(VenueAction.OverridePrice),
    canCreateOrder: canVenue(VenueAction.CreateOrder),
    form,
    formValues,
    getValues,
    setValue,
    rhfHandleSubmit,
    selectedCategoryId,
    setSelectedCategoryId,
    searchQuery,
    setSearchQuery,
    promoCode,
    setPromoCode,
    appliedPromotion,
    setAppliedPromotion,
    promoDiscount,
    setPromoDiscount,
    promoError,
    setPromoError,
    foundCustomer,
    orderTypes,
    orderTypesLoading,
    selectedConfig,
    maxServiceDate,
    minServiceDate,
    products,
    productsLoading,
    refetchProducts,
    productsHasNextPage,
    loadMoreProducts,
    productsLoadingMore,
    categories,
    categoriesLoading,
    customerLoading,
    promoLoading,
    validatePromoCode,
    createStaffOrder,
    isCreating,
    subtotal,
    total,
    productCategoryIds,
    showCourtField: Boolean(fieldRules?.court),
    showTableField: Boolean(fieldRules?.table),
    productById,
    setCartItems,
    cartItemCount: formValues.cartItems.length,
  };
}

export type CreateOrderPageData = ReturnType<typeof useCreateOrderPageData>;
