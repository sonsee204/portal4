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

const VENUE_SUMMARY_FIELDS = gql`
  fragment VenueSummaryFields on Venue {
    _id
    name
    status
    courtCount
    location {
      address
      city
    }
    isOwner
    isStaff
    myPermissions
  }
`;

export const GET_MY_VENUES_STATS = gql`
  query GetMyVenuesStats {
    myVenuesStats {
      totalVenues
      todayBookings
      totalRevenue
    }
  }
`;

export const MY_VENUES_CONNECTION = gql`
  ${VENUE_SUMMARY_FIELDS}
  query MyVenuesConnection($pagination: CursorPageInput) {
    myVenuesConnection(pagination: $pagination) {
      edges {
        cursor
        node {
          ...VenueSummaryFields
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }
`;

export const STAFFED_VENUES_CONNECTION = gql`
  ${VENUE_SUMMARY_FIELDS}
  query StaffedVenuesConnection($pagination: CursorPageInput) {
    staffedVenuesConnection(pagination: $pagination) {
      edges {
        cursor
        node {
          ...VenueSummaryFields
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }
`;

export const GET_VENUE_DETAIL = gql`
  query GetVenueDetail($venueId: ID!) {
    venue(venueId: $venueId) {
      _id
      name
      description
      status
      phoneNumber
      email
      courtCount
      coverImageUrl
      images
      operatingHours {
        dayOfWeek
        openTime
        closeTime
        isClosed
        is24Hours
      }
      location {
        address
        city
        district
        latitude
        longitude
      }
      orderTypeConfigs {
        orderType
        isEnabled
        label
        icon
        color
        displayOrder
      }
      isOwner
      isStaff
      myPermissions
      marginThresholds {
        warningMargin
        dangerMargin
      }
      recurringBookingEnabled
      slotDurationMinutes
    }
  }
`;

export const VENUES_CONNECTION = gql`
  ${VENUE_SUMMARY_FIELDS}
  query VenuesConnection(
    $filter: VenueFilterInput
    $sort: VenueSortInput
    $pagination: CursorPageInput
  ) {
    venuesConnection(filter: $filter, sort: $sort, pagination: $pagination) {
      edges {
        cursor
        node {
          ...VenueSummaryFields
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }
`;

export const VENUE_COURTS_CONNECTION = gql`
  query VenueCourtsConnection(
    $venueId: ID!
    $sort: CursorSortInput
    $pagination: CursorPageInput
  ) {
    venueCourtsConnection(
      venueId: $venueId
      sort: $sort
      pagination: $pagination
    ) {
      edges {
        cursor
        node {
          _id
          name
          sportType
          status
          defaultPricePerHour
          peakPricePerHour
          displayOrder
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }
`;

export const VENUE_BOOKINGS_CONNECTION = gql`
  query VenueBookingsConnection(
    $venueId: ID!
    $filter: BookingFilterInput
    $sort: BookingSortInput
    $pagination: CursorPageInput
  ) {
    venueBookingsConnection(
      venueId: $venueId
      filter: $filter
      sort: $sort
      pagination: $pagination
    ) {
      edges {
        cursor
        node {
          _id
          date
          status
          source
          isRecurring
          parentBookingId
          totalPrice
          finalAmount
          paymentMethod
          internalNote
          holdExpiresAt
          recurringConfig {
            frequency
            endDate
            totalSessions
            durationMonths
          }
          slots {
            courtId
            courtName
            startTime
            endTime
            price
          }
          customerDisplayName
          customerDisplayPhone
          customerInfo {
            name
            phone
          }
          customer {
            _id
            displayName
            phone
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }
`;

export const GET_BOOKING = gql`
  query GetBooking($bookingId: ID!) {
    booking(bookingId: $bookingId) {
      _id
      date
      status
      source
      isRecurring
      parentBookingId
      sessionNumber
      totalPrice
      serviceFee
      discount
      finalAmount
      isManualPrice
      manualPriceNote
      paymentMethod
      customerNote
      internalNote
      discountCode
      confirmedAt
      checkedInAt
      checkedOutAt
      cancelledAt
      cancellationReason
      holdExpiresAt
      createdAt
      slots {
        courtId
        courtName
        startTime
        endTime
        price
        isPeakHour
      }
      customer {
        _id
        displayName
        phone
        email
      }
      customerInfo {
        name
        phone
        email
      }
      venue {
        _id
        name
      }
      recurringConfig {
        frequency
        totalSessions
        endDate
      }
      parentBooking {
        _id
        date
      }
    }
  }
`;

export const VENUE_HOLD_BOOKINGS_CONNECTION = gql`
  query VenueHoldBookingsConnection(
    $venueId: ID!
   
    $pagination: CursorPageInput
  ) {
    venueHoldBookingsConnection(
      venueId: $venueId
      
      pagination: $pagination
    ) {
      edges {
        cursor
        node {
          _id
          date
          status
          holdExpiresAt
          slots {
            courtName
            startTime
            endTime
          }
          customerDisplayName
          customerDisplayPhone
          customerInfo {
            name
            phone
          }
          customer {
            _id
            displayName
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }
`;

export const VENUE_RECURRING_BOOKINGS_CONNECTION = gql`
  query VenueRecurringBookingsConnection(
    $venueId: ID!
    
    $pagination: CursorPageInput
  ) {
    venueRecurringBookingsConnection(
      venueId: $venueId
      
      pagination: $pagination
    ) {
      edges {
        cursor
        node {
          _id
          date
          status
          recurringConfig {
            frequency
            endDate
            totalSessions
            durationMonths
          }
          customerDisplayName
          customerDisplayPhone
          customerInfo {
            name
            phone
          }
          customer {
            _id
            displayName
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }
`;

export const VENUE_ORDERS_CONNECTION = gql`
  query VenueOrdersConnection(
    $venueId: ID!
    $filter: OrderFilterInput
    $sort: OrderSortInput
    $pagination: CursorPageInput
  ) {
    venueOrdersConnection(
      venueId: $venueId
      filter: $filter
      sort: $sort
      pagination: $pagination
    ) {
      edges {
        cursor
        node {
          _id
          orderCode
          status
          paymentStatus
          orderType
          totalAmount
          customerName
          customerPhone
          createdAt
          items {
            itemType
            quantity
            unitPrice
            productName
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }
`;

export const GET_ORDER = gql`
  query GetOrder($orderId: ID!) {
    order(orderId: $orderId) {
      _id
      orderCode
      orderType
      status
      paymentStatus
      paymentMethod
      customerName
      customerPhone
      customerInfo {
        name
        phone
        email
      }
      courtNumber
      tableNumber
      items {
        productName
        itemType
        quantity
        unitPrice
        totalPrice
        note
      }
      subtotal
      discount
      discountCode
      serviceFee
      tax
      totalAmount
      paidAmount
      paymentProofImages
      note
      internalNote
      isManualPrice
      manualPriceNote
      cancellationReason
      cancelledAt
      refundInfo {
        refundAmount
        refundPercent
        refundReason
        refundNote
        refundRequestedAt
        refundCompletedAt
      }
      confirmedAt
      inProgressAt
      readyAt
      deliveredAt
      completedAt
      paidAt
      createdAt
    }
  }
`;

export const ORDERS_PENDING_REFUND_CONNECTION = gql`
  query OrdersPendingRefundConnection(
    $venueId: ID!
    $pagination: CursorPageInput
  ) {
    ordersPendingRefundConnection(venueId: $venueId, pagination: $pagination) {
      edges {
        cursor
        node {
          _id
          orderCode
          status
          paymentStatus
          totalAmount
          refundInfo {
            refundAmount
          }
          customerName
          createdAt
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }
`;

export const VENUE_PRODUCTS_CONNECTION = gql`
  query VenueProductsConnection(
    $venueId: ID!
    $filter: ProductFilterInput
    
    $pagination: CursorPageInput
  ) {
    venueProductsConnection(
      venueId: $venueId
      filter: $filter
      
      pagination: $pagination
    ) {
      edges {
        cursor
        node {
          _id
          name
          sku
          unit
          price
          averageCost
          status
          stockQuantity
          trackInventory
          lowStockThreshold
          lastImportPrice
          totalImportValue
          totalImportQuantity
          category {
            _id
            name
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }
`;

export const LOW_STOCK_PRODUCTS = gql`
  query LowStockProducts($venueId: ID!) {
    lowStockProducts(venueId: $venueId) {
      _id
      name
      stockQuantity
      lowStockThreshold
    }
  }
`;

export const PRODUCT_STATS = gql`
  query ProductStats($venueId: ID!) {
    productStats(venueId: $venueId) {
      totalProducts
      activeProducts
      outOfStockProducts
      lowStockProducts
    }
  }
`;

export const PRODUCT_SALES_ANALYTICS = gql`
  query ProductSalesAnalytics($venueId: ID!, $period: String) {
    productSalesAnalytics(venueId: $venueId, period: $period) {
      period
      summary {
        totalRevenue
        totalItemsSold
        totalOrders
        bestSellingProduct
        revenueChangePercent
        itemsChangePercent
      }
      salesTrend {
        label
        revenue
        quantitySold
        orderCount
      }
      topProducts {
        productId
        productName
        categoryName
        quantitySold
        revenue
        revenuePercentage
      }
    }
  }
`;

export const VENUE_CATEGORIES_CONNECTION = gql`
  query VenueCategoriesConnection(
    $venueId: ID!
    $sort: CursorSortInput
    $pagination: CursorPageInput
  ) {
    venueCategoriesConnection(
      venueId: $venueId
      sort: $sort
      pagination: $pagination
    ) {
      edges {
        cursor
        node {
          _id
          name
          slug
          displayOrder
          productCount
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }
`;

export const VENUE_STAFF_CONNECTION = gql`
  query VenueStaffConnection(
    $venueId: ID!
    
    $pagination: CursorPageInput
  ) {
    venueStaffConnection(
      venueId: $venueId
      
      pagination: $pagination
    ) {
      edges {
        cursor
        node {
          _id
          isOwner
          permissions
          status
          customTitle
          joinedAt
          user {
            _id
            displayName
            phone
            email
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }
`;

export const VENUE_PENDING_INVITATIONS = gql`
  query VenuePendingInvitations($venueId: ID!) {
    venuePendingInvitations(venueId: $venueId) {
      _id
      isOwner
      permissions
      status
      customTitle
      user {
        _id
        displayName
        phone
        email
      }
    }
  }
`;

export const VENUE_REVENUE_STATS = gql`
  query VenueRevenueStats($venueId: ID!, $period: String) {
    venueRevenueStats(venueId: $venueId, period: $period) {
      period
      startDate
      endDate
      growthPercentage
      totalCollectedRevenue
      totalExpectedRevenue
      bookingRevenue {
        collectedRevenue
        expectedRevenue
      }
      orderRevenue {
        collectedRevenue
        expectedRevenue
      }
    }
  }
`;

export const BOOKING_STATS = gql`
  query BookingStats($venueId: ID!, $fromDate: String, $toDate: String) {
    bookingStats(venueId: $venueId, fromDate: $fromDate, toDate: $toDate) {
      totalBookings
      pendingBookings
      confirmedBookings
      completedBookings
      cancelledBookings
      todayBookings
    }
  }
`;

export const ORDER_STATS = gql`
  query OrderStats($venueId: ID!, $fromDate: String, $toDate: String) {
    orderStats(venueId: $venueId, fromDate: $fromDate, toDate: $toDate) {
      totalOrders
      pendingOrders
      completedOrders
      cancelledOrders
      todayOrders
      totalRevenue
      todayRevenue
    }
  }
`;

export const ORDER_ANALYTICS = gql`
  query OrderAnalytics($venueId: ID!, $period: String) {
    orderAnalytics(venueId: $venueId, period: $period) {
      period
      summary {
        totalOrders
        totalRevenue
        averageOrderValue
        revenueChangePercent
      }
      revenueTrend {
        label
        value
      }
      topProducts {
        productName
        revenue
        quantitySold
      }
    }
  }
`;

export const VENUE_ANALYTICS = gql`
  query VenueAnalytics($venueId: ID!, $period: String) {
    venueAnalytics(venueId: $venueId, period: $period) {
      period
      summary {
        totalBookings
        totalRevenue
        averageBookingValue
        revenueChangePercent
        peakDay
        peakHour
      }
      revenueTrend {
        label
        value
      }
      bookingDistribution {
        label
        value
      }
      heatMapData {
        hour
        day
        bookings
        intensity
      }
    }
  }
`;

export const MY_VENUES_FOR_PRODUCT_TRANSFER = gql`
  query MyVenuesForProductTransfer {
    myVenuesForProductTransfer {
      _id
      name
      coverImageUrl
    }
  }
`;

export const GET_MY_VENUE_AVAILABILITY = gql`
  query GetMyVenueAvailability($venueId: ID!, $date: String!) {
    myVenueAvailability(venueId: $venueId, date: $date) {
      date
      courts {
        courtId
        courtName
        sportType
        courtStatus
        slots {
          startTime
          endTime
          price
          isPeakHour
          isAvailable
          isPast
          isHold
          holdBookingId
          bookingId
          bookingStatus
          customerName
          customerPhone
          isRecurring
          
          
        }
      }
    }
  }
`;

export const LOOKUP_CUSTOMER_BY_PHONE = gql`
  query LookupCustomerByPhone($phone: String!) {
    lookupCustomerByPhone(phone: $phone) {
      _id
      displayName
      phone
      email
    }
  }
`;

export const GET_VENUE_ENABLED_ORDER_TYPES = gql`
  query GetVenueEnabledOrderTypes($venueId: ID!) {
    venue(venueId: $venueId) {
      _id
      name
      hasOrderService
      enabledOrderTypes {
        orderType
        isEnabled
        label
        icon
        color
        displayOrder
      }
    }
  }
`;

export { VALIDATE_ORDER_PROMO_CODE } from './promotions/queries';
export {
  VALIDATE_PROMO_CODE,
  CALCULATE_BOOKING_DISCOUNT,
  GET_AVAILABLE_PROMOTIONS_FOR_BOOKING,
  CHECK_RECURRING_AVAILABILITY,
} from './booking/queries';
