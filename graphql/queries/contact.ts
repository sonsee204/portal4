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

export const GET_CONTACT_INQUIRIES = gql`
  query GetContactInquiries(
    $filter: ContactInquiryFilterInput
    $pagination: CursorPageInput
  ) {
    contactInquiriesConnection(filter: $filter, pagination: $pagination) {
      edges {
        cursor
        node {
          _id
          name
          phone
          email
          subject
          message
          status
          adminNote
          repliedBy
          repliedAt
          repliedByUser {
            _id
            fullName
          }
          createdAt
          updatedAt
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
    }
  }
`;

export const GET_CONTACT_INQUIRY = gql`
  query GetContactInquiry($id: ID!) {
    getContactInquiry(id: $id) {
      _id
      name
      phone
      email
      subject
      message
      status
      adminNote
      repliedBy
      repliedAt
      repliedByUser {
        _id
        fullName
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_CONTACT_INQUIRY_STATS = gql`
  query GetContactInquiryStats {
    getContactInquiryStats {
      total
      newCount
      inProgressCount
      repliedCount
      closedCount
    }
  }
`;
