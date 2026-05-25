import { gql } from 'graphql-tag';

export const GET_OTP_TEST_PHONES = gql`
  query GetOtpTestPhones(
    $pagination: PaginationInput
    $filter: OtpTestPhoneFilterInput
  ) {
    otpTestPhones(pagination: $pagination, filter: $filter) {
      items {
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
      total
      page
      limit
      hasMore
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
