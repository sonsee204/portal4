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

export function toggleSelectionSet(
  prev: Set<string>,
  id: string,
): Set<string> {
  const next = new Set(prev);
  if (next.has(id)) {
    next.delete(id);
  } else {
    next.add(id);
  }
  return next;
}

export function toggleSelectAllIds(
  selectedIds: Set<string>,
  allIds: string[],
): Set<string> {
  if (allIds.length === 0) {
    return new Set();
  }

  const allSelected = allIds.every((id) => selectedIds.has(id));
  if (allSelected) {
    const next = new Set(selectedIds);
    for (const id of allIds) {
      next.delete(id);
    }
    return next;
  }

  const next = new Set(selectedIds);
  for (const id of allIds) {
    next.add(id);
  }
  return next;
}
