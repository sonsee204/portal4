/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 */

import { describe, expect, it } from 'vitest';
import {
  getInfiniteScrollStatusMessage,
  shouldShowInfiniteScrollFooter,
} from '@/components/molecules/ConnectionInfiniteScroll/connection-infinite-scroll.utils';

describe('connection-infinite-scroll.utils', () => {
  it('shows range while more pages exist', () => {
    expect(getInfiniteScrollStatusMessage(20, 100, true)).toBe(
      'Hiển thị 1–20 / 100',
    );
  });

  it('shows end message when all loaded with total', () => {
    expect(getInfiniteScrollStatusMessage(100, 100, false)).toBe(
      'Đã hiển thị tất cả (100 mục)',
    );
  });

  it('shows end message without total count', () => {
    expect(getInfiniteScrollStatusMessage(42, null, false)).toBe(
      'Đã hiển thị tất cả (42 mục)',
    );
  });

  it('hides footer when empty and idle', () => {
    expect(shouldShowInfiniteScrollFooter(0, false, false, false)).toBe(false);
  });

  it('shows footer while loading more', () => {
    expect(shouldShowInfiniteScrollFooter(10, true, false, true)).toBe(true);
  });

  it('shows footer when has next page', () => {
    expect(shouldShowInfiniteScrollFooter(0, true, false, false)).toBe(true);
  });
});
