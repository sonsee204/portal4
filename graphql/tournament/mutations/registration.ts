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
import {
  REGISTRATION_CORE_FRAGMENT,
  MATCH_CORE_FRAGMENT,
} from '@/graphql/tournament/fragments';

export const APPROVE_REGISTRATION = gql`
  mutation ApproveRegistration($input: ApproveRegistrationInput!) {
    approveRegistration(input: $input) {
      ...RegistrationCore
    }
  }
  ${REGISTRATION_CORE_FRAGMENT}
`;

export const REJECT_REGISTRATION = gql`
  mutation RejectRegistration($input: RejectRegistrationInput!) {
    rejectRegistration(input: $input) {
      ...RegistrationCore
    }
  }
  ${REGISTRATION_CORE_FRAGMENT}
`;

export const BULK_APPROVE_REGISTRATIONS = gql`
  mutation BulkApproveRegistrations($input: BulkRegistrationActionInput!) {
    bulkApproveRegistrations(input: $input)
  }
`;

export const BULK_REJECT_REGISTRATIONS = gql`
  mutation BulkRejectRegistrations($input: BulkRegistrationActionInput!) {
    bulkRejectRegistrations(input: $input)
  }
`;

export const UPDATE_PAYMENT_STATUS = gql`
  mutation UpdatePaymentStatus($input: UpdatePaymentStatusInput!) {
    updatePaymentStatus(input: $input) {
      ...RegistrationCore
    }
  }
  ${REGISTRATION_CORE_FRAGMENT}
`;

export const DELETE_REGISTRATION = gql`
  mutation DeleteRegistration($input: DeleteRegistrationInput!) {
    deleteRegistration(input: $input) {
      success
      message
    }
  }
`;

export const BULK_IMPORT_REGISTRATIONS = gql`
  mutation BulkImportRegistrations($input: BulkImportRegistrationsInput!) {
    bulkImportRegistrations(input: $input) {
      successCount
      failedCount
      errors {
        row
        athleteName
        reason
      }
    }
  }
`;

export const ADD_LATE_ENTRY_TO_BYE_SLOT = gql`
  mutation AddLateEntryToByeSlot($input: AddLateEntryToByeSlotInput!) {
    addLateEntryToByeSlot(input: $input) {
      action
      message
      opponentName
      selectedFromCount
      scheduleNeedsUpdate
      registration {
        ...RegistrationCore
      }
      match {
        ...MatchCore
      }
    }
  }
  ${REGISTRATION_CORE_FRAGMENT}
  ${MATCH_CORE_FRAGMENT}
`;

export const UPDATE_REGISTRATION_BIB_NUMBER = gql`
  mutation UpdateRegistrationBibNumber($input: UpdateBibNumberInput!) {
    updateRegistrationBibNumber(input: $input) {
      ...RegistrationCore
    }
  }
  ${REGISTRATION_CORE_FRAGMENT}
`;
