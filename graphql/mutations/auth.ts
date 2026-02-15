import { gql } from '@apollo/client';

export const REQUEST_PASSWORD_RESET = gql`
  mutation RequestPasswordReset($emailOrPhone: String!) {
    requestPasswordReset(emailOrPhone: $emailOrPhone) {
      success
      message
    }
  }
`;

export const RESET_PASSWORD = gql`
  mutation ResetPassword($input: ResetPasswordInput!) {
    resetPassword(input: $input) {
      success
      message
    }
  }
`;
