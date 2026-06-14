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

export const GET_OTP_TEST_PHONES = gql`
  query GetOtpTestPhones(
    $pagination: CursorPageInput
    $filter: OtpTestPhoneFilterInput
  ) {
    otpTestPhonesConnection(pagination: $pagination, filter: $filter) {
      edges {
        cursor
        node {
          _id
          phone
          testCode
          label
          enabled
          allowedPurposes
          expiresAt
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

export const CREATE_OTP_TEST_PHONE = gql`
  mutation CreateOtpTestPhone($input: CreateOtpTestPhoneInput!) {
    createOtpTestPhone(input: $input) {
      _id
      phone
      testCode
      label
      enabled
      allowedPurposes
      expiresAt
      createdAt
    }
  }
`;

export const UPDATE_OTP_TEST_PHONE = gql`
  mutation UpdateOtpTestPhone($id: ID!, $input: UpdateOtpTestPhoneInput!) {
    updateOtpTestPhone(id: $id, input: $input) {
      _id
      phone
      testCode
      label
      enabled
      allowedPurposes
      expiresAt
      updatedAt
    }
  }
`;

export const SET_OTP_TEST_PHONE_ENABLED = gql`
  mutation SetOtpTestPhoneEnabled($id: ID!, $enabled: Boolean!) {
    setOtpTestPhoneEnabled(id: $id, enabled: $enabled) {
      _id
      enabled
      updatedAt
    }
  }
`;
