import { gql } from 'graphql-tag';

export const GET_SPORTS = gql`
  query GetSports {
    sports {
      _id
      type
      name
      nameEn
      icon
      emoji
      colorKey
      isPopular
      isActive
      displayOrder
    }
  }
`;
