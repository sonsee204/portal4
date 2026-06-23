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

const PRODUCT_REPORT_PERIOD_FIELDS = gql`
  fragment ProductReportPeriodFields on ProductReportPeriodInfo {
    from
    to
    timezone
  }
`;

const PRODUCT_REPORT_SUMMARY_FIELDS = gql`
  fragment ProductReportSummaryFields on ProductReportSummary {
    totalRevenue
    previousRevenue
    revenueChangePercent
    totalItemsSold
    previousItemsSold
    itemsChangePercent
    totalOrders
    previousOrders
    ordersChangePercent
    totalCogs
    previousCogs
    grossProfit
    previousGrossProfit
    grossProfitChangePercent
    grossProfitMarginPercent
    uniqueProductsSold
    previousUniqueProductsSold
    bestSellingProduct
    bestSellingCategory
    peakHour
    peakDay
  }
`;

const PRODUCT_SALES_DATA_POINT_FIELDS = gql`
  fragment ProductSalesDataPointFields on ProductSalesDataPoint {
    label
    revenue
    quantitySold
    orderCount
    previousRevenue
  }
`;

const PRODUCT_PERFORMANCE_FIELDS = gql`
  fragment ProductPerformanceFields on ProductPerformance {
    productId
    productName
    sku
    categoryName
    categoryId
    quantitySold
    previousQuantitySold
    revenue
    previousRevenue
    orderCount
    unitPrice
    revenuePercentage
    revenueGrowth
    quantityGrowth
    rank
    imageUrl
  }
`;

const PRODUCT_REPORT_ROW_FIELDS = gql`
  fragment ProductReportRowFields on ProductReportRow {
    productId
    productName
    sku
    imageUrl
    categoryName
    categoryId
    status
    stockQuantity
    trackInventory
    unitPrice
    averageCost
    venueId
    venueName
    soldQuantity
    previousSoldQuantity
    revenue
    previousRevenue
    cogs
    grossProfit
    profitMargin
    revenuePercentage
    revenueGrowth
    rank
  }
`;

const STOCK_MOVEMENT_SUMMARY_FIELDS = gql`
  fragment StockMovementSummaryFields on StockMovement {
    _id
    type
    quantity
    importPrice
    costAtSale
    newStock
    supplierName
    invoiceNumber
    note
    createdAt
  }
`;

export const VENUE_PRODUCT_REPORT = gql`
  ${PRODUCT_REPORT_PERIOD_FIELDS}
  ${PRODUCT_REPORT_SUMMARY_FIELDS}
  ${PRODUCT_SALES_DATA_POINT_FIELDS}
  ${PRODUCT_PERFORMANCE_FIELDS}
  ${PRODUCT_REPORT_ROW_FIELDS}
  query VenueProductReport($filter: ProductReportFilterInput!) {
    venueProductReport(filter: $filter) {
      scope {
        mode
        venueCount
        venueNames
        venueIds
      }
      period {
        ...ProductReportPeriodFields
      }
      comparePeriod {
        ...ProductReportPeriodFields
      }
      summary {
        ...ProductReportSummaryFields
      }
      trend {
        ...ProductSalesDataPointFields
      }
      salesTrend {
        ...ProductSalesDataPointFields
      }
      topProducts {
        ...ProductPerformanceFields
      }
      decliningProducts {
        ...ProductPerformanceFields
      }
      salesByCategory {
        categoryId
        categoryName
        revenue
        quantitySold
        orderCount
        percentage
        growth
      }
      hourlySales {
        hour
        revenue
        quantitySold
        intensity
      }
      inventory {
        totalProducts
        totalStockValue
        totalCostValue
        lowStockCount
        outOfStockCount
      }
      inventoryStatus {
        activeProducts
        lowStockProducts
        outOfStockProducts
        stockTurnoverRate
        totalInventoryValue
        totalProducts
        totalRetailValue
      }
      stockAlerts {
        productId
        productName
        sku
        imageUrl
        categoryName
        currentStock
        lowStockThreshold
        alertType
        recentSales
      }
      profitByProduct {
        productId
        productName
        soldQuantity
        revenue
        cogs
        grossProfit
        profitMargin
      }
      productsTable {
        edges {
          cursor
          node {
            ...ProductReportRowFields
          }
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          endCursor
        }
        totalCount
      }
    }
  }
`;

export const PRODUCT_PERFORMANCE_REPORT = gql`
  ${PRODUCT_REPORT_PERIOD_FIELDS}
  ${PRODUCT_SALES_DATA_POINT_FIELDS}
  ${STOCK_MOVEMENT_SUMMARY_FIELDS}
  query ProductPerformanceReport(
    $productId: ID!
    $filter: ProductReportFilterInput!
  ) {
    productPerformanceReport(productId: $productId, filter: $filter) {
      period {
        ...ProductReportPeriodFields
      }
      product {
        productId
        productName
        sku
        imageUrl
        categoryName
        categoryId
        status
        unit
        unitPrice
        averageCost
        stockQuantity
        trackInventory
        venueId
        venueName
        hasVariants
        variantCount
      }
      summary {
        soldQuantity
        previousSoldQuantity
        revenue
        previousRevenue
        cogs
        grossProfit
        profitMargin
        orderCount
        revenuePercentage
        rank
      }
      trend {
        ...ProductSalesDataPointFields
      }
      recentMovements {
        ...StockMovementSummaryFields
      }
      importHistory {
        ...StockMovementSummaryFields
      }
    }
  }
`;
