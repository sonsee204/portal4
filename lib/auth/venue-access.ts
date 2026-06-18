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

import { GRAPHQL_URL } from './constants';

const VENUE_ACCESS_QUERY = `
  query PortalVenueAccess {
    myVenuesStats {
      totalVenues
    }
  }
`;

export async function fetchHasVenueAccess(
  accessToken: string,
  extraHeaders: Record<string, string> = {},
): Promise<boolean> {
  try {
    const response = await fetch(GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client-source': 'portal',
        'Apollo-Require-Preflight': 'true',
        Authorization: `Bearer ${accessToken}`,
        ...extraHeaders,
      },
      body: JSON.stringify({ query: VENUE_ACCESS_QUERY }),
    });

    const result = (await response.json()) as {
      data?: { myVenuesStats?: { totalVenues?: number } };
    };

    return (result.data?.myVenuesStats?.totalVenues ?? 0) > 0;
  } catch {
    return false;
  }
}
