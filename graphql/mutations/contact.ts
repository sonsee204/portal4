import { gql } from 'graphql-tag';

export const UPDATE_CONTACT_INQUIRY_STATUS = gql`
  mutation UpdateContactInquiryStatus(
    $id: ID!
    $input: UpdateInquiryStatusInput!
  ) {
    updateContactInquiryStatus(id: $id, input: $input) {
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
