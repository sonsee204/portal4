/**
 * Ao Trình (NALee Sports)
 */

import { describe, expect, it } from 'vitest';
import { toFinanceSortVariables, toSortByOrder } from './useDataTableSort';

describe('useDataTableSort helpers', () => {
  it('toSortByOrder maps field and direction', () => {
    expect(toSortByOrder('date', 'asc')).toEqual({
      sortBy: 'date',
      sortOrder: 'asc',
    });
  });

  it('toFinanceSortVariables maps finance shape', () => {
    expect(toFinanceSortVariables('completedAt', 'desc')).toEqual({
      field: 'completedAt',
      order: 'desc',
    });
  });
});
