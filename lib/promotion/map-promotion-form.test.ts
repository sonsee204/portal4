/**
 * Ao Trình (NALee Sports)
 */

import { describe, expect, it } from 'vitest';
import {
  mapFormToCreatePromotionInput,
  mapFormToUpdatePromotionInput,
} from './map-promotion-form';
import { CREATE_PROMOTION_DEFAULT_VALUES } from './create-promotion-schema';

describe('mapFormToCreatePromotionInput', () => {
  it('maps voucher with code to create input', () => {
    const values = {
      ...CREATE_PROMOTION_DEFAULT_VALUES,
      name: '  Test Promo  ',
      description: 'desc',
      value: '10',
      code: ' save10 ',
      startDate: new Date('2026-01-01'),
      endDate: new Date('2026-02-01'),
    };

    const input = mapFormToCreatePromotionInput('venue-1', values);

    expect(input.venueId).toBe('venue-1');
    expect(input.name).toBe('Test Promo');
    expect(input.value).toBe(10);
    expect(input.code).toBe('SAVE10');
    expect(input.startDate).toBe(values.startDate.toISOString());
  });

  it('includes court ids for specific courts scope', () => {
    const values = {
      ...CREATE_PROMOTION_DEFAULT_VALUES,
      value: '5',
      scope: 'SPECIFIC_COURTS' as const,
      selectedCourtIds: ['c1', 'c2'],
      startDate: new Date('2026-01-01'),
      endDate: new Date('2026-02-01'),
    };

    const input = mapFormToCreatePromotionInput('venue-1', values);
    expect(input.courtIds).toEqual(['c1', 'c2']);
  });

  it('includes product categories for products scope', () => {
    const values = {
      ...CREATE_PROMOTION_DEFAULT_VALUES,
      value: '5',
      scope: 'PRODUCTS' as const,
      selectedProductCategoryIds: ['cat-1'],
      startDate: new Date('2026-01-01'),
      endDate: new Date('2026-02-01'),
    };

    const input = mapFormToCreatePromotionInput('venue-1', values);
    expect(input.productCategoryIds).toEqual(['cat-1']);
  });
});

describe('mapFormToUpdatePromotionInput', () => {
  it('maps update with null max discount when empty', () => {
    const values = {
      ...CREATE_PROMOTION_DEFAULT_VALUES,
      name: 'Updated',
      value: '15',
      maxDiscountAmount: '',
      startDate: new Date('2026-01-01'),
      endDate: new Date('2026-02-01'),
    };

    const input = mapFormToUpdatePromotionInput('promo-1', values);
    expect(input.promotionId).toBe('promo-1');
    expect(input.maxDiscountAmount).toBeNull();
  });
});
