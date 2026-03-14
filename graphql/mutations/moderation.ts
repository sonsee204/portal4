import { gql } from 'graphql-tag';

export const UPDATE_REPORT_STATUS = gql`
  mutation UpdateReportStatus($input: UpdateReportStatusInput!) {
    updateReportStatus(input: $input) {
      _id
      status
      notes
      reviewedAt
      reviewedBy
    }
  }
`;

export const UPDATE_USER_REPORT_STATUS = gql`
  mutation UpdateUserReportStatus($input: UpdateUserReportStatusInput!) {
    updateUserReportStatus(input: $input) {
      _id
      status
      notes
      reviewedAt
      reviewedBy
    }
  }
`;

export const DELETE_POST_BY_ADMIN = gql`
  mutation DeletePostByAdmin($postId: ID!) {
    deletePostByAdmin(postId: $postId)
  }
`;

export const UPDATE_MESSAGE_REPORT_STATUS = gql`
  mutation UpdateMessageReportStatus(
    $input: UpdateMessageReportStatusInput!
  ) {
    updateMessageReportStatus(input: $input) {
      _id
      status
      notes
      reviewedAt
      reviewedBy
    }
  }
`;

export const DELETE_MESSAGE_BY_ADMIN = gql`
  mutation DeleteMessageByAdmin($messageId: ID!) {
    deleteMessageByAdmin(messageId: $messageId)
  }
`;
