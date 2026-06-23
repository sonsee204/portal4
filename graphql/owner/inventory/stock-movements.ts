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

import { gql } from 'graphql-tag';

const STOCK_MOVEMENT_LIST_FIELDS = gql`
  fragment StockMovementListFields on StockMovement {
    _id
    productId
    venueId
    variantId
    type
    quantity
    importPrice
    totalCost
    supplierName
    supplierContact
    invoiceNumber
    orderId
    salePrice
    costAtSale
    adjustmentReason
    relatedVenueId
    relatedProductId
    previousStock
    newStock
    note
    createdBy
    createdAt
    updatedAt
    product {
      _id
      name
      sku
      images {
        url
        isPrimary
      }
      price
      costPrice
      averageCost
      lastImportPrice
      stockQuantity
    }
    createdByUser {
      _id
      displayName
      photoURL
    }
  }
`;

export const STOCK_MOVEMENTS_CONNECTION = gql`
  query StockMovementsConnection(
    $venueId: ID!
    $filter: StockMovementFilterInput
    $sort: StockMovementSortInput
    $pagination: CursorPageInput
  ) {
    stockMovementsConnection(
      venueId: $venueId
      filter: $filter
      sort: $sort
      pagination: $pagination
    ) {
      totalCount
      edges {
        cursor
        node {
          ...StockMovementListFields
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
  ${STOCK_MOVEMENT_LIST_FIELDS}
`;
