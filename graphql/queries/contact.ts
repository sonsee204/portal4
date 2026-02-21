import { gql } from 'graphql-tag';

export const GET_CONTACT_INQUIRIES = gql`
  query GetContactInquiries($filter: ContactInquiryFilterInput) {
    getContactInquiries(filter: $filter) {
      items {
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
      total
      page
      totalPages
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
