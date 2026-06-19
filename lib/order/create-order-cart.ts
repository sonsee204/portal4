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

import type { CreateOrderCartItem } from './create-order.schema';

export interface CreateOrderProductSource {
  _id: string;
  name: string;
  price: number;
  trackInventory?: boolean | null;
  stockQuantity?: number | null;
  categoryId?: string | null;
}

export function getCartQuantity(
  cartItems: CreateOrderCartItem[],
  productId: string,
): number {
  return cartItems.find((item) => item.productId === productId)?.quantity ?? 0;
}

export function canIncreaseCartQuantity(
  product: CreateOrderProductSource,
  currentQuantity: number,
): boolean {
  if (!product.trackInventory) return true;
  const stock = product.stockQuantity ?? 0;
  return currentQuantity < stock;
}

export function addProductToCart(
  cartItems: CreateOrderCartItem[],
  product: CreateOrderProductSource,
): CreateOrderCartItem[] {
  const existing = cartItems.find((item) => item.productId === product._id);
  if (existing) {
    if (!canIncreaseCartQuantity(product, existing.quantity)) {
      return cartItems;
    }
    return cartItems.map((item) =>
      item.productId === product._id
        ? { ...item, quantity: item.quantity + 1 }
        : item,
    );
  }
  if (
    product.trackInventory &&
    (product.stockQuantity ?? 0) < 1
  ) {
    return cartItems;
  }
  return [
    ...cartItems,
    {
      productId: product._id,
      name: product.name,
      quantity: 1,
      unitPrice: product.price,
      discount: 0,
    },
  ];
}

export function removeProductFromCart(
  cartItems: CreateOrderCartItem[],
  productId: string,
): CreateOrderCartItem[] {
  const existing = cartItems.find((item) => item.productId === productId);
  if (!existing) return cartItems;
  if (existing.quantity > 1) {
    return cartItems.map((item) =>
      item.productId === productId
        ? { ...item, quantity: item.quantity - 1 }
        : item,
    );
  }
  return cartItems.filter((item) => item.productId !== productId);
}

export function setCartQuantity(
  cartItems: CreateOrderCartItem[],
  productId: string,
  newQuantity: number,
  product?: CreateOrderProductSource,
): CreateOrderCartItem[] {
  if (product?.trackInventory) {
    const maxStock = product.stockQuantity ?? 0;
    if (newQuantity > maxStock) {
      newQuantity = maxStock;
    }
  }
  if (newQuantity <= 0) {
    return cartItems.filter((item) => item.productId !== productId);
  }
  return cartItems.map((item) =>
    item.productId === productId ? { ...item, quantity: newQuantity } : item,
  );
}

export function calcCartSubtotal(cartItems: CreateOrderCartItem[]): number {
  return cartItems.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0,
  );
}

export function calcCartTotal(
  subtotal: number,
  promoDiscount: number,
): number {
  return Math.max(0, subtotal - promoDiscount);
}
