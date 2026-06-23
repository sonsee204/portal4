/**
 * Ao Trình (NALee Sports)
 */

import { describe, expect, it } from 'vitest';
import {
  aggregatePortfolioMetric,
  buildPortfolioSummary,
  computeNetMarginPercent,
} from './portfolio-aggregate';

describe('aggregatePortfolioMetric', () => {
  it('sums values and computes change percent', () => {
    const result = aggregatePortfolioMetric(
      [
        { grossRevenue: { value: 100, previousValue: 80 } },
        { grossRevenue: { value: 50, previousValue: 20 } },
      ],
      (row) => row.grossRevenue,
    );

    expect(result.value).toBe(150);
    expect(result.previousValue).toBe(100);
    expect(result.changePercent).toBe(50);
  });

  it('handles zero previous value with non-zero current', () => {
    const result = aggregatePortfolioMetric(
      [{ amount: { value: 10, previousValue: 0 } }],
      (row) => row.amount,
    );

    expect(result.changePercent).toBe(100);
  });
});

describe('computeNetMarginPercent', () => {
  it('derives margin from profit and revenue', () => {
    const margin = computeNetMarginPercent(
      { value: 20, previousValue: 10, changePercent: 0 },
      { value: 100, previousValue: 50, changePercent: 0 },
    );

    expect(margin.value).toBe(20);
    expect(margin.previousValue).toBe(20);
  });
});

describe('buildPortfolioSummary', () => {
  it('returns null for empty venues', () => {
    expect(buildPortfolioSummary([])).toBeNull();
  });

  it('aggregates portfolio rows', () => {
    const summary = buildPortfolioSummary([
      {
        venueId: '1',
        venueName: 'A',
        completedOrders: 5,
        grossRevenue: { value: 100, previousValue: 80, changePercent: 25 },
        netProfit: { value: 20, previousValue: 10, changePercent: 100 },
        netMarginPercent: { value: 20, previousValue: 12.5, changePercent: 60 },
        grossProfit: { value: 40, previousValue: 30, changePercent: 33.3 },
        netRevenue: { value: 100, previousValue: 80, changePercent: 25 },
      },
    ]);

    expect(summary?.grossRevenue.value).toBe(100);
    expect(summary?.completedOrders.value).toBe(5);
    expect(summary?.grossProfit.value).toBe(40);
  });
});
