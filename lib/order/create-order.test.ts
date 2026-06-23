/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 */

import { describe, expect, it } from 'vitest';
import { OrderType, PaymentMethod } from '@/graphql/generated';
import {
  addProductToCart,
  calcCartSubtotal,
  canIncreaseCartQuantity,
  removeProductFromCart,
  setCartQuantity,
} from '@/lib/order/create-order-cart';
import {
  createOrderSchema,
  getDefaultCreateOrderFormValues,
} from '@/lib/order/create-order.schema';
import { mapCreateOrderInput } from '@/lib/order/map-create-order-input';
import { resolveOrderTypeIonIcon } from '@/lib/order/resolve-order-type-icon';

const product = {
  _id: 'p1',
  name: 'Nước suối',
  price: 10000,
  trackInventory: true,
  stockQuantity: 2,
  categoryId: 'c1',
};

describe('createOrderSchema', () => {
  it('rejects empty cart', () => {
    const values = getDefaultCreateOrderFormValues();
    const result = createOrderSchema.safeParse({
      ...values,
      selectedOrderType: OrderType.Retail,
    });
    expect(result.success).toBe(false);
  });

  it('requires court number for delivery to court', () => {
    const values = getDefaultCreateOrderFormValues();
    const result = createOrderSchema.safeParse({
      ...values,
      selectedOrderType: OrderType.DeliveryToCourt,
      cartItems: [
        {
          productId: 'p1',
          name: 'Item',
          quantity: 1,
          unitPrice: 1000,
          discount: 0,
        },
      ],
      courtNumber: '',
    });
    expect(result.success).toBe(false);
  });
});

describe('mapCreateOrderInput', () => {
  it('maps promo and customer fields', () => {
    const values = getDefaultCreateOrderFormValues();
    const input = mapCreateOrderInput({
      venueId: 'v1',
      values: {
        ...values,
        selectedOrderType: OrderType.Retail,
        cartItems: [
          {
            productId: 'p1',
            name: 'Item',
            quantity: 2,
            unitPrice: 5000,
            discount: 0,
          },
        ],
        customerName: 'An',
        customerPhone: '0901234567',
        paymentMethod: PaymentMethod.Cash,
      },
      discountCode: 'SALE10',
    });

    expect(input.venueId).toBe('v1');
    expect(input.orderType).toBe(OrderType.Retail);
    expect(input.items).toHaveLength(1);
    expect(input.discountCode).toBe('SALE10');
    expect(input.customerName).toBe('An');
    expect(input.paymentMethod).toBe(PaymentMethod.Cash);
  });

  it('omits discount when manual price is enabled', () => {
    const values = getDefaultCreateOrderFormValues();
    const input = mapCreateOrderInput({
      venueId: 'v1',
      values: {
        ...values,
        selectedOrderType: OrderType.Retail,
        isManualPrice: true,
        manualPriceNote: 'Giá đặc biệt',
        cartItems: [
          {
            productId: 'p1',
            name: 'Item',
            quantity: 1,
            unitPrice: 5000,
            discount: 0,
            manualUnitPrice: 4000,
          },
        ],
      },
      discountCode: 'SALE10',
    });

    expect(input.isManualPrice).toBe(true);
    expect(input.manualPriceNote).toBe('Giá đặc biệt');
    expect(input.discountCode).toBeUndefined();
    expect(input.items[0]?.unitPrice).toBe(4000);
  });
});

describe('create-order-cart', () => {
  it('respects stock limits when adding', () => {
    let cart = addProductToCart([], product);
    cart = addProductToCart(cart, product);
    cart = addProductToCart(cart, product);
    expect(cart[0]?.quantity).toBe(2);
    expect(canIncreaseCartQuantity(product, 2)).toBe(false);
  });

  it('decrements and removes items', () => {
    let cart = addProductToCart([], product);
    cart = removeProductFromCart(cart, product._id);
    expect(cart).toHaveLength(0);
  });

  it('sets quantity with stock cap', () => {
    const cart = addProductToCart([], product);
    const capped = setCartQuantity(cart, product._id, 99, product);
    expect(capped[0]?.quantity).toBe(2);
    expect(calcCartSubtotal(capped)).toBe(20000);
  });
});

describe('resolveOrderTypeIonIcon', () => {
  it('appends -outline to short venue config icon names', () => {
    expect(resolveOrderTypeIonIcon('cart')).toBe('cart-outline');
    expect(resolveOrderTypeIonIcon('bag-handle')).toBe('bag-handle-outline');
  });

  it('keeps full ionicon names unchanged', () => {
    expect(resolveOrderTypeIonIcon('cart-outline')).toBe('cart-outline');
  });

  it('falls back by order type when icon missing', () => {
    expect(resolveOrderTypeIonIcon(null, OrderType.DineIn)).toBe(
      'restaurant-outline',
    );
  });
});
