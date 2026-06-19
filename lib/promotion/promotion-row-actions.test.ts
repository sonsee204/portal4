/**
 * Ao Trình (NALee Sports)
 */

import { describe, expect, it } from 'vitest';
import { PromotionStatus } from '@/graphql/generated';
import {
  getPromotionRowActionAvailability,
  getPromotionActionDialogCopy,
} from './promotion-row-actions';

describe('getPromotionRowActionAvailability', () => {
  const futureEnd = new Date(Date.now() + 86400000).toISOString();

  it('owner can approve pending promotions', () => {
    const result = getPromotionRowActionAvailability({
      status: PromotionStatus.PendingApproval,
      endDate: futureEnd,
      isVenueOwner: true,
    });
    expect(result.canApprove).toBe(true);
    expect(result.canReject).toBe(true);
    expect(result.canActivate).toBe(false);
  });

  it('staff cannot approve pending promotions', () => {
    const result = getPromotionRowActionAvailability({
      status: PromotionStatus.PendingApproval,
      endDate: futureEnd,
      isVenueOwner: false,
    });
    expect(result.canApprove).toBe(false);
    expect(result.canReject).toBe(false);
  });

  it('owner can activate draft when not expired', () => {
    const result = getPromotionRowActionAvailability({
      status: PromotionStatus.Draft,
      endDate: futureEnd,
      isVenueOwner: true,
    });
    expect(result.canActivate).toBe(true);
    expect(result.canEdit).toBe(true);
  });

  it('cannot activate expired draft', () => {
    const result = getPromotionRowActionAvailability({
      status: PromotionStatus.Draft,
      endDate: new Date(Date.now() - 86400000).toISOString(),
      isVenueOwner: true,
    });
    expect(result.canActivate).toBe(false);
  });
});

describe('getPromotionActionDialogCopy', () => {
  it('marks delete as destructive', () => {
    const copy = getPromotionActionDialogCopy('delete');
    expect(copy.destructive).toBe(true);
    expect(copy.title).toBe('Xóa khuyến mãi');
  });
});
