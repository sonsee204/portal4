/**
 * Ao Trình (NALee Sports)
 */

import { describe, expect, it } from 'vitest';
import { buildSortedConnectionVariables } from './useSortedConnectionQuery';

describe('buildSortedConnectionVariables', () => {
  it('includes sort and pagination', () => {
    expect(
      buildSortedConnectionVariables(
        { venueId: 'v1', filter: { statuses: ['PENDING'] } },
        { sortBy: 'date', sortOrder: 'desc' },
        { limit: 20 },
      ),
    ).toEqual({
      venueId: 'v1',
      filter: { statuses: ['PENDING'] },
      sort: { sortBy: 'date', sortOrder: 'desc' },
      pagination: { first: 20, after: null },
    });
  });

  it('passes after cursor for fetchMore', () => {
    expect(
      buildSortedConnectionVariables(
        { venueId: 'v1' },
        { sortBy: 'createdAt', sortOrder: 'desc' },
        { limit: 20 },
        'cursor-abc',
      ),
    ).toMatchObject({
      pagination: { first: 20, after: 'cursor-abc' },
    });
  });
});
