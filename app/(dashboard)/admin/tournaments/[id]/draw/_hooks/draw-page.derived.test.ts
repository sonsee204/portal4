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

import { describe, expect, it } from 'vitest';
import {
  areAllGroupMatchesDone,
  computeEffectiveBracketSize,
  computeExpectedByes,
  computeRoundRobinMatchCount,
  computeTotalGroupMatches,
  isKnockoutSeeded,
} from './draw-page.derived';

describe('draw-page.derived', () => {
  it('computeEffectiveBracketSize rounds up to power of two', () => {
    expect(computeEffectiveBracketSize(5, 0)).toBe(8);
    expect(computeEffectiveBracketSize(8, 16)).toBe(16);
  });

  it('computeExpectedByes subtracts approved players from bracket size', () => {
    expect(computeExpectedByes(8, 5)).toBe(3);
  });

  it('computeRoundRobinMatchCount uses n*(n-1)/2', () => {
    expect(computeRoundRobinMatchCount(4)).toBe(6);
  });

  it('computeTotalGroupMatches scales per-group round robin', () => {
    expect(computeTotalGroupMatches(8, 2)).toBe(12);
  });

  it('areAllGroupMatchesDone requires every match finished or bye', () => {
    expect(
      areAllGroupMatchesDone([
        { status: 'FINISHED', isBye: false } as never,
        { status: 'NOT_STARTED', isBye: true } as never,
      ]),
    ).toBe(true);
  });

  it('isKnockoutSeeded checks round 101 player slots', () => {
    expect(
      isKnockoutSeeded([
        { round: 101, player1: { name: 'A' } } as never,
      ]),
    ).toBe(true);
    expect(isKnockoutSeeded([{ round: 101 } as never])).toBe(false);
  });
});
