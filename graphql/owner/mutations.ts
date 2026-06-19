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

export const UPDATE_VENUE = gql`
  mutation UpdateVenue($input: UpdateVenueInput!) {
    updateVenue(input: $input) {
      _id
      name
      status
    }
  }
`;

export const UPDATE_VENUE_ORDER_TYPE_CONFIGS = gql`
  mutation UpdateVenueOrderTypeConfigs($input: UpdateVenueOrderTypeConfigsInput!) {
    updateVenueOrderTypeConfigs(input: $input) {
      _id
      orderTypeConfigs {
        orderType
        isEnabled
        label
      }
    }
  }
`;

export const CREATE_COURT = gql`
  mutation CreateCourt($input: CreateCourtInput!) {
    createCourt(input: $input) {
      _id
      name
      sportType
      status
    }
  }
`;

export const UPDATE_COURT = gql`
  mutation UpdateCourt($input: UpdateCourtInput!) {
    updateCourt(input: $input) {
      _id
      name
      sportType
      status
      defaultPricePerHour
      peakPricePerHour
    }
  }
`;

export const DELETE_COURT = gql`
  mutation DeleteCourt($courtId: ID!) {
    deleteCourt(courtId: $courtId)
  }
`;

export const CONFIRM_BOOKING = gql`
  mutation ConfirmBooking($bookingId: ID!) {
    confirmBooking(bookingId: $bookingId) {
      booking {
        _id
        status
      }
    }
  }
`;

export const REJECT_BOOKING = gql`
  mutation RejectBooking($bookingId: ID!, $reason: String) {
    rejectBooking(bookingId: $bookingId, reason: $reason) {
      _id
      status
    }
  }
`;

export const CANCEL_BOOKING = gql`
  mutation CancelBooking($bookingId: ID!, $reason: String) {
    cancelBooking(bookingId: $bookingId, reason: $reason) {
      _id
      status
    }
  }
`;

export const COMPLETE_BOOKING = gql`
  mutation CompleteBooking($bookingId: ID!) {
    completeBooking(bookingId: $bookingId) {
      _id
      status
    }
  }
`;

export const CHECK_IN_BOOKING = gql`
  mutation CheckInBooking($bookingId: ID!) {
    checkIn(bookingId: $bookingId) {
      _id
      status
    }
  }
`;

export const MARK_NO_SHOW = gql`
  mutation MarkNoShow($bookingId: ID!) {
    markNoShow(bookingId: $bookingId) {
      _id
      status
    }
  }
`;

export const APPROVE_HOLD_BOOKING = gql`
  mutation ApproveHoldBooking($input: ApproveHoldBookingInput!) {
    approveHoldBooking(input: $input) {
      _id
      status
    }
  }
`;

export const CONFIRM_HOLD_BOOKING = gql`
  mutation ConfirmHoldBooking($bookingId: ID!, $paymentMethod: PaymentMethod) {
    confirmHoldBooking(bookingId: $bookingId, paymentMethod: $paymentMethod) {
      booking {
        _id
        status
      }
    }
  }
`;

export const REJECT_HOLD_BOOKING = gql`
  mutation RejectHoldBooking($bookingId: ID!, $reason: String) {
    rejectHoldBooking(bookingId: $bookingId, reason: $reason) {
      _id
      status
    }
  }
`;

export const CREATE_STAFF_ORDER = gql`
  mutation CreateStaffOrder($input: CreateOrderInput!) {
    createStaffOrder(input: $input) {
      _id
      orderCode
      status
      totalAmount
    }
  }
`;

export const CONFIRM_ORDER = gql`
  mutation ConfirmOrder($orderId: ID!) {
    confirmOrder(orderId: $orderId) {
      _id
      status
    }
  }
`;

export const MARK_ORDER_PREPARING = gql`
  mutation MarkOrderPreparing($orderId: ID!) {
    markOrderPreparing(orderId: $orderId) {
      _id
      status
    }
  }
`;

export const MARK_ORDER_READY = gql`
  mutation MarkOrderReady($orderId: ID!) {
    markOrderReady(orderId: $orderId) {
      _id
      status
    }
  }
`;

export const MARK_ORDER_DELIVERED = gql`
  mutation MarkOrderDelivered($orderId: ID!) {
    markOrderDelivered(orderId: $orderId) {
      _id
      status
    }
  }
`;

export const COMPLETE_ORDER = gql`
  mutation CompleteOrder($orderId: ID!) {
    completeOrder(orderId: $orderId) {
      _id
      status
    }
  }
`;

export const UPLOAD_PAYMENT_PROOF = gql`
  mutation UploadPaymentProof($input: UploadPaymentProofInput!) {
    uploadPaymentProof(input: $input) {
      _id
      paymentProofImages
    }
  }
`;

export const REMOVE_PAYMENT_PROOF_IMAGE = gql`
  mutation RemovePaymentProofImage($orderId: ID!, $imageUrl: String!) {
    removePaymentProofImage(orderId: $orderId, imageUrl: $imageUrl) {
      _id
      paymentProofImages
    }
  }
`;

export const CANCEL_ORDER = gql`
  mutation CancelOrder($orderId: ID!, $reason: String) {
    cancelOrder(orderId: $orderId, reason: $reason) {
      _id
      status
    }
  }
`;

export const CANCEL_ORDER_WITH_REFUND = gql`
  mutation CancelOrderWithRefund(
    $orderId: ID!
    $reason: String!
    $refundPercent: Int
    $refundNote: String
  ) {
    cancelOrderWithRefund(
      orderId: $orderId
      reason: $reason
      refundPercent: $refundPercent
      refundNote: $refundNote
    ) {
      _id
      status
      paymentStatus
    }
  }
`;

export const CREATE_PRODUCT = gql`
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
      _id
      name
      price
      status
    }
  }
`;

export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($input: UpdateProductInput!) {
    updateProduct(input: $input) {
      _id
      name
      price
      status
      stockQuantity
    }
  }
`;

export const DELETE_PRODUCT = gql`
  mutation DeleteProduct($productId: ID!) {
    deleteProduct(productId: $productId)
  }
`;

export const PUBLISH_PRODUCT = gql`
  mutation PublishProduct($productId: ID!) {
    publishProduct(productId: $productId) {
      _id
      status
    }
  }
`;

export const UNPUBLISH_PRODUCT = gql`
  mutation UnpublishProduct($productId: ID!) {
    unpublishProduct(productId: $productId) {
      _id
      status
    }
  }
`;

export const IMPORT_STOCK = gql`
  mutation ImportStock($venueId: ID!, $input: ImportStockInput!) {
    importStock(venueId: $venueId, input: $input) {
      _id
      productId
      quantity
      importPrice
      totalCost
      previousStock
      newStock
      createdAt
    }
  }
`;

export const CREATE_PRODUCT_CATEGORY = gql`
  mutation CreateProductCategory($input: CreateProductCategoryInput!) {
    createProductCategory(input: $input) {
      _id
      name
    }
  }
`;

export const UPDATE_PRODUCT_CATEGORY = gql`
  mutation UpdateProductCategory($input: UpdateProductCategoryInput!) {
    updateProductCategory(input: $input) {
      _id
      name
    }
  }
`;

export const DELETE_PRODUCT_CATEGORY = gql`
  mutation DeleteProductCategory($categoryId: ID!) {
    deleteProductCategory(categoryId: $categoryId)
  }
`;

export const CREATE_STAFF_BOOKING = gql`
  mutation CreateStaffBooking($input: CreateStaffBookingInput!) {
    createStaffBooking(input: $input) {
      booking {
        _id
        date
        status
        finalAmount
        slots {
          courtId
          courtName
          startTime
          endTime
          price
        }
        customer {
          _id
          displayName
          phone
        }
      }
      order {
        _id
        orderCode
        status
        totalAmount
      }
    }
  }
`;

export const ADD_VENUE_STAFF = gql`
  mutation AddVenueStaff(
    $venueId: ID!
    $userId: ID!
    $permissions: [VenueAction!]!
    $customTitle: String
  ) {
    addVenueStaff(
      venueId: $venueId
      userId: $userId
      permissions: $permissions
      customTitle: $customTitle
    ) {
      _id
      permissions
      status
    }
  }
`;

export const UPDATE_VENUE_STAFF_PERMISSIONS = gql`
  mutation UpdateVenueStaffPermissions(
    $venueId: ID!
    $userId: ID!
    $permissions: [VenueAction!]!
  ) {
    updateVenueStaffPermissions(
      venueId: $venueId
      userId: $userId
      permissions: $permissions
    ) {
      _id
      permissions
    }
  }
`;

export const UPDATE_VENUE_STAFF_TITLE = gql`
  mutation UpdateVenueStaffTitle(
    $venueId: ID!
    $userId: ID!
    $customTitle: String!
  ) {
    updateVenueStaffTitle(
      venueId: $venueId
      userId: $userId
      customTitle: $customTitle
    ) {
      _id
      customTitle
      permissions
      status
    }
  }
`;

export const REMOVE_VENUE_STAFF = gql`
  mutation RemoveVenueStaff($venueId: ID!, $userId: ID!) {
    removeVenueStaff(venueId: $venueId, userId: $userId)
  }
`;
