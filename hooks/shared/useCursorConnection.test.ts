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

import { describe, expect, it, vi } from 'vitest';
import { fetchAllConnectionPages } from './useCursorConnection';

describe('fetchAllConnectionPages', () => {
  it('stops when endCursor repeats (stuck pagination)', async () => {
    const fetchPage = vi.fn(async () => ({
      edges: [{ cursor: 'c1', node: { id: '1' } }],
      pageInfo: { hasNextPage: true, endCursor: 'c1' },
    }));

    const all = await fetchAllConnectionPages<{ id: string }>({ fetchPage });

    expect(all).toHaveLength(1);
    expect(fetchPage).toHaveBeenCalledTimes(2);
  });

  it('collects all pages until hasNextPage is false', async () => {
    const fetchPage = vi
      .fn()
      .mockResolvedValueOnce({
        edges: [
          { cursor: 'c1', node: { id: '1' } },
          { cursor: 'c2', node: { id: '2' } },
        ],
        pageInfo: { hasNextPage: true, endCursor: 'c2' },
      })
      .mockResolvedValueOnce({
        edges: [{ cursor: 'c3', node: { id: '3' } }],
        pageInfo: { hasNextPage: false, endCursor: 'c3' },
      });

    const all = await fetchAllConnectionPages<{ id: string }>({ fetchPage });

    expect(all.map((n) => n.id)).toEqual(['1', '2', '3']);
    expect(fetchPage).toHaveBeenCalledTimes(2);
  });
});
